import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function UserProfilePage() {
  const opx = useNavigation()

  const [logoutVisible, setLogoutVisible] = useState(false)

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
        <Text style={MyStyleSheet.profileMainTitle}>Account Information</Text>

        {/* Form Fields */}
        <View style={{ marginTop: 10 }}>
          <Text style={MyStyleSheet.inputLabel}>First Name</Text>
          <TextInput style={MyStyleSheet.inputBox} placeholder=""/>

          <Text style={MyStyleSheet.inputLabel}>Last Name</Text>
          <TextInput style={MyStyleSheet.inputBox} placeholder="" />

          <Text style={MyStyleSheet.inputLabel}>Email</Text>
          <TextInput style={MyStyleSheet.inputBox} placeholder="" keyboardType="email-address" />

          <Text style={MyStyleSheet.inputLabel}>Contact Number</Text>
          <TextInput style={MyStyleSheet.inputBox} placeholder="" keyboardType="phone-pad" />

          <Text style={MyStyleSheet.inputLabel}>Password</Text>
          <TextInput style={MyStyleSheet.inputBox} placeholder="" secureTextEntry={true} />
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={MyStyleSheet.primaryBlueBtn} onPress={() => {opx.navigate('editprofile')}}>
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

      {/* LOGOUT MODAL (image_4dea9c.png) */}
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
                  opx.navigate('login'); // O kung saan man ang login route mo
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