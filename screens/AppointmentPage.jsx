import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 
import { supabase } from '../context/supabase' 

export default function AppointmentPage() {
  const opx = useNavigation()
  const isFocused = useIsFocused() 
  const { user } = useUser() 
  
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 🟢 BAGONG STATES PARA SA SUPABASE DATA
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // ================= 1. FETCH REAL APPOINTMENTS FROM SUPABASE =================
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*, pets(pet_name, image_url)')
          .eq('client_id', user.id)
          .order('appointment_date', { ascending: true }); // Sort by date

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchAppointments();
      setIsExpanded(false); // Close drawer when returning to tab
    }
  }, [isFocused, user]);

  // ================= 2. FILTERING LOGIC (PAREHO SA WEB MO) =================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (dateStr) => {
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };
  const isFuture = (dateStr) => {
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  };
  const isPast = (dateStr) => {
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  };

  const getFilteredData = () => {
    let filtered = appointments;

    // Search function
    if (searchQuery) {
      filtered = filtered.filter(apt => 
        (apt.pets?.pet_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (apt.service_type || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tabs filter matching web logic
    return filtered.filter(apt => {
      const status = (apt.status || 'Pending').toLowerCase();
      
      if (activeTab === 'Pending') {
        return ['pending', 'reschedule requested'].includes(status);
      }
      if (activeTab === 'Today') {
        return ['scheduled', 'confirmed', 'in_progress', 'approved'].includes(status) && isToday(apt.appointment_date);
      }
      if (activeTab === 'Upcoming') {
        return ['scheduled', 'confirmed', 'approved'].includes(status) && isFuture(apt.appointment_date);
      }
      if (activeTab === 'Past') {
        return ['completed', 'cancelled'].includes(status) || isPast(apt.appointment_date);
      }
      return false;
    });
  };

  const filteredData = getFilteredData();

  // ================= 3. NAVIGATION CLICKS =================
  const handleCardPress = (item) => {
    const status = (item.status || 'Pending').toLowerCase();
    
    // Ibinagay ko ito sa logic mo kanina
    if (status === 'pending' || status === 'pending confirmation') {
      opx.navigate('pending', { appointment: item });
    } else if (status === 'approved' || status === 'scheduled' || status === 'confirmed') {
      opx.navigate('approved', { appointment: item });
    } else if (status === 'completed') {
      opx.navigate('completed', { appointment: item });
    } else if (status === 'cancelled') {
      opx.navigate('cancelled', { appointment: item });
    } else {
      opx.navigate('viewdetails', { appointment: item }); // Fallback
    }
  };

  // ================= 4. RENDER CARD =================
  const renderAppointmentCard = ({ item }) => {
    const status = (item.status || 'Pending').toLowerCase();
    const isPendingStatus = ['pending', 'reschedule requested', 'pending confirmation'].includes(status);
    const isPastStatus = ['completed', 'cancelled'].includes(status) || isPast(item.appointment_date);
    
    // Use proper styles based on status
    const cardStyle = isPendingStatus ? MyStyleSheet.orangeApptCard : MyStyleSheet.blueApptCard;

    // Format display time
    const displayTime = (() => {
      if (!item.appointment_time) return '';
      const [h, m] = item.appointment_time.split(':');
      const hours = Number(h);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      return `${hour12}:${m} ${period}`;
    })();

    // Format display date
    const displayDate = new Date(item.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <View style={cardStyle}>
        <Text style={MyStyleSheet.apptPetNameLarge}>{item.pets?.pet_name || 'Unknown Pet'}</Text>
        <Text style={MyStyleSheet.apptServiceTextSub} style={{textTransform: 'capitalize'}}>{item.service_type}</Text>
        
        <View style={MyStyleSheet.apptDividerHalf} />
        
        <Text style={MyStyleSheet.apptInfoText}>
          {isPendingStatus 
            ? `Requested Date: ${displayDate}` 
            : isPastStatus 
              ? `${item.status} on ${displayDate}` 
              : `${displayDate} • ${displayTime}`
          }
        </Text>

        {!isPastStatus ? (
          <>
            <TouchableOpacity 
              style={[MyStyleSheet.primaryActionBtn, { height: 42, borderRadius: 12 }]}
              onPress={() => handleCardPress(item)}
            >
              <Text style={MyStyleSheet.primaryActionBtnText}>View Details / Reschedule</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              {isPendingStatus ? (
                <TouchableOpacity 
                  style={[MyStyleSheet.secondaryOutlineBtn, { flex: 1, height: 40, borderRadius: 12 }]}
                  onPress={() => handleCardPress(item)}
                >
                  <Text style={MyStyleSheet.secondaryOutlineText}>Cancel Request</Text>
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
          <TextInput 
            placeholder="Search pet or service..." 
            placeholderTextColor="#AAA" 
            style={{ flex: 1 }} 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 80 }} />
        ) : (
          <FlatList 
            data={filteredData} 
            renderItem={renderAppointmentCard} 
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
                <Image 
                  source={require('../public/appointmentcalendar.png')} 
                  style={{ width: 250, height: 250 }} 
                  resizeMode="contain" 
                />
                <Text style={{ fontSize: 14, color: '#AAA', marginTop: 10, textAlign: 'center' }}>
                  {searchQuery 
                    ? "No appointments match your search." 
                    : "You currently have no appointments here."}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Floating Drawer Logic (Naka-connect na sa selectservice na ginawa natin) */}
      <View style={[MyStyleSheet.bottomDrawerCard, isExpanded ? { height: 260 } : { height: 100 }]}>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={{ alignItems: 'center', width: '100%' }}>
          <View style={MyStyleSheet.dragHandleBar} />
          <Text style={MyStyleSheet.cardActionTitle}>Book appointment now</Text>
        </TouchableOpacity>
        {isExpanded && (
          <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginTop: 15 }]} 
            onPress={() => opx.navigate('selectservice')} // 🔴 PUPUNTA NA SA BAGONG BOOKING FLOW
          >
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