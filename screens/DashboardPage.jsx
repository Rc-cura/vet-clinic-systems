import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react' // 1. Added useEffect and useState
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../context/UserContext'
import { supabase } from '../context/supabase' // 2. Ensure your supabase client is imported
import { Ionicons } from '@expo/vector-icons'; 
import MyStyleSheet from '../styles/MyStyleSheet';

export default function DashboardPage() {
  const opx = useNavigation()
  const { user } = useUser()

  // 3. State to hold the pets from database
  const [userPets, setUserPets] = useState([])
  const [loading, setLoading] = useState(true)

  // 4. Fetch pets on component mount
  useEffect(() => {
    const fetchPets = async () => {
      if (!user?.id) return;

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', user.id) // Filter by the logged-in user

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

  return (
    <SafeAreaView style={[MyStyleSheet.container, { backgroundColor: '#F7F7F7' }]}>
      
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={MyStyleSheet.dashScrollContent}>
        
        {/* HEADER */}
        <View style={MyStyleSheet.dashTopHeader}>
          <Text style={MyStyleSheet.dashHeaderTitle}>Home</Text>
          <View style={MyStyleSheet.dashHeaderIcons}>
            <TouchableOpacity onPress={() => opx.navigate('notification')} style={MyStyleSheet.dashIconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => opx.navigate('settings')} style={MyStyleSheet.dashIconBtn}>
              <Ionicons name="settings-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TODAY'S APPOINTMENT CARD */}
        <View style={MyStyleSheet.dashApptCard}>
          <View style={MyStyleSheet.dashApptHeader}>
            <Text style={MyStyleSheet.dashApptHeaderText}>Today's Appointment</Text>
          </View>
          <View style={MyStyleSheet.dashApptBody}>
            <Text style={MyStyleSheet.dashApptBodyTitle}>No appointments today</Text>
            <Text style={MyStyleSheet.dashApptBodySub}>You're all set for today!</Text>
          </View>
        </View>

        {/* BANNER */}
        <View style={MyStyleSheet.dashBannerContainer}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop' }} 
            style={MyStyleSheet.dashBanner}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={MyStyleSheet.dashBannerOverlay}>
              <Text style={MyStyleSheet.dashBannerText}>Caring for your pets,{'\n'}made easy.</Text>
              <View style={MyStyleSheet.dashDotsRow}>
                <View style={[MyStyleSheet.dashDot, MyStyleSheet.dashDotActive]} />
                <View style={MyStyleSheet.dashDot} />
                <View style={MyStyleSheet.dashDot} />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* ACTIVE PET PROFILES */}
        <Text style={MyStyleSheet.dashSectionTitle}>Active Pet Profiles</Text>
        <View style={MyStyleSheet.dashPetProfilesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator color="#343A73" style={{ padding: 20 }} />
            ) : userPets.length > 0 ? (
              userPets.map((pet, index) => (
                <TouchableOpacity 
                  key={pet.id || index} 
                  style={MyStyleSheet.dashPetAvatarBtn} 
                  onPress={() => opx.navigate('viewpets', { pet })} // Corrected navigation to viewpets
                >
                  <Image 
                    source={pet.pimage ? { uri: pet.pimage } : require('../public/bluepaw.png')} 
                    style={MyStyleSheet.dashPetAvatar} 
                  />
                  <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 5, color: '#666' }}>
                    {pet.pet_name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={MyStyleSheet.dashEmptyPetCircle} onPress={() => opx.navigate('pet')}>
                <Text style={{fontSize: 20}}>🐾</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TouchableOpacity style={MyStyleSheet.dashArrowBtn} onPress={() => opx.navigate('pet')}>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* OVERVIEW SECTION */}
        <Text style={MyStyleSheet.dashSectionTitle}>Overview</Text>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCard}>
          <Text style={MyStyleSheet.dashOverviewCardTitle}>Upcoming{'\n'}Appointments</Text>
          <Text style={MyStyleSheet.dashOverviewCardSub}>You have 1 upcoming appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCard}>
          <Text style={MyStyleSheet.dashOverviewCardTitle}>Health Alerts &{'\n'}Reminders</Text>
          <Text style={MyStyleSheet.dashOverviewCardSub}>You have 3 health alert/reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCard}>
          <Text style={MyStyleSheet.dashOverviewCardTitle}>Recent Activity</Text>
          <Text style={MyStyleSheet.dashOverviewCardSub}>Your recent activities for this month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashOverviewCard} onPress={() => opx.navigate('billing')}>
          <Text style={MyStyleSheet.dashOverviewCardTitle}>Billing</Text>
          <Text style={MyStyleSheet.dashBillingAmount}>₱1,400.00</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={MyStyleSheet.dashBottomNav}>
        <TouchableOpacity style={MyStyleSheet.dashNavItem}>
          <Ionicons name="home" size={24} color="#343A73" />
          <Text style={[MyStyleSheet.dashNavLabel, { color: '#343A73' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={MyStyleSheet.dashNavItem} onPress={() => opx.navigate('pet')}>
          <Ionicons name="paw-outline" size={24} color="#A9A9A9" />
          <Text style={MyStyleSheet.dashNavLabel}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashNavItem} onPress={() => opx.navigate('appointment')}>
          <Ionicons name="calendar-outline" size={24} color="#A9A9A9" />
          <Text style={MyStyleSheet.dashNavLabel}>Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashNavItem} onPress={() => opx.navigate('appointment')}>
          <Ionicons name="reader-outline" size={24} color="#A9A9A9" />
          <Text style={MyStyleSheet.dashNavLabel}>Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.dashNavItem} onPress={() => opx.navigate('userprofile')}>
          <Ionicons name="person-outline" size={24} color="#A9A9A9" />
          <Text style={MyStyleSheet.dashNavLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  )
}