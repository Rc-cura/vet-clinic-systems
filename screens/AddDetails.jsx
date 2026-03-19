import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddDetails() {
  const opx = useNavigation();
  const [details, setDetails] = useState({ contact: '', address: '' });

  return (
    <SafeAreaView style={MyStyleSheet.profilepic_container}>
      
      {/* Background Decorative Paws - Fills the empty space */}
      <Text style={{ position: 'absolute', top: 120, left: 10, fontSize: 60, color: '#FFC1CC', opacity: 0.15 }}>🐾</Text>
      <Text style={{ position: 'absolute', top: 220, right: 10, fontSize: 80, color: '#FFC1CC', opacity: 0.15 }}>🐾</Text>
      <Text style={{ position: 'absolute', bottom: 200, left: 30, fontSize: 50, color: '#FFC1CC', opacity: 0.1 }}>🐾</Text>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        
        <Text style={[MyStyleSheet.profilepic_title, { marginTop: 60 }]}>How can we reach you?</Text>

        {/* Space where the image was */}
        <View style={{ height: 50 }} /> 

        <Text style={MyStyleSheet.details_subtitle}>
            Your contact number and address helps us provide local emergency care and ensures your pet's records are accurate. We'll only use this for clinic-related services.
        </Text>

        {/* Input Fields */}
        <View style={{ width: '85%', marginTop: 40 }}>
            <Text style={MyStyleSheet.details_label}>Contact Number</Text>
            <View style={MyStyleSheet.details_inputWrapper}>
                <Text style={{ marginRight: 10, fontSize: 18 }}>📞</Text>
                <TextInput 
                    style={{ flex: 1, color: '#000' }} 
                    placeholder="09XX XXX XXXX" 
                    placeholderTextColor="#B0B3B8"
                    keyboardType="phone-pad"
                    onChangeText={(v) => setDetails({...details, contact: v})}
                />
            </View>

            <Text style={[MyStyleSheet.details_label, { marginTop: 25 }]}>Address</Text>
            <View style={MyStyleSheet.details_inputWrapper}>
                <Text style={{ marginRight: 10, fontSize: 18 }}>📍</Text>
                <TextInput 
                    style={{ flex: 1, color: '#000' }} 
                    placeholder="Pasay City" 
                    placeholderTextColor="#B0B3B8"
                    onChangeText={(v) => setDetails({...details, address: v})}
                />
            </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={[MyStyleSheet.profilepic_addBtn, { marginTop: 60 }]}>
            <Text style={MyStyleSheet.profilepic_btnText}>Add Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={MyStyleSheet.profilepic_skipBtn}
            onPress={() => opx.navigate('dashboard')}
        >
            <Text style={MyStyleSheet.profilepic_skipText}>Skip</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}