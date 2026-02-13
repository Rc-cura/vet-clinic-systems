import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 

export default function UserProfilePage() {
  const opx = useNavigation()
  const { user, updateUser } = useUser() 

  const [logoutVisible, setLogoutVisible] = useState(false)

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40, paddingTop: 20 }}>
        <Text style={MyStyleSheet.profileMainTitle}>Account Information</Text>

        {/* Form Fields */}
        <View style={{ marginTop: 10 }}>
          <Text style={MyStyleSheet.inputLabel}>First Name</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={user?.fname || ""} 
            editable={false} 
          />

          <Text style={MyStyleSheet.inputLabel}>Last Name</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={user?.lname || ""} 
            editable={false} 
          />

          <Text style={MyStyleSheet.inputLabel}>Email</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={user?.email || ""} 
            editable={false} 
          />

          <Text style={MyStyleSheet.inputLabel}>Contact Number</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={user?.contact || ""} 
            editable={false} 
          />

          <Text style={MyStyleSheet.inputLabel}>Password</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={user?.password || ""} 
            secureTextEntry={true} 
            editable={false} 
          />
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity 
            style={MyStyleSheet.primaryBlueBtn} 
            onPress={() => opx.navigate('editprofile')}
          >
            <Text style={MyStyleSheet.primaryBlueBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={MyStyleSheet.secondaryOutlineBtn} 
            onPress={() => setLogoutVisible(true)}
          >
            <Text style={MyStyleSheet.secondaryOutlineText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* LOGOUT MODAL */}
      <Modal animationType="fade" transparent={true} visible={logoutVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.logoutModalContainer}>
            <Text style={MyStyleSheet.logoutTitle}>LOGOUT</Text>
            <Text style={MyStyleSheet.logoutSubTitle}>Do you want to logout?</Text>
            
            <View style={MyStyleSheet.logoutActionRow}>
              <TouchableOpacity 
                style={MyStyleSheet.yesBtn}
                onPress={() => {
                  setLogoutVisible(false);
                  updateUser(null); 
                  opx.navigate('login'); 
                }}
              >
                <Text style={MyStyleSheet.yesNoText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={MyStyleSheet.noBtn} 
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={MyStyleSheet.yesNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}