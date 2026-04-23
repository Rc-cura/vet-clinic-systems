import { View, Text, TouchableOpacity, SafeAreaView, Modal, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext'

export default function BillingPage() {
  const opx = useNavigation()
  const { user } = useUser()
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // --- Helper for the Summary Cards ---
  const SummaryCard = ({ title, amount, subTitle, onPress }) => (
    <TouchableOpacity 
      style={MyStyleSheet.dashOverviewCleanCard} 
      onPress={onPress}
      disabled={!onPress} 
      activeOpacity={0.7}
    >
      <Text style={[MyStyleSheet.dashOverviewTitleText, {fontSize: 18}]}>{title}</Text>
      {subTitle && <Text style={MyStyleSheet.dashOverviewSubText}>{subTitle}</Text>}
      <Text style={[MyStyleSheet.dashOverviewBillingText, {marginTop: 10}]}>{amount}</Text>
    </TouchableOpacity>
  );

  // --- Helper for Category Filter Cards ---
  const CategoryCard = ({ title, subTitle, onPress }) => (
    <View style={MyStyleSheet.dashOverviewCleanCard}>
      <Text style={MyStyleSheet.dashOverviewTitleText}>{title}</Text>
      <Text style={MyStyleSheet.dashOverviewSubText}>{subTitle}</Text>
      <TouchableOpacity 
        style={[MyStyleSheet.primaryActionBtn, {backgroundColor: '#E0E0E0', marginTop: 15, height: 45}]}
        onPress={onPress} 
      >
        <Text style={[MyStyleSheet.primaryActionBtnText, {color: '#2E3A91', fontSize: 14}]}>View details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER WITH BACK BUTTON */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Invoice & Payments</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
        
        {/* --- Total Summary Section --- */}
        <SummaryCard 
          title="Total Pending" 
          amount="₱1,400.00" 
          onPress={() => opx.navigate('totalpending')} 
        />
        
        <SummaryCard 
          title="Total Paid" 
          subTitle="This Month" 
          amount="₱12,400.00" 
          onPress={() => opx.navigate('totalpaid')}
        />

        {/* --- Invoice Categories Section --- */}
        <CategoryCard 
          title="All Invoices" 
          subTitle="View all invoices regardless of status." 
          onPress={() => opx.navigate('allinvoice')} // Added this trigger
        />
        
        <CategoryCard 
          title="Paid" 
          subTitle="Invoices that have been fully paid." 
          onPress={() => opx.navigate('paid')}
        />
        
        <CategoryCard 
          title="Unpaid" 
          subTitle="Invoices that are waiting for payment." 
          onPress={() => opx.navigate('unpaid')}
        />
        
        <CategoryCard title="Overdue" 
        subTitle="Invoices that are past their due date." 
        onPress={() => opx.navigate('overdue')}
        />

      </ScrollView>

      {/* Logic for Modal Detail (UNCHANGED) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => setModalVisible(false)} />
          <View style={MyStyleSheet.billingModalBox}>
            <Text style={MyStyleSheet.billingModalTitle}>INVOICE DETAILS</Text>
            <View style={MyStyleSheet.billingTotalRow}>
              <Text style={MyStyleSheet.billingTotalLabel}>Total Amount</Text>
              <Text style={MyStyleSheet.billingTotalValue}>₱ {selectedInvoice?.price || '0'}.00</Text>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}