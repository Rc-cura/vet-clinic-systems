import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function FullInvoice() {
  const opx = useNavigation()
  const route = useRoute()
  
  // Get the invoice data passed from the previous page
  const { invoice } = route.params || { 
    invoice: { 
      code: 'SJVC-2026-03-0001', 
      invDate: 'Jan. 23, 2025', 
      dueDate: 'Jan. 24, 2025', 
      status: 'Pending', 
      price: '5,300' 
    } 
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#FFA500', text: '#FFF' };
      case 'Overdue': return { bg: '#FFBDBD', text: '#FF4D4D' };
      case 'Paid': return { bg: '#D1FFD7', text: '#28A745' };
      default: return { bg: '#EEE', text: '#000' };
    }
  }

  const statusStyle = getStatusStyle(invoice.status);

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Full Invoice</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 20 }}>
        
        {/* Invoice Top Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2E3A91' }}>{invoice.code}</Text>
          <View style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 15 }}>
            <Text style={{ color: statusStyle.text, fontSize: 11, fontWeight: 'bold' }}>{invoice.status}</Text>
          </View>
        </View>

        <Text style={{ color: '#AAA', fontSize: 13, marginTop: 5 }}>Invoice Date : {invoice.invDate}</Text>
        <Text style={{ color: '#AAA', fontSize: 13 }}>Due Date : {invoice.dueDate}</Text>

        {/* Items List */}
        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ color: '#2E3A91', fontSize: 16 }}>5-in-1 Vaccine</Text>
            <Text style={{ color: '#AAA', fontSize: 16 }}>₱400.00</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ color: '#2E3A91', fontSize: 16 }}>Skin Allergy Check</Text>
            <Text style={{ color: '#AAA', fontSize: 16 }}>₱6,000.00</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ color: '#2E3A91', fontSize: 16 }}>Dental Cleaning</Text>
            <Text style={{ color: '#AAA', fontSize: 16 }}>₱6,000.00</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 20 }} />

        {/* Total Amount */}
        <Text style={{ fontSize: 18, color: '#2E3A91', fontWeight: 'bold' }}>Total Amount</Text>
        <Text style={{ fontSize: 42, fontWeight: 'bold', color: '#2E3A91', marginTop: 5 }}>₱{invoice.price}</Text>

        {/* Buttons - Conditional based on Status */}
        <View style={{ marginTop: 50 }}>
          {invoice.status !== 'Paid' && (
            <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { marginBottom: 15 }]}>
              <Text style={MyStyleSheet.primaryActionBtnText}>Pay now</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={[MyStyleSheet.secondaryOutlineBtn, { borderRadius: 25 }]}>
            <Text style={MyStyleSheet.secondaryOutlineText}>Download</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}