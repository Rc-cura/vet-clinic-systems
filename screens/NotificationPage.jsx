import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';

export default function NotificationsPage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      if (!user) return;
      setLoading(true);

      try {
        // 1. Kunin ang standard notifications (assuming 'notifications' ang table mo)
        const { data: notifData } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id) // adjust mo if iba ang column name sa DB mo
          .order('created_at', { ascending: false })
          .limit(20);

        const standardNotifs = (notifData || []).map(n => ({
          id: `notif-${n.id}`,
          title: n.title,
          message: n.message,
          created_at: n.created_at,
          is_read: n.is_read,
          is_chat: false
        }));

        // 2. Kunin ang recent messages kung saan ikaw ang receiver
        const { data: chatMsgs } = await supabase
          .from('messages')
          .select('id, content, created_at, sender_id, is_read')
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        let chatNotifications = [];

        if (chatMsgs && chatMsgs.length > 0) {
          const senderIds = [...new Set(chatMsgs.map(m => m.sender_id))];
          
          const { data: senderProfiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', senderIds);

          chatNotifications = chatMsgs.map(msg => {
            const profile = senderProfiles?.find(p => p.id === msg.sender_id);
            return {
              id: `chat-${msg.id}`,
              title: `Message from ${profile?.first_name || 'Clinic'} ${profile?.last_name || 'Staff'}`,
              message: msg.content,
              created_at: msg.created_at,
              is_read: msg.is_read,
              is_chat: true
            };
          });
        }

        // 3. Pagsamahin at i-sort mula pinakabago pababa
        const combined = [...standardNotifs, ...chatNotifications].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(combined);
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isFocused) {
      loadNotifications();
    }
  }, [isFocused, user]);

  const markAllAsRead = async () => {
    if (!user) return;
    
    // UI Update muna para mabilis
    setNotifications(prev => prev.map(item => ({ ...item, is_read: true })));

    // Database Update
    await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id).eq('is_read', false);
    await supabase.from('messages').update({ is_read: true }).eq('receiver_id', user.id).eq('is_read', false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, !item.is_read ? styles.unreadCard : styles.readCard]}>
      <View style={styles.iconWrapper}>
        {item.is_chat ? (
          <Ionicons name="chatbubble-ellipses" size={24} color={!item.is_read ? "#2E3A91" : "#94A3B8"} />
        ) : (
          <Ionicons name="notifications" size={24} color={!item.is_read ? "#2E3A91" : "#94A3B8"} />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, !item.is_read && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Text>
      </View>
      {!item.is_read && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markReadBtn}>
          <Ionicons name="checkmark-done" size={18} color="#2E3A91" />
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={50} color="#CBD5E1" />
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { paddingRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  markReadText: { fontSize: 12, fontWeight: 'bold', color: '#2E3A91', marginLeft: 4 },
  
  card: { flexDirection: 'row', padding: 15, borderRadius: 20, marginBottom: 12, borderWidth: 1 },
  unreadCard: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  readCard: { backgroundColor: '#FFF', borderColor: '#E2E8F0' },
  
  iconWrapper: { marginRight: 15, marginTop: 5 },
  textContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  unreadText: { color: '#2E3A91', fontWeight: '900' },
  message: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  time: { fontSize: 11, color: '#94A3B8', marginTop: 8, fontWeight: '500' },
  
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', marginTop: 8, marginLeft: 10 },

  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 16, fontWeight: 'bold' }
});