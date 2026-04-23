import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentRemarks() {
  const opx = useNavigation()
  const route = useRoute()

  // Catching data from Date/Time screen
  const { 
    petName, petImage, petDetails, petWeight, service, 
    selectedDate, formattedTime, vet 
  } = route.params || {}

  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const handleNext = () => {
    opx.navigate('summary', { 
      petName, petImage, petDetails, petWeight, service, 
      selectedDate, formattedTime, vet,
      reason, notes 
    })
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20, marginBottom: 10 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>
            Book an appointment ({service})
        </Text>
      </View>

      {/* SHADOW CONTAINER */}
      <View style={MyStyleSheet.paymentFloatingContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          
          {/* REASON INPUT */}
          <Text style={[MyStyleSheet.profileMenuTitle, { fontSize: 20, marginTop: 10 }]}>
            Reason for Consultation (optional)
          </Text>
          <TextInput
            style={{
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderColor: '#CCC',
              borderRadius: 30,
              padding: 20,
              height: 180,
              textAlignVertical: 'top',
              marginTop: 15,
              fontSize: 16,
              color: '#2E3A91'
            }}
            placeholder="Any symptoms or details?"
            placeholderTextColor="#AAA"
            multiline={true}
            value={reason}
            onChangeText={setReason}
          />

          {/* NOTES INPUT */}
          <Text style={[MyStyleSheet.profileMenuTitle, { fontSize: 20, marginTop: 30 }]}>
            Notes (optional)
          </Text>
          <TextInput
            style={{
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderColor: '#CCC',
              borderRadius: 30,
              padding: 20,
              height: 180,
              textAlignVertical: 'top',
              marginTop: 15,
              fontSize: 16,
              color: '#2E3A91'
            }}
            placeholder="Enter notes"
            placeholderTextColor="#AAA"
            multiline={true}
            value={notes}
            onChangeText={setNotes}
          />

          {/* DISCLAIMER TEXT */}
          <Text style={{ 
            textAlign: 'center', 
            color: '#AAA', 
            fontSize: 12, 
            marginTop: 40, 
            lineHeight: 18,
            paddingHorizontal: 20 
          }}>
            This booking is for a consultation only. The veterinarian will evaluate your pet and recommend any further procedures or tests.
          </Text>

        </ScrollView>
      </View>

      {/* FOOTER BUTTON */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' }}>
        <TouchableOpacity 
            style={MyStyleSheet.primaryActionBtn}
            onPress={handleNext}
        >
          <Text style={MyStyleSheet.primaryActionBtnText}>Next</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}