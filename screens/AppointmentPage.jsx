import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' // 1. Import the context hook

export default function AppointmentPage() {
  const opx = useNavigation()
  const { user } = useUser() // 2. Access the global user state
  const [activeTab, setActiveTab] = useState('Upcoming')

  const appointmentData = [
    { id: '1', date: 'Thursday, 05 February', time: '9:00 AM', service: 'Service Name', pet: 'Pet Name', status: 'Pending Confirmation', type: 'Upcoming' },
    { id: '2', date: 'Saturday, 07 February', time: '9:00 AM', service: 'Service Name', pet: 'Pet Name', status: 'Approved', type: 'Upcoming' },
    { id: '3', date: 'Thursday, 09 January', time: '9:00 AM', service: 'Service Name', pet: 'Pet Name', status: 'Completed', type: 'Past' },
  ]

  const filteredData = activeTab === 'See All' 
    ? appointmentData 
    : appointmentData.filter(item => item.type === activeTab)

  const handleCardPress = (status) => {
    if (status === 'Pending Confirmation') {
      opx.navigate('pending');
    } else if (status === 'Approved') {
      opx.navigate('approved');
    } else if (status === 'Completed') {
      opx.navigate('completed');
    }
  }

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity 
      style={MyStyleSheet.apptCard} 
      activeOpacity={0.7} 
      onPress={() => handleCardPress(item.status)}
    >
      <View style={MyStyleSheet.apptCardContent}>
        <View style={{ flex: 1 }}>
          <Text style={MyStyleSheet.apptDateText}>{item.date}   <Text style={{fontWeight: '400'}}>{item.time}</Text></Text>
          <View style={MyStyleSheet.apptServiceRow}>
            <Image source={require('../public/medical_icon.svg')} style={{ width: 18, height: 18 }} />
            <Text style={MyStyleSheet.apptServiceName}>{item.service}</Text>
          </View>
          
          <View style={[
            MyStyleSheet.apptStatusTag, 
            { backgroundColor: item.status === 'Pending Confirmation' ? '#FFE8D1' : item.status === 'Approved' ? '#D1E3FF' : '#D1FFD7' }
          ]}>
            <Text style={MyStyleSheet.apptStatusText}>{item.status}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={MyStyleSheet.apptPetCircle}>
             <Image source={require('../public/bluepaw.svg')} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="contain"/>
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
            {/* 3. Dynamic greeting using the user's first name */}
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />

      <TouchableOpacity style={MyStyleSheet.apptFab} onPress={()=>{opx.navigate('selectpet')}}>
        <Text style={{ fontSize: 30, color: '#5C93E8' }}>+</Text>
      </TouchableOpacity>

      {/* Bottom Nav */}
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