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

  useEffect(() => {
    if (isFocused) {
      setRefreshTrigger(prev => prev + 1)
    }
  }, [isFocused])

  // --- NEW: Date Formatting Helper ---
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);

    // Returns format: "Thursday, 05 February"
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

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity 
      style={MyStyleSheet.apptCard} 
      activeOpacity={0.7} 
      onPress={() => handleCardPress(item)}
    >
      <View style={MyStyleSheet.apptCardContent}>
        <View style={{ flex: 1 }}>
          <Text style={MyStyleSheet.apptDateText}>
            {/* --- UPDATED: Applying the format here --- */}
            {formatDisplayDate(item.date)}   <Text style={{fontWeight: '400'}}>{item.time}</Text>
          </Text>
          
          <View style={MyStyleSheet.apptServiceRow}>
            <Image source={require('../public/medical_icon.svg')} style={{ width: 18, height: 18 }} />
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
                <Image source={require('../public/bluepaw.svg')} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="contain"/>
             )}
          </View>
          <Text style={MyStyleSheet.apptPetNameText}>{item.pet}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={MyStyleSheet.apptHeaderContainer}>
        <View style={MyStyleSheet.apptHeader}>
          <View>
            <Text style={MyStyleSheet.apptHiUser}>Hi, {user?.fname || 'User'}!</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => opx.navigate('userprofile')}>
                <View style={MyStyleSheet.apptUserCircle} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { opx.navigate('notification') }}>
                <Image source={require('../public/Doorbell.svg')} style={{ width: 22, height: 22, marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={MyStyleSheet.tabContainer}>
        {['Upcoming', 'Past', 'See All'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[MyStyleSheet.tabButton, activeTab === tab && MyStyleSheet.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[MyStyleSheet.tabText, activeTab === tab && MyStyleSheet.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderAppointmentCard}
        keyExtractor={item => item.id}
        extraData={refreshTrigger} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Image 
              source={require('../public/appointmentcalendar.svg')} 
              style={{ width: 250, height: 250 }} 
              resizeMode="contain" 
            />
            <Text style={{ 
              fontSize: 16, 
              color: '#333', 
              marginTop: 20, 
              textAlign: 'center' 
            }}>
              You currently have no {activeTab === 'See All' ? '' : activeTab.toLowerCase()} appointments.
            </Text>
            <TouchableOpacity 
              style={{ marginTop: 50 }} 
              onPress={() => opx.navigate('selectpet')}
            >
              <Text style={{ 
                color: '#5C93E8', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                Book Appointment
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={MyStyleSheet.apptFab} onPress={()=>{opx.navigate('selectpet')}}>
        <Text style={{ fontSize: 30, color: '#5C93E8' }}>+</Text>
      </TouchableOpacity>

      <View style={MyStyleSheet.bottomNav}>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('pet')}>
          <Image source={require('../public/Pets.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Pets</Text>
        </TouchableOpacity>
        
        <View style={MyStyleSheet.navItemContainer}>
           <TouchableOpacity style={MyStyleSheet.navItemActive}>
              <Image source={require('../public/Calendar.svg')} style={{ width: 22, height: 22 }} />
           </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('billing')}>
          <Image source={require('../public/Bill.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}