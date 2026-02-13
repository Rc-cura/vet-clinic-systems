import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext' // 1. Import the context hook

export default function BillingPage() {
  const opx = useNavigation()
  const { user } = useUser() // 2. Access global user data
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const invoices = [
    { id: '1', num: 'INV-2025-001', pet: 'Bard', service: 'Grooming', date: 'Jan. 23, 2025', price: '1000' },
    { id: '2', num: 'INV-2025-002', pet: 'Bard', service: 'Grooming', date: 'Jan. 23, 2025', price: '1000' },
    { id: '3', num: 'INV-2025-003', pet: 'Bard', service: 'Grooming', date: 'Jan. 23, 2025', price: '1000' },
  ]

  const openDetails = (item) => {
    setSelectedInvoice(item);
    setModalVisible(true);
  }

  const renderInvoice = ({ item }) => (
    <View style={MyStyleSheet.invoiceCard}>
      <Text style={MyStyleSheet.invoiceNumber}>{item.num}</Text>
      
      <View style={MyStyleSheet.invoiceDetailsRow}>
        <View>
          <Text style={MyStyleSheet.invoiceLabel}>Pet Name</Text>
          <Text style={MyStyleSheet.invoiceValue}>{item.pet}</Text>
        </View>
        <View>
          <Text style={MyStyleSheet.invoiceLabel}>Service</Text>
          <Text style={MyStyleSheet.invoiceValue}>{item.service}</Text>
        </View>
        <View>
          <Text style={MyStyleSheet.invoiceLabel}>Invoice Date</Text>
          <Text style={MyStyleSheet.invoiceValue}>{item.date}</Text>
        </View>
      </View>

      <View style={MyStyleSheet.invoiceDivider} />

      <View style={MyStyleSheet.invoiceActionRow}>
        <Text style={MyStyleSheet.invoicePrice}>₱ {item.price}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={MyStyleSheet.viewBtn} onPress={() => openDetails(item)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../public/view_eye.svg')} style={{ width: 16, height: 16, marginRight: 5 }} />
                <Text style={MyStyleSheet.viewBtnText}>View Details</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={MyStyleSheet.downloadBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../public/download.svg')} style={{ width: 16, height: 16, marginRight: 5 }} />
                <Text style={MyStyleSheet.downloadBtnText}>Download</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={MyStyleSheet.dashHeader}>
        {/* 3. Updated dynamic greeting */}
        <Text style={MyStyleSheet.welcomeText}>Hi, {user?.fname || 'User'}!</Text>
        
        <View style={MyStyleSheet.headerIcons}>
          <TouchableOpacity onPress={()=>{opx.navigate('userprofile')}}>
            <View style={MyStyleSheet.profileCircle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => opx.navigate('notification')}>
            <Image source={require('../public/Doorbell.svg')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 25, marginBottom: 10 }}>
        <Text style={MyStyleSheet.sectionTitle}>Invoices</Text>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderInvoice}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      />

      {/* --- INVOICE DETAILS MODAL --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <TouchableOpacity 
            style={{position: 'absolute', width: '100%', height: '100%'}} 
            onPress={() => setModalVisible(false)} 
          />
          <View style={MyStyleSheet.billingModalBox}>
            <Text style={MyStyleSheet.billingModalTitle}>
              INVOICE DETAILS -{"\n"}{selectedInvoice?.num}
            </Text>

            <View style={MyStyleSheet.invoiceDetailsRow}>
              <View>
                <Text style={MyStyleSheet.invoiceLabel}>Pet Name</Text>
                <Text style={MyStyleSheet.invoiceValue}>{selectedInvoice?.pet}</Text>
              </View>
              <View>
                <Text style={MyStyleSheet.invoiceLabel}>Service</Text>
                <Text style={MyStyleSheet.invoiceValue}>{selectedInvoice?.service}</Text>
              </View>
              <View>
                <Text style={MyStyleSheet.invoiceLabel}>Invoice Date</Text>
                <Text style={MyStyleSheet.invoiceValue}>{selectedInvoice?.date}</Text>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={[MyStyleSheet.invoiceLabel, {fontWeight: 'bold', color: '#000'}]}>Items</Text>
              
              <View style={MyStyleSheet.billingItemRow}>
                <View>
                  <Text style={MyStyleSheet.billingItemName}>Grooming</Text>
                  <Text style={MyStyleSheet.billingItemQty}>Quantity: 1</Text>
                </View>
                <Text style={MyStyleSheet.billingItemPrice}>₱ 250.00</Text>
              </View>

              <View style={MyStyleSheet.billingItemRow}>
                <View>
                  <Text style={MyStyleSheet.billingItemName}>Dental Cleaning</Text>
                  <Text style={MyStyleSheet.billingItemQty}>Quantity: 1</Text>
                </View>
                <Text style={MyStyleSheet.billingItemPrice}>₱ 750.00</Text>
              </View>
            </View>

            <View style={MyStyleSheet.invoiceDivider} />

            <View style={MyStyleSheet.billingTotalRow}>
              <Text style={MyStyleSheet.billingTotalLabel}>Total Amount</Text>
              <Text style={MyStyleSheet.billingTotalValue}>₱ {selectedInvoice?.price}.00</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={MyStyleSheet.bottomNav}>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('pet')}>
          <Image source={require('../public/Pets.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Appt</Text>
        </TouchableOpacity>
        <View style={MyStyleSheet.navItemContainer}>
           <TouchableOpacity style={MyStyleSheet.navItemActive}>
              <Image source={require('../public/Bill.svg')} style={{ width: 22, height: 22 }} />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}