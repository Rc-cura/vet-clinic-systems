import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';
import { Appointments } from '../App';

export default function BookAppointmentSummary() {
  const opx = useNavigation();
  const route = useRoute();
  
  // Destructuring all params including the ones from the Remarks page
  const {  
    appointmentId, selectedDate, formattedTime, vet, 
    petName, petImage, petDetails, petWeight, service,
    reason, notes 
  } = route.params || {};

  const [policyModal, setPolicyModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const confirmRequest = () => {
    const appointmentData = {
      id: appointmentId || Math.random().toString(),
      date: selectedDate,
      time: formattedTime,
      service: service,
      pet: petName,
      petImage: petImage,
      petDetails: petDetails,
      petWeight: petWeight, 
      status: 'Pending Confirmation',
      type: 'Upcoming',
      requestedDate: new Date().toLocaleDateString(),
      vet: vet,
      reason: reason,
      notes: notes
    };

    if (appointmentId) {
      const index = Appointments.findIndex(item => item.id === appointmentId);
      if (index !== -1) Appointments[index] = appointmentData;
    } else {
      Appointments.push(appointmentData);
    }

    setPolicyModal(false);
    setTimeout(() => { setSuccessModal(true); }, 500);
  };

  // Helper component for the summary rows
  const SummaryRow = ({ label, value }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
      <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: '600' }}>{label}</Text>
      <Text style={{ fontSize: 16, color: '#AAA', flex: 1, textAlign: 'right', marginLeft: 20 }}>{value || 'None'}</Text>
    </View>
  );

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <Text style={[MyStyleSheet.profileMenuTitle, { fontSize: 24, marginBottom: 25 }]}>Summary</Text>

          {/* Core Info Rows */}
          <SummaryRow label="Service" value={service} />
          <SummaryRow label="Pet" value={petName} />
          <SummaryRow label="Veterinarian" value={vet} />
          <SummaryRow label="Date & Time" value={`${selectedDate}, ${formattedTime}`} />

          {/* Long Text Sections */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: 'bold', marginBottom: 10 }}>Reason for Consultation</Text>
            <Text style={{ fontSize: 14, color: '#AAA', lineHeight: 20, marginBottom: 25 }}>
               {reason || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </Text>

            <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: 'bold', marginBottom: 10 }}>Notes</Text>
            <Text style={{ fontSize: 14, color: '#AAA', lineHeight: 20 }}>
               {notes || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </Text>
          </View>

        </ScrollView>
      </View>

      {/* FOOTER BUTTONS */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' }}>
        <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { marginBottom: 15 }]} 
            onPress={() => setPolicyModal(true)}
        >
          <Text style={MyStyleSheet.primaryActionBtnText}>Confirm Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => opx.navigate('appointment')} style={{ alignSelf: 'center' }}>
          <Text style={{ color: '#2E3A91', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* MODALS REMAINT THE SAME */}
      <Modal visible={policyModal} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Cancellation Policy</Text>
            <Text style={MyStyleSheet.modalBodyText}>Cancellations are only permitted up to one day before your appointment.</Text>
            <TouchableOpacity style={MyStyleSheet.modalCancelBtn} onPress={() => setPolicyModal(false)}>
              <Text style={{ color: '#333' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.modalUnderstandBtn} onPress={confirmRequest}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={successModal} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successBox}>
            <Text style={MyStyleSheet.successBodyText}>Successfully submitted an appointment.</Text>
            <TouchableOpacity style={MyStyleSheet.successActionBtn} onPress={() => { setSuccessModal(false); opx.navigate('appointment'); }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}