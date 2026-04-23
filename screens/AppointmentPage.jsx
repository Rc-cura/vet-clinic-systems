import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, TextInput } from 'react-native'
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
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setRefreshTrigger(prev => prev + 1)
    }
  }, [isFocused])

  
  const getFilteredData = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    let baseData = [...Appointments];

    if (activeTab === 'Today') {
      return baseData.filter(item => item.date === todayStr).reverse();
    } else if (activeTab === 'Pending') {
      return baseData.filter(item => item.status === 'Pending Confirmation').reverse();
    } else {
      return baseData.filter(item => item.type === activeTab).reverse();
    }
  }

  const filteredData = getFilteredData();

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

  const renderAppointmentCard = ({ item }) => {
    const isPending = activeTab === 'Pending' || item.status === 'Pending Confirmation';
    const isPast = activeTab === 'Past' || item.status === 'Completed';

    return (
      <View style={isPending ? MyStyleSheet.orangeApptCard : MyStyleSheet.blueApptCard}>
        <Text style={MyStyleSheet.apptPetNameLarge}>{item.pet}</Text>
        <Text style={MyStyleSheet.apptServiceTextSub}>{item.service}</Text>
        
        <View style={MyStyleSheet.apptDividerHalf} />
        
        {/* Date/Time info changes based on tab */}
        <Text style={MyStyleSheet.apptInfoText}>
          {isPending 
            ? `Requested Date: ${item.date}` 
            : isPast 
              ? `Completed on ${item.date}` 
              : `${item.date} • ${item.time} (Due soon)`}
        </Text>

        {/* Buttons logic matches your screenshots */}
        {!isPast ? (
          <>
            <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { height: 42, borderRadius: 12 }]}>
              <Text style={MyStyleSheet.primaryActionBtnText}>Reschedule</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              {isPending ? (
                <TouchableOpacity 
                  style={[MyStyleSheet.secondaryOutlineBtn, { flex: 1, height: 40, borderRadius: 12 }]}
                  onPress={() => handleCardPress(item)}
                >
                  <Text style={MyStyleSheet.secondaryOutlineText}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[MyStyleSheet.secondaryOutlineBtn, { flex: 0.48, height: 40, borderRadius: 12 }]}
                    onPress={() => handleCardPress(item)}
                  >
                    <Text style={MyStyleSheet.secondaryOutlineText}>View details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[MyStyleSheet.secondaryOutlineBtn, { flex: 0.48, height: 40, borderRadius: 12 }]}>
                    <Text style={MyStyleSheet.secondaryOutlineText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <TouchableOpacity 
            style={[MyStyleSheet.secondaryOutlineBtn, { height: 42, borderRadius: 20 }]}
            onPress={() => handleCardPress(item)}
          >
            <Text style={MyStyleSheet.secondaryOutlineText}>View details</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      
      <View style={{ paddingHorizontal: 30, paddingTop: 30 }}>
        <Text style={MyStyleSheet.landingWelcomeText}>Appointments</Text>
      </View>

      {/* Pill Styled Filter Tabs */}
      <View style={MyStyleSheet.tabContainerRow}>
        {['Upcoming', 'Today', 'Past', 'Pending'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[MyStyleSheet.miniTabButton, activeTab === tab && MyStyleSheet.miniTabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[MyStyleSheet.miniTabText, activeTab === tab && MyStyleSheet.miniTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: 25, marginTop: 20 }}>
          <Text style={[MyStyleSheet.landingWelcomeText, { fontSize: 22, color: '#2E3A91' }]}>
            {activeTab === 'Today' ? "Today's Appointments" : `${activeTab} Appointments`}
          </Text>
      </View>

      {/* Main Container Card */}
      <View style={MyStyleSheet.appointmentMainContainer}>
        <View style={MyStyleSheet.searchContainer}>
          <Image source={require('../public/search_icon.png')} style={{ width: 16, height: 16, marginRight: 10, tintColor: '#AAA' }} />
          <TextInput placeholder="Search" placeholderTextColor="#AAA" style={{ flex: 1 }} />
        </View>

        
          <FlatList 
            data={filteredData} 
            renderItem={renderAppointmentCard} 
            keyExtractor={(item, index) => index.toString()}
            extraData={refreshTrigger} 
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
                {/* RESTORED: Your original empty state illustration */}
                <Image 
                  source={require('../public/appointmentcalendar.png')} 
                  style={{ width: 250, height: 250 }} 
                  resizeMode="contain" 
                />
                <Text style={{ fontSize: 14, color: '#AAA', marginTop: 10 }}>
                  You currently have no appointments.
                </Text>
              </View>
            )}
          />
      </View>

      {/* Floating Drawer Logic stays the same */}
      <View style={[MyStyleSheet.bottomDrawerCard, isExpanded ? { height: 260 } : { height: 100 }]}>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ alignItems: 'center' }}>
          <View style={MyStyleSheet.dragHandleBar} />
          <Text style={MyStyleSheet.cardActionTitle}>Book appointment now</Text>
        </TouchableOpacity>
        {isExpanded && (
          <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { marginTop: 5 }]} onPress={() => opx.navigate('service')}>
            <Text style={MyStyleSheet.primaryActionBtnText}>Book appointment</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Nav */}
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