import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function AppointmentStatusApproved() {
  const navigation = useNavigation();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleConfirmCancellation = () => {
    setCancelModalVisible(false);
    setSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Custom formHeader removed. 
         System header from App.js will now be used.
      */}

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        
        {/* Main Status Card (Approved - Blue Badge) */}
        <View style={MyStyleSheet.detailsMainCard}>
          <Text style={MyStyleSheet.detailsDateText}>Thursday, 05 February</Text>
          <Text style={MyStyleSheet.detailsTimeText}>9:00 AM</Text>
          
          <View style={[MyStyleSheet.detailsStatusBadge, { backgroundColor: '#D1E3FF', width: 350 }]}>
            <Text style={[MyStyleSheet.detailsStatusText, { color: '#000', alignSelf: "center" }]}>Appointment Approved</Text>
          </View>
          
          <Text style={MyStyleSheet.requestedDateLabel}>
            Appointment Requested on 01-29-2025 9:00 a.m.
          </Text>
        </View>

        {/* Pet Info Card */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderCircle, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('../public/blackpaw.svg')} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Pet Name</Text>
            <Text style={MyStyleSheet.cardSubText}>Species - Breed - Gender</Text>
          </View>
          <Text style={{position: 'absolute', right: 15, top: 15, color: '#999', fontSize: 10}}>kg</Text>
        </View>

        {/* Service Info Card */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image source={require('../public/medical_icon.svg')} style={{ width: 24, height: 24 }} />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Service</Text>
            <Text style={MyStyleSheet.cardSubText}>Type of Service</Text>
          </View>
        </View>

        {/* Vet Info Card */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image source={require('../public/vet.svg')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text>
          </View>
        </View>

        {/* Note Section */}
        <Text style={MyStyleSheet.noteLabel}>Note</Text>
        <View style={MyStyleSheet.noteDisplayBox}>
          <Text style={MyStyleSheet.noteTextSmall}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={MyStyleSheet.primaryBlueBtn}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Add to Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.outlineBtn}>
          <Text style={MyStyleSheet.outlineBtnText}>Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={MyStyleSheet.ghostCancelBtn} 
          onPress={() => setCancelModalVisible(true)}
        >
          <Text style={MyStyleSheet.ghostCancelText}>Cancel Appointment</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modals remain the same */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Cancel Appointment?</Text>
            <Text style={MyStyleSheet.modalBodyText}>
              Just a reminder that cancellations must be made at least one day before your appointment date.
            </Text>
            <TouchableOpacity style={MyStyleSheet.modalCancelBtn} onPress={() => setCancelModalVisible(false)}>
              <Text style={{ fontWeight: '500' }}>Keep Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.modalUnderstandBtn} onPress={handleConfirmCancellation}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Confirm Cancellation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Appointment Cancelled</Text>
            <Text style={MyStyleSheet.modalBodyText}>Your appointment has been successfully cancelled.</Text>
            <TouchableOpacity 
                style={MyStyleSheet.modalUnderstandBtn} 
                onPress={() => { setSuccessModalVisible(false); navigation.navigate('cancelled'); }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}