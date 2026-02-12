import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function EditUserProfilePage() {
  const opx = useNavigation()
  const [successVisible, setSuccessVisible] = useState(false)

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        <Text style={MyStyleSheet.profileMainTitle}>Edit Profile</Text>

        {/* Edit Fields */}
        <View style={{ marginTop: 10 }}>
          <Text style={MyStyleSheet.inputLabel}>First Name</Text>
          <TextInput style={MyStyleSheet.inputBox}  />

          <Text style={MyStyleSheet.inputLabel}>Last Name</Text>
          <TextInput style={MyStyleSheet.inputBox}  />

          <Text style={MyStyleSheet.inputLabel}>Email</Text>
          <TextInput style={MyStyleSheet.inputBox}  keyboardType="email-address" />

          <Text style={MyStyleSheet.inputLabel}>Contact Number</Text>
          <TextInput style={MyStyleSheet.inputBox}  keyboardType="phone-pad" />

          <Text style={MyStyleSheet.inputLabel}>Password</Text>
          <TextInput style={MyStyleSheet.inputBox}  secureTextEntry={true} />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]}
          onPress={() => setSuccessVisible(true)}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SUCCESS MODAL (image_4e4b35.png) */}
      <Modal animationType="fade" transparent={true} visible={successVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successModalSmall}>
            <Text style={MyStyleSheet.successModalText}>Successfully Edited User Profile</Text>
            
            <TouchableOpacity 
              style={MyStyleSheet.viewProfileModalBtn}
              onPress={() => {
                setSuccessVisible(false);
                opx.navigate('userprofile'); // Balik sa main profile view
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