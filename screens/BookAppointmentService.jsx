import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentService() {
  const opx = useNavigation()
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
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Image source={require('../public/back_arrow.svg')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Book an Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

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
                {/* SVG Icon Replacement */}
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
          onPress={() => opx.navigate('datetime', { services: selectedServices })}
        >
          <Text style={[
            MyStyleSheet.primaryBlueBtnText,
            selectedServices.length === 0 && { color: '#CCC' }
          ]}>
            Continue
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}