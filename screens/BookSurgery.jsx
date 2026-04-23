import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookSurgery() {
  const opx = useNavigation()
  const route = useRoute()

  // Catching data passed from the main Service screen
  const { petName, petImage, petDetails, petWeight } = route.params || {}
  
  const [selected, setSelected] = useState('Spay / Neuter (Ovariohysterectomy / Castration)')

  const surgeryTypes = [
    'Spay / Neuter (Ovariohysterectomy / Castration)',
    'Wound repair & laceration management',
    'Foreign body removal or simple abdominal surgery',
    'Basic soft-tissue surgeries'
  ]

  const handleNext = () => {
    opx.navigate('selectpet', { 
      petName, petImage, petDetails, petWeight, 
      service: `Surgery (${selected})` 
    })
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20, marginBottom: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>
          Book an appointment (Procedure / Surgery Request)
        </Text>
      </View>

      {/* SHADOW CONTAINER */}
      <View style={MyStyleSheet.paymentFloatingContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <Text style={[MyStyleSheet.profileMenuTitle, { marginBottom: 10 }]}>
            What procedure are you interested in?
          </Text>
          
          <Text style={{ color: '#AAA', fontSize: 13, marginBottom: 20, lineHeight: 18 }}>
            All procedures require a pre-examination. Final approval depends on the veterinarian.
          </Text>

          {/* SEARCH BAR */}
          <View style={[MyStyleSheet.searchContainer, { marginBottom: 20 }]}>
            <Image 
              source={require('../public/search_icon.png')} 
              style={{ width: 18, height: 18, marginRight: 10, tintColor: '#AAA' }} 
              resizeMode="contain"
            />
            <TextInput 
              placeholder="Search" 
              placeholderTextColor="#AAA"
              style={{ flex: 1, height: '100%', color: '#2E3A91' }} 
            />
          </View>

          {/* SURGERY OPTIONS */}
          {surgeryTypes.map((item) => (
            <TouchableOpacity 
              key={item}
              activeOpacity={0.8}
              style={[
                MyStyleSheet.paymentMethodRow, 
                { backgroundColor: '#F0F5FF', paddingVertical: 20 }, 
                selected === item && MyStyleSheet.paymentMethodSelected
              ]}
              onPress={() => setSelected(item)}
            >
              <Text style={[MyStyleSheet.paymentMethodName, { fontSize: 15, lineHeight: 22 }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}

          {/* NEXT BUTTON */}
          <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginTop: 40, marginBottom: 30 }]}
            onPress={handleNext}
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>Next</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

    </SafeAreaView>
  )
}