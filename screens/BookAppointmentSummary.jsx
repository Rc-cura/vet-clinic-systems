import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function BookAppointmentSummary() {
  const opx = useNavigation();
  const route = useRoute();
  
  // Data passed from previous screens
  const { selectedDate, formattedTime, vet, petName, service } = route.params || {};

  const [policyModal, setPolicyModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [note, setNote] = useState('');

  const handleSendRequest = () => {
    setPolicyModal(true);
  };

  const confirmRequest = () => {
    setPolicyModal(false);
    setTimeout(() => {
      setSuccessModal(true);
    }, 500);
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        
        <Text style={MyStyleSheet.summaryTitle}>Summary</Text>

        {/* Progress Bar (100%) */}
        <View style={[MyStyleSheet.progressBarFull, { marginTop: 20, marginBottom: 20 }]} />

        {/* PET CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderCircle, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image 
                source={require('../public/blackpaw.svg')} 
                style={{ width: 35, height: 35 }} 
                resizeMode="contain" 
            />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>{petName || 'Pet Name'}</Text>
            <Text style={MyStyleSheet.cardSubText}>Species - Breed - Gender</Text>
          </View>
        </View>

        {/* SERVICE CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image 
                source={require('../public/medical_icon.svg')} 
                style={{ width: 24, height: 24 }} 
             />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Service</Text>
            <Text style={MyStyleSheet.cardSubText}>{service || 'Type of Service'}</Text>
          </View>
        </View>

        {/* VET CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image 
                source={require('../public/vet.svg')} 
                style={{ width: 24, height: 24 }} 
                resizeMode="contain" 
             />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text>
            <Text style={MyStyleSheet.cardSubText}>{vet || 'Assigned Vet'}</Text>
          </View>
        </View>

        {/* DATE & TIME CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image 
                source={require('../public/Calendar.svg')} 
                style={{ width: 24, height: 24 }} 
             />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Date & Time</Text>
            <Text style={MyStyleSheet.cardSubText}>{selectedDate || 'Date'} | {formattedTime || 'Time'}</Text>
          </View>
        </View>

        {/* NOTE SECTION */}
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
          style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]} 
          onPress={handleSendRequest}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Send Request</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
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

      <Modal visible={successModal} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.successBox}>
            <Text style={MyStyleSheet.successBodyText}>Successfully submitted an appointment.</Text>
            <TouchableOpacity 
              style={MyStyleSheet.successActionBtn} 
              onPress={() => {
                setSuccessModal(false);
                opx.navigate('appointment'); 
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