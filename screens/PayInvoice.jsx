import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function PayInvoice() {
  const opx = useNavigation()
  const route = useRoute()
  
  // Get data passed from Unpaid/Overdue/AllInvoices
  const { invoice } = route.params || { 
    invoice: { code: 'SJVC-2026-03-0001', price: '5,300.00' } 
  }

  const [step, setStep] = useState(1); // 1 = Method, 2 = Type
  const [selectedMethod, setSelectedMethod] = useState('Credit Card');
  const [selectedType, setSelectedType] = useState('Full Payment');

  const paymentMethods = [
    { id: '1', name: 'Credit Card', sub: '(processed via PayMongo)' },
    { id: '2', name: 'Debit Card', sub: '(processed via PayMongo)' },
    { id: '3', name: 'GCash', sub: '(processed via PayMongo)' },
    { id: '4', name: 'Bank Transfer', sub: '(processed via PayMongo)' },
  ];

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity 
          onPress={() => step === 1 ? opx.goBack() : setStep(1)} 
          style={MyStyleSheet.backBtn}
        >
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Pay Invoice</Text>
      </View>

      {/* TOP SECTION: Invoice Specific Amount Card (Shadowed per Screenshot) */}
      {step === 1 && (
        <View style={[MyStyleSheet.dashOverviewCleanCard, { marginHorizontal: 25, marginTop: 10 }]}>
          <Text style={{ fontSize: 14, color: '#2E3A91', fontWeight: '600' }}>Total Amount</Text>
          <Text style={{ fontSize: 12, color: '#2E3A91', marginTop: 2 }}>{invoice.code}</Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#2E3A91', marginTop: 10 }}>₱{invoice.price}</Text>
        </View>
      )}

      {/* FLOATING SELECTION CONTAINER */}
      <View style={[MyStyleSheet.paymentFloatingContainer, step === 2 && { marginTop: 50 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {step === 1 ? (
            /* STEP 1: METHOD */
            <>
              <Text style={[MyStyleSheet.profileMenuTitle, { marginBottom: 25, fontSize: 18 }]}>Select payment method</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity 
                  key={method.id}
                  style={[MyStyleSheet.paymentMethodRow, selectedMethod === method.name && MyStyleSheet.paymentMethodSelected]}
                  onPress={() => setSelectedMethod(method.name)}
                >
                  <Text style={MyStyleSheet.paymentMethodName}>{method.name}</Text>
                  <Text style={MyStyleSheet.paymentMethodSub}>{method.sub}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            /* STEP 2: TYPE */
            <>
              <Text style={[MyStyleSheet.profileMenuTitle, { marginBottom: 25, fontSize: 18 }]}>Payment type</Text>
              <TouchableOpacity 
                style={[MyStyleSheet.paymentMethodRow, selectedType === 'Full Payment' && MyStyleSheet.paymentMethodSelected]}
                onPress={() => setSelectedType('Full Payment')}
              >
                <Text style={MyStyleSheet.paymentMethodName}>Full Payment</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[MyStyleSheet.paymentMethodRow, selectedType === 'Partial Payment / Installment' && MyStyleSheet.paymentMethodSelected]}
                onPress={() => setSelectedType('Partial Payment / Installment')}
              >
                <Text style={MyStyleSheet.paymentMethodName}>Partial Payment / Installment</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ACTION BUTTON */}
          <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginTop: 30 }]}
            onPress={() => step === 1 ? setStep(2) : console.log("Proceeding to PayMongo")}
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>
              {step === 1 ? "Next" : "Proceed to Payment"}
            </Text>
          </TouchableOpacity>

          {/* CANCEL (Step 2 Only) */}
          {step === 2 && (
            <TouchableOpacity onPress={() => opx.goBack()} style={{ marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
              <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>

    </SafeAreaView>
  )
}