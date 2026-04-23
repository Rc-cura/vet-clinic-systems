import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookVaccine() {
  const opx = useNavigation()
  const route = useRoute()

  // Data passed from the main Service screen
  const { petName, petImage, petDetails, petWeight } = route.params || {}
  
  const [selected, setSelected] = useState('Rabies')
  const [otherVaccine, setOtherVaccine] = useState('')

  const vaccineTypes = ['Rabies', 'Distemper / Parvo', 'Leptospirosis']

  const handleNext = () => {
    const finalVaccine = otherVaccine.trim() !== '' ? otherVaccine : selected;
    opx.navigate('selectpet', { 
      petName, petImage, petDetails, petWeight, 
      service: `Vaccination (${finalVaccine})` 
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
          Book an appointment (Vaccination)
        </Text>
      </View>

      {/* SHADOW CONTAINER */}
      <View style={MyStyleSheet.paymentFloatingContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <Text style={[MyStyleSheet.profileMenuTitle, { marginBottom: 15 }]}>Vaccine Type:</Text>

          {/* SEARCH BAR WITH ICON */}
          <View style={MyStyleSheet.searchContainer}>
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

          {/* VACCINE OPTIONS */}
          <View style={{ marginTop: 10 }}>
            {vaccineTypes.map((item) => (
              <TouchableOpacity 
                key={item}
                activeOpacity={0.8}
                style={[
                  MyStyleSheet.paymentMethodRow, 
                  { backgroundColor: '#F0F5FF' }, 
                  selected === item && MyStyleSheet.paymentMethodSelected
                ]}
                onPress={() => {
                  setSelected(item);
                  setOtherVaccine(''); 
                }}
              >
                <Text style={MyStyleSheet.paymentMethodName}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* OTHER INPUT SECTION */}
          <View style={[MyStyleSheet.paymentMethodRow, { backgroundColor: '#F0F5FF', marginTop: 25, paddingVertical: 20 }]}>
            <View style={{ width: '100%' }}>
              <Text style={{ color: '#2E3A91', fontWeight: 'bold', marginBottom: 10 }}>Other:</Text>
              <TextInput 
                placeholder="Enter other vaccine type" 
                placeholderTextColor="#AAA"
                value={otherVaccine}
                onChangeText={(txt) => {
                    setOtherVaccine(txt);
                    setSelected(''); 
                }}
                style={{ 
                  backgroundColor: '#FFF', 
                  borderRadius: 12, 
                  padding: 12, 
                  borderWidth: 1, 
                  borderColor: '#2E3A91',
                  color: '#2E3A91'
                }} 
              />
            </View>
          </View>

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