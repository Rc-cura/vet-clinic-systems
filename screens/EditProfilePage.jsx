import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' 
import { Registered } from '../App' 

export default function EditUserProfilePage() {
  const opx = useNavigation()
  const { user, updateUser } = useUser() 
  
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
    const userIndex = Registered.findIndex(item => item.email === user?.email);
    if (userIndex !== -1) {
      Registered[userIndex] = { ...formData };
    }
    updateUser(formData); 
    setSuccessVisible(true);
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      {/* Header with Back Button */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40, paddingTop: 10 }}>
        
        <View style={{ marginTop: 20 }}>
          <Text style={MyStyleSheet.fieldLabel}>First Name</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            value={formData.fname} 
            placeholder="Enter first name"
            onChangeText={(text) => handleInputChange('fname', text)} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Last Name</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            value={formData.lname} 
            placeholder="Enter last name"
            onChangeText={(text) => handleInputChange('lname', text)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Email</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            keyboardType="email-address" 
            value={formData.email} 
            placeholder="example@gmail.com"
            onChangeText={(text) => handleInputChange('email', text)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Contact Number</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            keyboardType="phone-pad" 
            value={formData.contact} 
            placeholder="09123456789"
            onChangeText={(text) => handleInputChange('contact', text)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Password</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            secureTextEntry={true} 
            value={formData.password} 
            placeholder="********"
            onChangeText={(text) => handleInputChange('password', text)}
          />
        </View>

        {/* Primary Action Button (Matches Pet Edit Style) */}
        <TouchableOpacity 
          style={[MyStyleSheet.primaryActionBtn, { marginTop: 40 }]} 
          onPress={saveProfile} 
        >
          <Text style={MyStyleSheet.primaryActionBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal animationType="fade" transparent={true} visible={successVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successModalSmall}>
            <Text style={MyStyleSheet.successModalText}>Successfully Edited User Profile</Text>
            <TouchableOpacity 
              style={MyStyleSheet.viewProfileModalBtn} 
              onPress={() => { setSuccessVisible(false); opx.navigate('userprofile'); }} 
            >
              <Text style={MyStyleSheet.viewProfileModalText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}