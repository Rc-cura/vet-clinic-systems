import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
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

  // ================= 1. KUNIN ANG MGA SECRETARY =================
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: staffData, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'secretary'); // Hahanapin lang ang mga secretary

        if (staffData) {
          const formattedContacts = staffData.map(staff => ({
            id: staff.id,
            name: `${staff.first_name} ${staff.last_name}`,
            role: staff.role,
          }));
          setContacts(formattedContacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // ================= 2. REAL-TIME CHAT LOGIC =================
  useEffect(() => {
    if (!user || !selectedContact) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    
    fetchMessages();

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
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedContact]);

  // ================= 3. SEND MESSAGE =================
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedContact) return;

    const messageText = newMessage;
    setNewMessage(''); 

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedContact.id,
      content: messageText
    });

    if (error) console.error('Chat Error:', error);
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
                <View>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactRole}>Clinic Staff</Text>
                </View>
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
            <Text style={styles.onlineText}>● Online</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#2E3A91' },
  onlineText: { fontSize: 10, color: '#10B981', fontWeight: 'bold', marginTop: 2 },
  
  contactCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FD',
    padding: 15, borderRadius: 20, marginBottom: 15,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#2E3A91',
    alignItems: 'center', justifyContent: 'center', marginRight: 15,
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  contactRole: { fontSize: 11, color: '#64748B', textTransform: 'uppercase', marginTop: 2 },
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