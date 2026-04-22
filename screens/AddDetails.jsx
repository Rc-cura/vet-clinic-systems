import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddDetails() {
  const opx = useNavigation();
  const route = useRoute();
  const { onboardingData } = route.params || {}; // Kunin ang data mula sa Step 1
  const [contact, setContact] = useState('');

  const handleNext = () => {
    opx.navigate('background', {
      onboardingData: { ...onboardingData, contact_number: contact }
    });
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>How can we reach you?</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, alignItems: 'center', paddingBottom: 40 }}>
        <View style={MyStyleSheet.stepperMainContainer}>
          <View style={MyStyleSheet.stepperBackgroundLine} />
          <View style={MyStyleSheet.stepperContentRow}>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Add a profile{"\n"}picture</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>2</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>How can we{"\n"}reach you?</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>3</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>Background</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>4</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>Address</Text>
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 40 }}>
          <Image source={require('../public/catcat.png')} style={{ width: 280, height: 220 }} resizeMode="contain" />
        </View>

        <View style={{ width: '100%' }}>
          <Text style={MyStyleSheet.fieldLabel}>Contact Number</Text>
          <View style={MyStyleSheet.details_inputWrapper}>
            <Image source={require('../public/Profile.png')} style={{ width: 20, height: 20, marginRight: 10, tintColor: '#CCC' }} />
            <TextInput 
              style={{ flex: 1, height: 55, color: '#000' }} 
              placeholder="09XX XXX XXXX" 
              keyboardType="phone-pad"
              value={contact}
              onChangeText={(v) => setContact(v)}
            />
          </View>
        </View>

        <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { flexDirection: 'row', marginTop: 50 }]} onPress={handleNext}>
            <Text style={[MyStyleSheet.primaryActionBtnText, { marginRight: 10 }]}>Next</Text>
            <Text style={{ color: '#FFF', fontSize: 20 }}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}