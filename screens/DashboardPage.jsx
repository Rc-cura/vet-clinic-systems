import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, ImageBackground, ActivityIndicator, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../context/UserContext'
import { supabase } from '../context/supabase' 
import { Ionicons } from '@expo/vector-icons'; 
import MyStyleSheet from '../styles/MyStyleSheet';

// Get screen width for carousel calculation
const { width: screenWidth } = Dimensions.get('window');
const bannerWidth = screenWidth - 40; // Subtracting horizontal margins (20px each side)

export default function DashboardPage() {
  const opx = useNavigation()
  const { user } = useUser()

  // --- Logic State ---
  const [userPets, setUserPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0);

  // --- Carousel Data ---
  const bannerData = [
    { id: '1', image: require('../public/banner_image.png'), text: "Caring for your pets,\nmade easy." },
    { id: '2', image: require('../public/banner_image.png'), text: "Expert care for\nyour best friend." },
    { id: '3', image: require('../public/banner_image.png'), text: "Health tracking\nat your fingertips." },
  ];

  // --- Supabase Fetching Logic ---
  useEffect(() => {
    const fetchPets = async () => {
      if (!user?.id) return;
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', user.id) 

        if (error) throw error
        setUserPets(data || [])
      } catch (error) {
        console.error("Error fetching pets:", error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [user])

  // --- Carousel Scroll Handler ---
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / bannerWidth);
    setActiveIndex(index);
  };

  const renderBannerItem = ({ item }) => (
    <View style={{ width: bannerWidth, height: 180 }}>
      <ImageBackground 
        source={item.image} 
        style={MyStyleSheet.dashBannerImage}
        imageStyle={{ borderRadius: 40 }}
      >
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
          {/* 🟢 IN-UPDATE: Gumagana na rin ang chat icon sa header */}
          <TouchableOpacity style={MyStyleSheet.dashIconBtn} onPress={() => opx.navigate('chat')}>
             <Image source={require('../public/Chat.png')} style={{width: 22, height: 22}} />
          </TouchableOpacity>
          <TouchableOpacity style={MyStyleSheet.dashIconBtn}>
             <Image source={require('../public/Notification.png')} style={{width: 22, height: 22}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => opx.navigate('settings')} style={MyStyleSheet.dashIconBtn}>
             <Image source={require('../public/Settings.png')} style={{width: 22, height: 22}} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        
        {/* TODAY'S APPOINTMENT CARD */}
        <View style={MyStyleSheet.dashApptCardMain}>
          <View style={MyStyleSheet.dashApptHeaderBlue}>
            <Text style={MyStyleSheet.dashApptHeaderTextWhite}>Today’s Appointment</Text>
          </View>
          <View style={MyStyleSheet.dashApptBodyCenter}>
            <Text style={MyStyleSheet.dashApptBodyTitleBlue}>No appointments today</Text>
            <Text style={MyStyleSheet.dashApptBodySubGray}>You’re all set for today!</Text>
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
          {/* Indicator Dots */}
          <View style={MyStyleSheet.dashBannerDotsFloating}>
            {bannerData.map((_, i) => (
              <View 
                key={i} 
                style={[
                  MyStyleSheet.dashBannerDot, 
                  activeIndex === i ? MyStyleSheet.dashBannerDotActive : null
                ]} 
              />
            ))}
          </View>
        </View>

        {/* ACTIVE PET PROFILES */}
        <Text style={MyStyleSheet.dashSectionLabel}>Active Pet Profiles</Text>
        <View style={MyStyleSheet.dashPetRowContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator color="#2E3A91" />
            ) : (
              userPets.map((pet, index) => (
                <TouchableOpacity 
                  key={pet.id || index} 
                  onPress={() => opx.navigate('viewpets', { pet })}
                >
                  <Image 
                    source={pet.image_url ? { uri: pet.image_url } : require('../public/bluepaw.png')} 
                    style={MyStyleSheet.dashPetCircleAvatar} 
                  />
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

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Upcoming Appointments</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>You have 1 upcoming appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Health Alerts & Reminders</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>You have 3 health alert/reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Recent Activity</Text>
          <Text style={MyStyleSheet.dashOverviewSubText}>Your recent activities for this month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCleanCard} onPress={() => opx.navigate('billing')}>
          <Text style={MyStyleSheet.dashOverviewTitleText}>Billing</Text>
          <Text style={MyStyleSheet.dashOverviewBillingText}>₱1,400.00</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 🟢 BAGONG FLOATING CHAT BUTTON */}
      <TouchableOpacity 
        style={styles.floatingChatBtn} 
        onPress={() => opx.navigate('chat')}
        activeOpacity={0.8}
      >
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

// 🟢 NAGDAGDAG NG STYLES PARA SA FLOATING BUTTON
const styles = StyleSheet.create({
  floatingChatBtn: {
    position: 'absolute',
    bottom: 100, // Sakto lang sa ibabaw ng bottom navigation mo
    right: 20,
    zIndex: 99,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E3A91', // Parehong blue na gamit mo sa app
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
});