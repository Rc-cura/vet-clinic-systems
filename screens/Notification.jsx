import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function Notification() {
  const opx = useNavigation()
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
      unread: false // Ginawang false para ma-test ang 'Read' tab
    },
  ]

  // --- FILTER LOGIC ---
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'Unread') return notif.unread === true;
    if (activeTab === 'Read') return notif.unread === false;
    return true; // 'See All' - ibabalik lahat
  })

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={MyStyleSheet.notifHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Image source={require('../public/back_arrow.svg')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text style={MyStyleSheet.notifHeaderText}>Notifications</Text>
        <View style={{ width: 24 }} /> 
      </View>

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

      <FlatList
        data={filteredNotifications} // Gamitin ang filtered array dito
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        // Empty state message kung walang notification sa tab
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>
            No {activeTab.toLowerCase()} notifications.
          </Text>
        }
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