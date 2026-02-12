import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function Notification() {
  const [activeTab, setActiveTab] = useState('Unread')

  const notifications = [
    { 
      id: '1', 
      type: 'Appointment', 
      icon: require('../public/Calendar.svg'), 
      time: '1h ago', 
      text: "Your visit for Luna's annual checkup is confirmed for Feb 2nd at 10:00 AM.", 
      unread: true 
    },
    { 
      id: '2', 
      type: 'Billing', 
      icon: require('../public/Bill.svg'), 
      time: '10 mins ago', 
      text: "Your receipt for today's visit is ready for download. View it in your Billing tab.", 
      unread: true 
    },
    { 
      id: '3', 
      type: 'Appointment', 
      icon: require('../public/Calendar.svg'), 
      time: '3h ago', 
      text: "Bill's grooming session starts in 2 hours.", 
      unread: true 
    },
  ]

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* The Custom Header was removed from here. 
        The system will now use its own header at the top.
      */}

      {/* Segmented Filter Tab */}
      <View style={MyStyleSheet.tabBar}>
        {['Unread', 'Read', 'See All'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[MyStyleSheet.tabItem, activeTab === tab && MyStyleSheet.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[MyStyleSheet.tabText, activeTab === tab && MyStyleSheet.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        renderItem={({ item }) => (
          <View style={MyStyleSheet.notifCard}>
            <View style={MyStyleSheet.notifRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item.icon} style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={MyStyleSheet.notifType}>{item.type}</Text>
                {item.unread && <View style={MyStyleSheet.unreadDot} />}
              </View>
              <Text style={MyStyleSheet.notifTime}>{item.time}</Text>
            </View>
            <Text style={MyStyleSheet.notifBody}>{item.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}