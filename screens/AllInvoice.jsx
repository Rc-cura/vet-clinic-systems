import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AllInvoice() {
  const opx = useNavigation()

  // Sample data 
  const invoices = [
    { id: '1', code: 'SJVC-2026-03-0001', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', status: 'Pending' },
    { id: '2', code: 'SJVC-2026-03-0002', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', status: 'Overdue' },
    { id: '3', code: 'SJVC-2026-03-0003', invDate: 'Jan. 23, 2025', dueDate: 'Jan. 24, 2025', service: '5-in-1 Vaccine + 3 more services', price: '5,300', status: 'Paid' },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#FFA500', text: '#FFF' };
      case 'Overdue': return { bg: '#FFBDBD', text: '#FF4D4D' };
      case 'Paid': return { bg: '#D1FFD7', text: '#28A745' };
      default: return { bg: '#EEE', text: '#000' };
    }
  }

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={MyStyleSheet.dashOverviewCleanCard}>
        {/* Header: Code and Status Tag */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E3A91' }}>{item.code}</Text>
          <View style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 15, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: statusStyle.text, fontSize: 10, fontWeight: 'bold' }}>{item.status}</Text>
          </View>
        </View>

        {/* Dates */}
        <Text style={{ color: '#AAA', fontSize: 12, marginTop: 5 }}>Invoice Date : {item.invDate}</Text>
        <Text style={{ color: '#AAA', fontSize: 12 }}>Due Date : {item.dueDate}</Text>
        
        {/* Service and Price */}
        <Text style={{ color: '#667085', fontSize: 14, marginTop: 15 }}>{item.service}</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2E3A91', marginTop: 5 }}>₱{item.price}</Text>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          {item.status !== 'Paid' ? (
            <>
              {/* --- ADDED NAVIGATION TO PAYINVOICE HERE --- */}
              <TouchableOpacity 
                style={MyStyleSheet.primaryActionBtn}
                onPress={() => opx.navigate('payinvoice', { invoice: item })}
              >
                <Text style={MyStyleSheet.primaryActionBtnText}>Pay now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[MyStyleSheet.secondaryOutlineBtn, { marginTop: 10, borderRadius: 25 }]}
                onPress={() => opx.navigate('fullinvoice', { invoice: item })}
              >
                <Text style={MyStyleSheet.secondaryOutlineText}>See full invoice</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Show Download and Full Invoice if Paid */}
              <TouchableOpacity style={[MyStyleSheet.secondaryOutlineBtn, { borderRadius: 25 }]}>
                <Text style={MyStyleSheet.secondaryOutlineText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[MyStyleSheet.secondaryOutlineBtn, { marginTop: 10, borderRadius: 25 }]}
                onPress={() => opx.navigate('fullinvoice', { invoice: item })}
              >
                <Text style={MyStyleSheet.secondaryOutlineText}>See full invoice</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      {/* HEADER SECTION */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>All Invoices</Text>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}