import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function BookAppointmentSummary() {
  const opx = useNavigation();
  const route = useRoute();
  
  // Data galing sa nakaraang screens
  const { selectedDate, formattedTime, vet, petName, service } = route.params || {};

  const [policyModal, setPolicyModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [note, setNote] = useState('');

  const handleSendRequest = () => {
    setPolicyModal(true);
  };

  const confirmRequest = () => {
    setPolicyModal(false);
    // Dito pwede ilagay ang API call o database saving
    setTimeout(() => {
      setSuccessModal(true);
    }, 500);
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Book an Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }}>
        <Text style={MyStyleSheet.summaryTitle}>Summary</Text>

        {/* Progress Bar (image_59b080.png - 100%) */}
        <View style={MyStyleSheet.progressBarFull} />

        {/* SUMMARY CARDS */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderCircle} />
          <View>
            <Text style={MyStyleSheet.cardTitleText}>{petName || 'Pet Name'}</Text>
            <Text style={MyStyleSheet.cardSubText}>Species - Breed - Gender</Text>
          </View>
        </View>

        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderSquare} />
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Service</Text>
            <Text style={MyStyleSheet.cardSubText}>{service || 'Type of Service'}</Text>
          </View>
        </View>

        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderSquare} />
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text>
            <Text style={MyStyleSheet.cardSubText}>{vet || 'Assigned Vet'}</Text>
          </View>
        </View>

        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderSquare} />
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Date & Time</Text>
            <Text style={MyStyleSheet.cardSubText}>{selectedDate} | {formattedTime}</Text>
          </View>
        </View>

        {/* ADD NOTE SECTION */}
        <Text style={MyStyleSheet.noteLabel}>Add Note</Text>
        <TextInput
          style={MyStyleSheet.noteInput}
          placeholder="Suggested"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity 
          style={MyStyleSheet.primaryBlueBtn} 
          onPress={handleSendRequest}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Send Request</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL 1: CANCELLATION POLICY */}
      <Modal visible={policyModal} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Cancellation Policy</Text>
            <Text style={MyStyleSheet.modalBodyText}>
              Cancellations are only permitted up to one day before your scheduled appointment.
            </Text>
            
            <TouchableOpacity style={MyStyleSheet.modalCancelBtn} onPress={() => setPolicyModal(false)}>
              <Text style={{ color: '#333' }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={MyStyleSheet.modalUnderstandBtn} onPress={confirmRequest}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: SUCCESS MESSAGE */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successBox}>
            <Text style={MyStyleSheet.successBodyText}>Successfully submitted an appointment.</Text>
            <TouchableOpacity 
              style={MyStyleSheet.successActionBtn} 
              onPress={() => {
                setSuccessModal(false);
                opx.navigate('appointment'); // Balik sa Home pagkatapos
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}