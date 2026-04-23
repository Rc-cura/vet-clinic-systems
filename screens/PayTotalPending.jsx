import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function PayTotalPending() {
  const opx = useNavigation()
  const [selectedMethod, setSelectedMethod] = useState('Credit Card')

  const paymentMethods = [
    { id: '1', name: 'Credit Card', sub: '(processed via PayMongo)' },
    { id: '2', name: 'Debit Card', sub: '(processed via PayMongo)' },
    { id: '3', name: 'GCash', sub: '(processed via PayMongo)' },
    { id: '4', name: 'Bank Transfer', sub: '(processed via PayMongo)' },
  ]

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Pay Total Pending</Text>
      </View>

      {/* TOP SECTION: Flat text (Matches Picture 1) */}
      <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
        <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: '500' }}>Total Pending</Text>
        <Text style={{ fontSize: 42, fontWeight: 'bold', color: '#2E3A91', marginTop: 10 }}>₱30,900.00</Text>
      </View>

      {/* BOTTOM SECTION: Floating Shadowed Container */}
      <View style={MyStyleSheet.paymentFloatingContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[MyStyleSheet.profileMenuTitle, { marginBottom: 25, fontSize: 18 }]}>Select payment method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity 
              key={method.id}
              activeOpacity={0.8}
              onPress={() => setSelectedMethod(method.name)}
              style={[
                MyStyleSheet.paymentMethodRow,
                selectedMethod === method.name && MyStyleSheet.paymentMethodSelected
              ]}
            >
              <Text style={MyStyleSheet.paymentMethodName}>{method.name}</Text>
              <Text style={MyStyleSheet.paymentMethodSub}>{method.sub}</Text>
            </TouchableOpacity>
          ))}

          {/* NEXT BUTTON */}
          <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginTop: 30, marginBottom: 40 }]}
            onPress={() => {/* Proceed logic */}}
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

    </SafeAreaView>
  )
}