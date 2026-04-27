import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import Supabase and your User Context
import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext'; 

export default function Chat() {
  const navigation = useNavigation();
  const { user } = useUser(); // Ang current logged-in na Pet Owner

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  
  const flatListRef = useRef(null);

  // ================= 1. KUNIN ANG MGA SECRETARY AT LATEST MESSAGE =================
  const fetchContacts = async () => {
    if (!user) return;
    try {
      // Kunin ang mga Secretary
      const { data: staffData, error: staffError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('role', 'secretary');

      // Kunin lahat ng messages ng user na ito para sa "Latest Message" snippet at Unread count
      const { data: msgsData, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .or(`receiver_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (staffData && msgsData) {
        const formattedContacts = staffData.map(staff => {
          // Hanapin ang latest message sa pagitan ng user at ng staff na ito
          const contactMsgs = msgsData.filter(m => 
            (m.sender_id === staff.id && m.receiver_id === user.id) || 
            (m.sender_id === user.id && m.receiver_id === staff.id)
          );
          
          const latestMsg = contactMsgs.length > 0 ? contactMsgs[0] : null;
          
          // I-check kung unread ba yung message at ikaw ang receiver
          const hasUnread = latestMsg && latestMsg.receiver_id === user.id && latestMsg.is_read === false;

          return {
            id: staff.id,
            name: `${staff.first_name} ${staff.last_name}`,
            role: staff.role,
            latestMessage: latestMsg ? latestMsg.content : 'No messages yet.',
            time: latestMsg ? new Date(latestMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            hasUnread: hasUnread
          };
        });
        
        // I-sort para nasa taas yung may bagong unread message
        formattedContacts.sort((a, b) => (a.hasUnread === b.hasUnread ? 0 : a.hasUnread ? -1 : 1));
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    // Real-time listener para sa listahan ng contacts (pang update ng unread dot)
    const contactsChannel = supabase
      .channel('public:messages_list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchContacts();
      })
      .subscribe();

    return () => { supabase.removeChannel(contactsChannel); };
  }, [user]);

  // ================= 2. REAL-TIME CHAT LOGIC AT MARK AS READ =================
  useEffect(() => {
    if (!user || !selectedContact) return;

    const loadChatRoom = async () => {
      // 1. Mark as Read - i-uupdate ang database kapag binuksan ang chat
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', selectedContact.id)
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      // Tanggalin ang blue dot sa local state agad
      setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, hasUnread: false } : c));

      // 2. I-fetch ang lahat ng messages para idisplay
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    
    loadChatRoom();

    // Listener para pumasok agad ang chat kahit hindi i-refresh ang app
    const channel = supabase
      .channel(`chat_${selectedContact.id}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === selectedContact.id) ||
            (newMsg.sender_id === selectedContact.id && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
            
            // Auto mark-as-read kapag bukas yung chat room mo at may pumasok
            if (newMsg.receiver_id === user.id) {
              supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id).then();
            }
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedContact]);

  // ================= 3. SEND MESSAGE =================
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      console.error("User is not logged in!");
      return;
    }

    const messageText = newMessage;
    setNewMessage(''); 

    const { error } = await supabase.from('messages').insert({
      sender_id: authUser.id,
      receiver_id: selectedContact.id,
      content: messageText,
      is_read: false // Default ay unread para sa receiver
    });

    if (error) {
      console.error('Chat Error:', error);
      Alert.alert("Error", "Failed to send message.");
    }
  };

  // ================= RENDER 1: CONTACTS LIST =================
  if (!selectedContact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 40 }} />
        </View>

        {loadingContacts ? (
          <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.contactCard}
                onPress={() => setSelectedContact(item)} 
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, item.hasUnread && styles.boldText]}>{item.name}</Text>
                  {/* Nagpapakita ng snippet ng chat, nag-iiba din ang kulay kung unread */}
                  <Text 
                    style={[styles.latestMessageText, item.hasUnread && styles.unreadMessageText]} 
                    numberOfLines={1}
                  >
                    {item.latestMessage} • {item.time}
                  </Text>
                </View>
                
                {/* BLUE DOT INDICATOR */}
                {item.hasUnread && <View style={styles.unreadDot} />}

              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No clinic staff available right now.</Text>}
          />
        )}
      </SafeAreaView>
    );
  }

  // ================= RENDER 2: CHAT ROOM =================
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedContact(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{selectedContact.name}</Text>
            <Text style={styles.onlineText}>Clinic Staff</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Chat Bubbles */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.sender_id === user?.id;
            return (
              <View style={[styles.messageBubbleWrapper, isMe ? styles.messageBubbleRight : styles.messageBubbleLeft]}>
                <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
                  <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                    {item.content}
                  </Text>
                </View>
                <Text style={styles.timeText}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          }}
        />

        {/* Input Text Box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#AAA"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 5 },
  backBtnText: { fontSize: 28, color: '#2E3A91' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  onlineText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  avatarPlaceholder: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: '#2E3A91',
    alignItems: 'center', justifyContent: 'center', marginRight: 15,
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  
  contactInfo: { flex: 1, paddingRight: 10 },
  contactName: { fontSize: 16, color: '#1E293B', marginBottom: 3 },
  boldText: { fontWeight: '900', color: '#0F172A' },
  
  latestMessageText: { fontSize: 13, color: '#64748B' },
  unreadMessageText: { fontWeight: 'bold', color: '#1E293B' },
  
  unreadDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3B82F6', marginLeft: 5 },

  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 50 },

  messageBubbleWrapper: { marginBottom: 15, maxWidth: '80%' },
  messageBubbleRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  messageBubbleLeft: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  messageBubble: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20 },
  myBubble: { backgroundColor: '#2E3A91', borderBottomRightRadius: 5 },
  theirBubble: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 5 },
  messageText: { fontSize: 14 },
  myMessageText: { color: '#FFF' },
  theirMessageText: { color: '#334155' },
  timeText: { fontSize: 10, color: '#94A3B8', marginTop: 4, paddingHorizontal: 5 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 15, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20,
    paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12,
    maxHeight: 100, fontSize: 14, color: '#1E293B',
  },
  sendBtn: {
    backgroundColor: '#2E3A91', width: 45, height: 45, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginBottom: 2,
  },
  sendBtnText: { color: '#FFF', fontSize: 18, marginLeft: 2 },
});