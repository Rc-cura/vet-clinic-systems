import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 
import { Appointments } from '../App' 

export default function AppointmentPage() {
  const opx = useNavigation()
  const isFocused = useIsFocused() 
  const { user } = useUser() 
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Toggle for the manual bottom drawer
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setRefreshTrigger(prev => prev + 1)
    }
  }, [isFocused])

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    return `${weekday}, ${day} ${month}`;
  };

  const filteredData = activeTab === 'See All' 
    ? [...Appointments].reverse() 
    : [...Appointments].filter(item => item.type === activeTab).reverse()

  const handleCardPress = (item) => {
    if (item.status === 'Pending Confirmation') {
      opx.navigate('pending', { appointment: item });
    } else if (item.status === 'Approved' || item.status === 'Scheduled') {
      opx.navigate('approved', { appointment: item });
    } else if (item.status === 'Completed') {
      opx.navigate('completed', { appointment: item });
    } else if (item.status === 'Cancelled') {
      opx.navigate('cancelled', { appointment: item });
    }
  }

  // --- RESTORED: Your original appointment card design ---
  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity 
      style={MyStyleSheet.apptCard} 
      activeOpacity={0.7} 
      onPress={() => handleCardPress(item)}
    >
      <View style={MyStyleSheet.apptCardContent}>
        <View style={{ flex: 1 }}>
          <Text style={MyStyleSheet.apptDateText}>
            {formatDisplayDate(item.date)}   <Text style={{fontWeight: '400'}}>{item.time}</Text>
          </Text>
          
          <View style={MyStyleSheet.apptServiceRow}>
            <Image source={require('../public/medical_icon.png')} style={{ width: 18, height: 18 }} />
            <Text style={MyStyleSheet.apptServiceName}>{item.service}</Text>
          </View>
          
          <View style={[
            MyStyleSheet.apptStatusTag, 
            { 
              backgroundColor: item.status === 'Pending Confirmation' ? '#FFE8D1' : 
                               item.status === 'Cancelled' ? '#FFBDBD' : 
                               item.status === 'Approved' || item.status === 'Scheduled' ? '#D1E3FF' : '#D1FFD7' 
            }
          ]}>
            <Text style={MyStyleSheet.apptStatusText}>{item.status}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={MyStyleSheet.apptPetCircle}>
             {item.petImage ? (
                <Image source={{ uri: item.petImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
             ) : (
                <Image source={require('../public/bluepaw.png')} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="contain"/>
             )}
          </View>
          <Text style={MyStyleSheet.apptPetNameText}>{item.pet}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      
      {/* Header Area */}
      <View style={{ paddingHorizontal: 30, paddingTop: 40 }}>
        <Text style={MyStyleSheet.landingWelcomeText}>Appointments</Text>
      </View>

      {/* Filter Tabs */}
      <View style={MyStyleSheet.tabContainerRow}>
        {['Upcoming', 'Past', 'See All'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[MyStyleSheet.miniTabButton, activeTab === tab && MyStyleSheet.miniTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[MyStyleSheet.miniTabText, activeTab === tab && MyStyleSheet.miniTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList 
        data={filteredData} 
        renderItem={renderAppointmentCard} 
        keyExtractor={item => item.id}
        extraData={refreshTrigger} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 280 }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Image source={require('../public/appointmentcalendar.png')} style={{ width: 220, height: 220 }} resizeMode="contain" />
            <Text style={{ fontSize: 14, color: '#AAA', marginTop: 15 }}>No appointments found.</Text>
          </View>
        )}
      />

      {/* --- Floating Drawer Card (Manual Toggle) --- */}
      <View style={[
          MyStyleSheet.bottomDrawerCard, 
          isExpanded ? { height: 280 } : { height: 110 }
      ]}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => setIsExpanded(!isExpanded)}
          style={{ alignItems: 'center', width: '100%' }}
        >
          <View style={MyStyleSheet.dragHandleBar} />
          <Text style={MyStyleSheet.cardActionTitle}>Book appointment now</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginTop: 20 }]} 
            onPress={() => opx.navigate('selectpet')} 
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>Book appointment</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Minimalist Bottom Navigation */}
      <View style={MyStyleSheet.minimalBottomNav}>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('pet')}>
          <Image source={require('../public/Pets.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Pets</Text>
        </TouchableOpacity>
      
        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Calendar.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
          <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('userprofile')}>
          <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}