import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function MessageHub() {
  const navigation = useNavigation();

  const chats = [
    { id: '1', role: 'Secretary', text: 'Lorem ipsum dolor sit amet, consectetur...' },
    { id: '2', role: 'Secretary', text: 'Lorem ipsum dolor sit amet, consectetur...' },
    { id: '3', role: 'Veterinary', text: 'Lorem ipsum dolor sit amet, consectetur...' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={MyStyleSheet.chatItem}>
      <View style={MyStyleSheet.avatarCircle}>
        <Text style={{ color: '#FFF', fontSize: 24 }}>👤</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={MyStyleSheet.chatName}>{item.role}</Text>
        <Text style={MyStyleSheet.chatSnippet} numberOfLines={1}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={MyStyleSheet.messageHub_container}>
      


      {/* Search Input */}
      <View style={[MyStyleSheet.searchContainer, { marginTop: 20 }]}>
        <Text style={{ marginRight: 10 }}>🔍</Text>
        <TextInput 
          placeholder="Search Chat" 
          placeholderTextColor="#8E8E8E"
          style={{ flex: 1 }}
        />
      </View>

      {/* Main Chat Card */}
      <View style={MyStyleSheet.chatList_card}>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </SafeAreaView>
  );
}