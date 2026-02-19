import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext'
import { Pets } from '../App' // Import your global pet array

export default function DashboardPage() {
  const opx = useNavigation()
  const { user } = useUser()

  // Grab the first pet in the array to display on the main card
  const displayPet = Pets.length > 0 ? Pets[0] : null;

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Top Header */}
      <View style={MyStyleSheet.dashHeader}>
        <Text style={MyStyleSheet.welcomeText}>Hi, {user?.fname || 'User'}!</Text>
        
        <View style={MyStyleSheet.headerIcons}>
          <TouchableOpacity onPress={() => opx.navigate('userprofile')}>
            <View style={MyStyleSheet.profileCircle}>
               {/* Show User Initial */}
               <Text style={{color: '#5C93E8', fontWeight: 'bold'}}>{user?.fname?.charAt(0)}</Text>
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
          <View style={MyStyleSheet.badge}>
            <Text style={MyStyleSheet.badgeText}>{Pets.length}</Text>
          </View>
        </View>

        {/* Pet Card */}
        <View style={MyStyleSheet.petCardContainer}>
           <TouchableOpacity 
             style={MyStyleSheet.petCard} 
             onPress={() => opx.navigate('pet')}
           >
              <View style={{ flex: 1 }}>
                <Text style={MyStyleSheet.petName}>
                  {displayPet ? displayPet.pname : "No Pets Added"}
                </Text>
                <Text style={MyStyleSheet.petDetails}>
                  {displayPet 
                    ? `${displayPet.species} | ${displayPet.breed} | ${displayPet.age} yrs | ${displayPet.gender}`
                    : "Tap the Pets tab to add one!"}
                </Text>
              </View>
              
              <View style={MyStyleSheet.petPhotoCircle}>
                {displayPet?.pimage ? (
                  <Image 
                    source={{ uri: displayPet.pimage }} 
                    style={{ width: '100%', height: '100%', borderRadius: 40 }} 
                  />
                ) : (
                  <Image 
                    source={require('../public/bluepaw.svg')} 
                    style={{ width: 30, height: 30 }} 
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Pagination Dots based on number of pets */}
            <View style={MyStyleSheet.dashDotsRow}>
                {Pets.length > 0 ? Pets.slice(0, 3).map((_, index) => (
                  <View 
                    key={index} 
                    style={index === 0 ? MyStyleSheet.dashDotActive : MyStyleSheet.dashDot} 
                  />
                )) : <View style={MyStyleSheet.dashDotActive} />}
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
            <Text style={MyStyleSheet.alertText}>
              {displayPet ? `Check-up reminder for ${displayPet.pname}` : "No upcoming alerts"}
            </Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={MyStyleSheet.infoCard}>
          <Text style={MyStyleSheet.cardHeading}>Recent Activity</Text>
          <View style={MyStyleSheet.activityItem}>
            <Image source={require('../public/medical_icon.svg')} style={{ width: 18, height: 18, marginRight: 8 }} />
            <Text style={MyStyleSheet.activityText}>January 12 - Vet Consultation</Text>
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