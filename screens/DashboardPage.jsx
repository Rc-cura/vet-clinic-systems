import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, ImageBackground, ActivityIndicator, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useUser } from '../context/UserContext'
import { supabase } from '../context/supabase' 
import { Ionicons } from '@expo/vector-icons'; 
import MyStyleSheet from '../styles/MyStyleSheet';

const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = screenWidth - 40; 

export default function DashboardPage() {
  const opx = useNavigation()
  const isFocused = useIsFocused()
  const { user } = useUser()

  const [userPets, setUserPets] = useState([])
  const [loadingPets, setLoadingPets] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 🟢 DYNAMIC DASHBOARD STATES
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);
  const [todaysAppointment, setTodaysAppointment] = useState(null);
  const [pendingBalance, setPendingBalance] = useState(0);

  const bannerData = [
    { id: '1', image: require('../public/banner_image.png'), text: "Caring for your pets,\nmade easy." },
    { id: '2', image: require('../public/banner_image.png'), text: "Expert care for\nyour best friend." },
    { id: '3', image: require('../public/banner_image.png'), text: "Health tracking\nat your fingertips." },
  ];

  // ================= FETCH DASHBOARD DATA =================
  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;
      
      try {
        // --- Fetch Pets ---
        setLoadingPets(true);
        const { data: petsData } = await supabase.from('pets').select('*').eq('owner_id', user.id);
        setUserPets(petsData || []);

        // --- Fetch Unread Notifications ---
        const { count: msgCount } = await supabase.from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id).eq('is_read', false);
          
        const { count: notifCount } = await supabase.from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id).eq('is_read', false);

        setHasUnreadNotifs((msgCount > 0) || (notifCount > 0));

        // --- Fetch Today's Appointment ---
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: aptData } = await supabase.from('appointments')
          .select('*, pets(pet_name)')
          .eq('client_id', user.id)
          .eq('appointment_date', todayStr)
          .in('status', ['Confirmed', 'Scheduled', 'Approved', 'Pending'])
          .order('appointment_time', { ascending: true })
          .limit(1)
          .single();
        
        setTodaysAppointment(aptData || null);

        // --- Fetch Pending Billing Balance ---
        const { data: billings } = await supabase.from('appointments')
          .select('total_amount, amount')
          .eq('client_id', user.id)
          .eq('status', 'Pending'); // Assuming pending payment uses this status

        if (billings) {
          const total = billings.reduce((sum, b) => sum + Number(b.amount || b.total_amount || 1000), 0);
          setPendingBalance(total);
        }

      } catch (error) {
        console.error("Dashboard Fetch Error:", error.message);
      } finally {
        setLoadingPets(false);
      }
    }

    if (isFocused) {
      loadDashboardData();
    }
  }, [user, isFocused]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / bannerWidth);
    setActiveIndex(index);
  };

  const renderBannerItem = ({ item }) => (
    <View style={{ width: bannerWidth, height: 180 }}>
      <ImageBackground source={item.image} style={MyStyleSheet.dashBannerImage} imageStyle={{ borderRadius: 40 }}>
        <View style={{ padding: 25, flex: 1, justifyContent: 'center' }}>
          <Text style={MyStyleSheet.dashBannerTextBold}>{item.text}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      
      {/* FIXED HEADER */}
      <View style={MyStyleSheet.dashTopHeader}>
        <Text style={MyStyleSheet.dashHeaderTitle}>Home</Text>
        <View style={MyStyleSheet.dashHeaderIcons}>
          
          <TouchableOpacity style={MyStyleSheet.dashIconBtn} onPress={() => opx.navigate('chat')}>
             <Image source={require('../public/Chat.png')} style={{width: 22, height: 22}} />
          </TouchableOpacity>
          
          {/* 🟢 BELL ICON NA MAY RED BADGE KUNG MAY UNREAD */}
          <TouchableOpacity style={MyStyleSheet.dashIconBtn} onPress={() => opx.navigate('notifications')}>
             <Image source={require('../public/Notification.png')} style={{width: 22, height: 22}} />
             {hasUnreadNotifs && <View style={styles.redBadge} />}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => opx.navigate('settings')} style={MyStyleSheet.dashIconBtn}>
             <Image source={require('../public/Settings.png')} style={{width: 22, height: 22}} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        
        {/* 🟢 DYNAMIC TODAY'S APPOINTMENT CARD */}
        <View style={MyStyleSheet.dashApptCardMain}>
          <View style={MyStyleSheet.dashApptHeaderBlue}>
            <Text style={MyStyleSheet.dashApptHeaderTextWhite}>Today’s Appointment</Text>
          </View>
          <View style={MyStyleSheet.dashApptBodyCenter}>
            {todaysAppointment ? (
              <TouchableOpacity onPress={() => opx.navigate('viewdetails', { appointment: todaysAppointment })}>
                <Text style={MyStyleSheet.dashApptBodyTitleBlue}>{todaysAppointment.pets?.pet_name} - {todaysAppointment.service_type}</Text>
                <Text style={MyStyleSheet.dashApptBodySubGray}>Scheduled at {todaysAppointment.appointment_time.slice(0,5)}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={MyStyleSheet.dashApptBodyTitleBlue}>No appointments today</Text>
                <Text style={MyStyleSheet.dashApptBodySubGray}>You’re all set for today!</Text>
              </>
            )}
          </View>
        </View>

        {/* --- CAROUSEL BANNER SECTION --- */}
        <View style={MyStyleSheet.dashBannerWrapper}>
          <FlatList
            data={bannerData}
            renderItem={renderBannerItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            snapToInterval={bannerWidth}
            decelerationRate="fast"
            keyExtractor={(item) => item.id}
          />
          <View style={MyStyleSheet.dashBannerDotsFloating}>
            {bannerData.map((_, i) => (
              <View key={i} style={[MyStyleSheet.dashBannerDot, activeIndex === i ? MyStyleSheet.dashBannerDotActive : null]} />
            ))}
          </View>
        </View>

        {/* ACTIVE PET PROFILES */}
        <Text style={MyStyleSheet.dashSectionLabel}>Active Pet Profiles</Text>
        <View style={MyStyleSheet.dashPetRowContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {loadingPets ? (
              <ActivityIndicator color="#2E3A91" />
            ) : (
              userPets.map((pet, index) => (
                <TouchableOpacity key={pet.id || index} onPress={() => opx.navigate('viewpets', { pet })}>
                  <Image source={pet.image_url ? { uri: pet.image_url } : require('../public/bluepaw.png')} style={MyStyleSheet.dashPetCircleAvatar} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <TouchableOpacity style={MyStyleSheet.dashCircleArrowBtn} onPress={() => opx.navigate('pet')}>
             <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
          </TouchableOpacity>
        </View>

        {/* OVERVIEW SECTION */}
        <Text style={MyStyleSheet.dashSectionLabel}>Overview</Text>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard} onPress={() => opx.navigate('appointment')}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Upcoming Appointments</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>View your upcoming schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard} onPress={() => opx.navigate('notifications')}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Health Alerts & Reminders</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>Check your notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Recent Activity</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>Your recent activities for this month</Text>
        </TouchableOpacity>

        {/* 🟢 DYNAMIC BILLING CARD */}
        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard} onPress={() => opx.navigate('billing')}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Billing</Text>
          <Text style={MyStyleSheet.dashOverviewBillingText}>₱{pendingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* FLOATING CHAT BUTTON */}
      <TouchableOpacity style={styles.floatingChatBtn} onPress={() => opx.navigate('chat')} activeOpacity={0.8}>
        <Ionicons name="mail" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* FIXED BOTTOM NAVIGATION */}
      <View style={MyStyleSheet.minimalBottomNav}>
        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/HomePage.png')} style={[MyStyleSheet.navTabIcon, {tintColor: '#2E3A91'}]} />
          <Text style={[MyStyleSheet.navTabText, {color: '#2E3A91'}]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('pet')}>
          <Image source={require('../public/Pets.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Apppointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('userprofile')}>
          <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  floatingChatBtn: {
    position: 'absolute',
    bottom: 100, 
    right: 20,
    zIndex: 99,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E3A91', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  redBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444', 
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFF',
  }
});