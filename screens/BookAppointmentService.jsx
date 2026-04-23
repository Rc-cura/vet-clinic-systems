import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentService() {
  const opx = useNavigation()
  const route = useRoute()
  
  // Existing data from previous screens
  const { petName, petImage, petDetails, petWeight } = route.params || {}
  
  const [selectedServices, setSelectedServices] = useState([])

  const services = [
    { id: '1', name: 'Consultation / Routine Check-up', sub: null },
    { id: '2', name: 'Vaccination', sub: null },
    { id: '3', name: 'Groom', sub: null },
    { id: '4', name: 'Procedure / Surgery Request', sub: '(Vet Approval Required)' },
  ]

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id))
    } else {
      setSelectedServices([...selectedServices, id])
    }
  }

  const handleContinue = () => {
    const selectedIds = selectedServices;
    if (selectedIds.includes('1')) {
      opx.navigate('selectpet', { 
        service: 'Consultation / Routine Check-up',
        petName, petImage, petDetails, petWeight 
      });
    } else if (selectedIds.includes('2')) {
      opx.navigate('bookvaccine', { petName, petImage, petDetails, petWeight });
    } else if (selectedIds.includes('3')) {
      opx.navigate('bookgrooming', { petName, petImage, petDetails, petWeight });
    } else if (selectedIds.includes('4')) {
      opx.navigate('booksurgery', { petName, petImage, petDetails, petWeight });
    }
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20, marginBottom: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Book an Appointment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        
        <View style={{ alignItems: 'center' }}>
          {services.map((item) => {
            const isSelected = selectedServices.includes(item.id)
            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.8}
                style={[ 
                  MyStyleSheet.dashOverviewCleanCard, 
                  { 
                    width: '100%', 
                    paddingVertical: 35, 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#FFF' 
                  },
                  isSelected && { borderColor: '#2E3A91', borderWidth: 2 } 
                ]} 
                onPress={() => toggleService(item.id)}
              >
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: '#2E3A91', 
                  textAlign: 'center',
                  paddingHorizontal: 10
                }}>
                  {item.name}
                </Text>
                {item.sub && (
                  <Text style={{ color: '#2E3A91', fontSize: 14, marginTop: 5, textAlign: 'center' }}>
                    {item.sub}
                  </Text>
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[ 
            MyStyleSheet.primaryActionBtn, 
            { marginTop: 20 }, 
            selectedServices.length === 0 && { backgroundColor: '#F0F0F0' }
          ]} 
          disabled={selectedServices.length === 0}
          onPress={handleContinue}
        >
          <Text style={[MyStyleSheet.primaryActionBtnText, selectedServices.length === 0 && { color: '#CCC' }]}>
            Continue
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}