import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 
import { Registered } from '../App' // Import the 'database' array from App

export default function EditUserProfilePage() {
  const opx = useNavigation()
  const { user, updateUser } = useUser() 
  
  // Initialize state with global user data
  const [formData, setFormData] = useState({
    fname: user?.fname || '',
    lname: user?.lname || '',
    email: user?.email || '',
    contact: user?.contact || '',
    password: user?.password || '',
  })

  const [successVisible, setSuccessVisible] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const saveProfile = () => {
    // 1. UPDATE THE "DATABASE" (The array in App.js)
    // We find the user based on their unique email
    const userIndex = Registered.findIndex(item => item.email === user?.email);
    
    if (userIndex !== -1) {
      // Replace the old user data with the new formData in the array
      Registered[userIndex] = { ...formData };
    }

    // 2. UPDATE THE GLOBAL CONTEXT (The current session)
    updateUser(formData); 
    
    // 3. SHOW SUCCESS MODAL
    setSuccessVisible(true);
  }

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40, paddingTop: 20 }}>
        <Text style={MyStyleSheet.profileMainTitle}>Edit Profile</Text>

        <View style={{ marginTop: 10 }}>
          <Text style={MyStyleSheet.inputLabel}>First Name</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={formData.fname}
            onChangeText={(text) => handleInputChange('fname', text)}
          />

          <Text style={MyStyleSheet.inputLabel}>Last Name</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            value={formData.lname}
            onChangeText={(text) => handleInputChange('lname', text)}
          />

          <Text style={MyStyleSheet.inputLabel}>Email</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            keyboardType="email-address" 
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />

          <Text style={MyStyleSheet.inputLabel}>Contact Number</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            keyboardType="phone-pad" 
            value={formData.contact}
            onChangeText={(text) => handleInputChange('contact', text)}
          />

          <Text style={MyStyleSheet.inputLabel}>Password</Text>
          <TextInput 
            style={MyStyleSheet.inputBox} 
            secureTextEntry={true} 
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
        </View>

        <TouchableOpacity 
          style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]}
          onPress={saveProfile}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={successVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successModalSmall}>
            <Text style={MyStyleSheet.successModalText}>Successfully Edited User Profile</Text>
            
            <TouchableOpacity 
              style={MyStyleSheet.viewProfileModalBtn}
              onPress={() => {
                setSuccessVisible(false);
                opx.navigate('userprofile'); 
              }}
            >
              <Text style={MyStyleSheet.viewProfileModalText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}