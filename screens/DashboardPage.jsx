import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native' // Removed useRoute
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' // Import the context hook

export default function DashboardPage() {
  const opx = useNavigation()
  
  // 1. Grab the user data globally from Context
  const { user } = useUser()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Top Header */}
      <View style={MyStyleSheet.dashHeader}>
        {/* 2. Dynamically display the user's first name */}
        <Text style={MyStyleSheet.welcomeText}>Hi, {user?.fname || 'User'}!</Text>
        
        <View style={MyStyleSheet.headerIcons}>
          
          {/* 3. No need to pass user params here anymore! */}
          <TouchableOpacity onPress={() => opx.navigate('userprofile')}>
            <View style={MyStyleSheet.profileCircle}>
               {/* Optional: Add an image or initials here if you have them */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.notifBtn} onPress={() => { opx.navigate('notification') }}>
            <Image source={require('../public/Doorbell.svg')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
        {/* Active Pet Profiles Section */}
        <View style={MyStyleSheet.sectionRow}>
          <Text style={MyStyleSheet.sectionTitle}>Active Pet Profiles</Text>
          <View style={MyStyleSheet.badge}><Text style={MyStyleSheet.badgeText}>3</Text></View>
        </View>

        {/* Pet Card */}
        <View style={MyStyleSheet.petCardContainer}>
           <View style={MyStyleSheet.petCard}>
              <View>
                <Text style={MyStyleSheet.petName}>Pet Name</Text>
                <Text style={MyStyleSheet.petDetails}>Type | Breed | Age | Sex</Text>
              </View>
              <View style={MyStyleSheet.petPhotoCircle} />
            </View>
            <View style={MyStyleSheet.dashDotsRow}>
                <View style={MyStyleSheet.dashDotActive} />
                <View style={MyStyleSheet.dashDot} />
                <View style={MyStyleSheet.dashDot} />
            </View>
        </View>

        {/* Book Appointment CTA */}
        <TouchableOpacity style={MyStyleSheet.bookBtn} onPress={()=>{opx.navigate('appointment')}}>
          <View style={MyStyleSheet.bookIconContainer}>
              <Image source={require('../public/bookapp.svg')} style={{ width: 20, height: 20 }} />
          </View>
          <View style={{marginLeft: 12}}>
            <Text style={MyStyleSheet.bookBtnTitle}>Book Appointment</Text>
            <Text style={MyStyleSheet.bookBtnSub}>Consultation • Vaccine • Grooming</Text>
          </View>
        </TouchableOpacity>

        {/* Health Alerts Section */}
        <View style={MyStyleSheet.infoCard}>
          <Text style={MyStyleSheet.cardHeading}>Health Alerts & Reminders</Text>
          <View style={MyStyleSheet.alertItem}>
            <Image source={require('../public/point.png')} style={{ width: 16, height: 16, marginRight: 8 }} />
            <Text style={MyStyleSheet.alertText}>Rabies Vaccine due in 5 days</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={MyStyleSheet.infoCard}>
          <Text style={MyStyleSheet.cardHeading}>Recent Activity</Text>
          <View style={MyStyleSheet.activityItem}>
            <Image source={require('../public/medical_icon.svg')} style={{ width: 18, height: 18, marginRight: 8 }} />
            <Text style={MyStyleSheet.activityText}>January 12 - Vet Consultation</Text>
          </View>
          <View style={MyStyleSheet.activityItem}>
            <Image source={require('../public/grooming_icon.svg')} style={{ width: 18, height: 18, marginRight: 8 }} />
            <Text style={MyStyleSheet.activityText}>January 23 - Grooming</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={MyStyleSheet.fab}>
          <Image source={require('../public/message.svg')} style={{ width: 24, height: 24, tintColor: '#fff' }} />
      </TouchableOpacity>

      {/* Custom Bottom Nav */}
      <View style={MyStyleSheet.bottomNav}>
        <View style={MyStyleSheet.navItemContainer}>
           <TouchableOpacity style={MyStyleSheet.navItemActive}>
             <Image source={require('../public/HomePage.svg')} style={{ width: 22, height: 22 }} />
           </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={()=>{opx.navigate('pet')}}>
           <Image source={require('../public/Pets.svg')} style={{ width: 22, height: 22 }} />
           <Text style={MyStyleSheet.navLabel}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navItem} onPress={()=>{opx.navigate('appointment')}}>
           <Image source={require('../public/Calendar.svg')} style={{ width: 22, height: 22 }} />
           <Text style={MyStyleSheet.navLabel}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navItem} onPress={()=>{opx.navigate('billing')}}>
           <Image source={require('../public/Bill.svg')} style={{ width: 22, height: 22 }} />
           <Text style={MyStyleSheet.navLabel}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}