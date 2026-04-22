import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 

export default function UserProfilePage() {
  const opx = useNavigation()
  const { user, updateUser } = useUser() 

  const [logoutVisible, setLogoutVisible] = useState(false)

  // --- Helper Component for Menu Items ---
  const ProfileMenuItem = ({ title, sub, icon, onPress, isDanger }) => (
    <TouchableOpacity 
      style={[
        MyStyleSheet.profileMenuOption, 
        isDanger && { justifyContent: 'center', marginTop: 20 } 
      ]} 
      onPress={onPress}
    >
      <View style={[
        MyStyleSheet.profileMenuIconWrapper, 
        isDanger && { backgroundColor: '#FFF5F5' } 
      ]}>
        <Image 
          source={icon} 
          style={{ 
            width: 24, 
            height: 24, 
            tintColor: isDanger ? '#FF4D4D' : '#2E3A91' 
          }} 
        />
      </View>
      
      {!isDanger ? (
        <>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={MyStyleSheet.profileMenuTitle}>{title}</Text>
            <Text style={MyStyleSheet.profileMenuSub}>{sub}</Text>
          </View>
          <Image 
            source={require('../public/Next.png')} 
            style={{ width: 20, height: 20, tintColor: '#CCC' }} 
          />
        </>
      ) : (
        <View style={{ marginLeft: 15 }}>
          <Text style={[MyStyleSheet.profileMenuTitle, { color: '#FF4D4D' }]}>{title}</Text>
          <Text style={[MyStyleSheet.profileMenuSub, { textAlign: 'center' }]}>{sub}</Text>
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* 1. Profile Header Section */}
      <View style={{ alignItems: 'center', paddingTop: 40, paddingBottom: 30 }}>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginBottom: 30 }]}>Profile</Text>
        
        <View style={MyStyleSheet.profileAvatarLarge}>
           <Image 
             source={user?.pimage ? { uri: user.pimage } : require('../public/Profile.png')} 
             style={{ width: '100%', height: '100%', borderRadius: 75 }} 
           />
        </View>

        <Text style={MyStyleSheet.profileUserName}>{user?.fname} {user?.lname}</Text>
        <Text style={MyStyleSheet.profileUserEmail}>{user?.email}</Text>
      </View>

      {/* 2. Menu Options Section */}
      <View style={MyStyleSheet.profileBottomCard}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          
          <ProfileMenuItem 
            title="Edit Profile" 
            sub="Manage your details" 
            icon={require('../public/Profile.png')} 
            onPress={() => opx.navigate('editprofile')}
          />

          <View style={MyStyleSheet.profileDivider} />

          <ProfileMenuItem 
            title="Invoice & Payments" 
            sub="View bills and pay" 
            icon={require('../public/Bill.png')} 
            onPress={() => opx.navigate('billing')}
          />

          <View style={MyStyleSheet.profileDivider} />

          <ProfileMenuItem 
            title="Password" 
            sub="Update password" 
            icon={require('../public/Pass.png')} 
            onPress={() => {}} 
          />

          <View style={MyStyleSheet.profileDivider} />

          <ProfileMenuItem 
            title="Settings" 
            sub="Control app preferences" 
            icon={require('../public/Settings.png')} 
            onPress={() => opx.navigate('settings')}
          />

          {/* Centered Logout Option */}
          <ProfileMenuItem 
            title="Logout" 
            sub="Sign out of your account" 
            icon={require('../public/Settings.png')} 
            onPress={() => setLogoutVisible(true)}
            isDanger={true}
          />

        </ScrollView>
      </View>

      {/* 3. Logout Confirmation Modal (Retained Logic) */}
      <Modal animationType="fade" transparent={true} visible={logoutVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.logoutModalContainer}>
            <Text style={MyStyleSheet.logoutTitle}>LOGOUT</Text>
            <Text style={MyStyleSheet.logoutSubTitle}>Do you want to logout?</Text>
            <View style={MyStyleSheet.logoutActionRow}>
              <TouchableOpacity 
                style={MyStyleSheet.yesBtn} 
                onPress={() => { setLogoutVisible(false); updateUser(null); opx.navigate('login'); }}
              >
                <Text style={MyStyleSheet.yesNoText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={MyStyleSheet.noBtn} onPress={() => setLogoutVisible(false)}>
                <Text style={MyStyleSheet.yesNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 4. Bottom Navigation */}
      <View style={MyStyleSheet.minimalBottomNav}>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('pet')}>
          <Image source={require('../public/Pets.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('selectpet')}>
          <Image source={require('../public/Book.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Appt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Profile.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
          <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}