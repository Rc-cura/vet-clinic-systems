import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentService() {
  const opx = useNavigation()
  const route = useRoute()
  const { petName, petImage, petDetails, petWeight } = route.params || {}
  
  const [selectedServices, setSelectedServices] = useState([])

  const services = [
    { id: '1', name: 'Consultation Services', icon: require('../public/medical_icon.svg') },
    { id: '2', name: 'Vaccination Services', icon: require('../public/vaccination.svg') },
    { id: '3', name: 'Grooming & Wellness', icon: require('../public/grooming.svg') },
  ]

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id))
    } else {
      setSelectedServices([...selectedServices, id])
    }
  }

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }}>
        <Text style={[MyStyleSheet.selectPetLabel, { textAlign: 'center', marginTop: 20 }]}>Select Service</Text>
        
        <View style={[MyStyleSheet.progressBarBg, { alignSelf: 'center', marginVertical: 20 }]}>
          <View style={[MyStyleSheet.progressBarActive, { width: '50%' }]} />
        </View>

        <View style={{ alignItems: 'center' }}>
          {services.map((item) => {
            const isSelected = selectedServices.includes(item.id)
            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.8}
                style={[
                  MyStyleSheet.serviceCard, 
                  isSelected && { borderColor: '#5C93E8', borderWidth: 2 } 
                ]} 
                onPress={() => toggleService(item.id)}
              >
                <Image 
                  source={item.icon} 
                  style={{ width: 50, height: 50, marginBottom: 10 }} 
                  resizeMode="contain" 
                />
                <Text style={MyStyleSheet.serviceCardText}>{item.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={[MyStyleSheet.disclaimerText, { textAlign: 'center', marginTop: 30 }]}>
          *Disclaimer: Pet owners cannot diagnose their pets. They only request a service.
        </Text>

        <TouchableOpacity 
          style={[
            MyStyleSheet.primaryBlueBtn, 
            { marginTop: 1 },
            selectedServices.length === 0 && { backgroundColor: '#F0F0F0' }
          ]} 
          disabled={selectedServices.length === 0}
          onPress={() => {
            // FIXED: Map through all selected IDs to get their names, then join them with a comma
            const allSelectedNames = services
              .filter(s => selectedServices.includes(s.id))
              .map(s => s.name)
              .join(", ");

            opx.navigate('datetime', { 
              petName, 
              petImage, 
              petDetails, 
              petWeight,
              service: allSelectedNames // Pass the combined string
            })
          }}
        >
          <Text style={[MyStyleSheet.primaryBlueBtnText, selectedServices.length === 0 && { color: '#CCC' }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}