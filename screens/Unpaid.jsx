import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function Unpaid() {
  const opx = useNavigation()

  const unpaidInvoices = [
    { id: '1', code: 'SJVC-2026-03-0001', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', isPending: true },
    { id: '2', code: 'SJVC-2026-03-0001', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', isPending: true },
    { id: '3', code: 'SJVC-2026-03-0001', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', isPending: false },
  ]

  const renderItem = ({ item, index }) => (
    <View style={MyStyleSheet.dashOverviewCleanCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E3A91' }}>{item.code}</Text>
        <View style={{ backgroundColor: '#FFA500', paddingHorizontal: 15, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>Pending</Text>
        </View>
      </View>
      
      <Text style={{ color: '#AAA', fontSize: 12, marginTop: 5 }}>Invoice Date : {item.invDate}</Text>
      <Text style={{ color: '#AAA', fontSize: 12 }}>Due Date : {item.dueDate}</Text>
      
      <Text style={{ color: '#667085', fontSize: 14, marginTop: 15 }}>{item.service}</Text>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2E3A91', marginTop: 5 }}>₱{item.price}</Text>

      <View style={{ marginTop: 20 }}>
        {index === 2 ? (
          <TouchableOpacity style={MyStyleSheet.primaryActionBtn}>
             <Text style={MyStyleSheet.primaryActionBtnText}>Download</Text>
          </TouchableOpacity>
        ) : (
          /* --- ADDED NAVIGATION TO PAYINVOICE --- */
          <TouchableOpacity 
            style={MyStyleSheet.primaryActionBtn}
            onPress={() => opx.navigate('payinvoice', { invoice: item })}
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>Pay now</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[MyStyleSheet.secondaryOutlineBtn, { marginTop: 10, borderRadius: 25 }]}
          onPress={() => opx.navigate('fullinvoice', { invoice: { ...item, status: 'Pending' } })}
        >
          <Text style={MyStyleSheet.secondaryOutlineText}>See full invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Unpaid</Text>
      </View>

      <FlatList
        data={unpaidInvoices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}