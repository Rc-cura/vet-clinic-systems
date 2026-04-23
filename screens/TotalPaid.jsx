import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function TotalPaid() {
  const opx = useNavigation()

  // Sample data based on your screenshot
  const paidInvoices = [
    { id: '1', code: 'SJVC-2026-03-0001', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300' },
    { id: '2', code: 'SJVC-2026-03-0002', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300' },
    { id: '3', code: 'SJVC-2026-03-0003', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300' },
    { id: '4', code: 'SJVC-2026-03-0004', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,000' },
    { id: '5', code: 'SJVC-2026-03-0005', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,000' },
    { id: '6', code: 'SJVC-2026-03-0006', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,000' },
  ]

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 25 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E3A91' }}>{item.code}</Text>
        {/* Green "Paid" Tag */}
        <View style={{ backgroundColor: '#D1FFD7', paddingHorizontal: 20, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#28A745', fontSize: 10, fontWeight: 'bold' }}>Paid</Text>
        </View>
      </View>
      
      <Text style={{ color: '#AAA', fontSize: 12, marginTop: 2 }}>Due Date : {item.dueDate}</Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
        <Text style={{ color: '#667085', fontSize: 14 }}>{item.service}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E3A91' }}>₱{item.price}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10, fontSize: 22 }]}>Total Paid (This Month)</Text>
      </View>

      {/* LIST OF PAID INVOICES */}
      <FlatList
        data={paidInvoices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View style={{ marginTop: 10 }}>
            <View style={{ height: 1, backgroundColor: '#EEE', marginBottom: 20 }} />
            
            <Text style={{ fontSize: 18, color: '#2E3A91', fontWeight: '500' }}>Total amount</Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#2E3A91', marginTop: 10 }}>₱30,900.00</Text>
          </View>
        )}
      />

    </SafeAreaView>
  )
}