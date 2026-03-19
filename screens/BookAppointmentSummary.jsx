import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';
import { Appointments } from '../App';

export default function BookAppointmentSummary() {

  const opx = useNavigation();

  const route = useRoute();
  
  const {  appointmentId, selectedDate, formattedTime, vet, petName, petImage, petDetails, petWeight,  service } = route.params || {};

  const [policyModal, setPolicyModal] = useState(false);

  const [successModal, setSuccessModal] = useState(false);

  const [note, setNote] = useState('');

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

      note: note

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

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>

        <Text style={MyStyleSheet.summaryTitle}>Summary</Text>

        <View style={[MyStyleSheet.progressBarFull, { marginTop: 20, marginBottom: 20 }]} />



        <View style={MyStyleSheet.summaryCard}>

          <View style={[MyStyleSheet.iconPlaceholderCircle, { justifyContent: 'center', alignItems: 'center' }]}>

            <Image source={petImage ? { uri: petImage } : require('../public/blackpaw.svg')} style={{ width: 35, height: 35, borderRadius: 17 }} resizeMode="contain" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

               <Text style={MyStyleSheet.cardTitleText}>{petName || 'Pet Name'}</Text>

               <Text style={{ color: '#AAA', fontSize: 13 }}>{petWeight ? `${petWeight} kg` : ''}</Text>

            </View>

            <Text style={MyStyleSheet.cardSubText}>{petDetails || 'Species - Breed - Gender'}</Text>

          </View>
        </View>


        <View style={MyStyleSheet.summaryCard}>

          <View style={MyStyleSheet.iconPlaceholderSquare}><Image source={require('../public/medical_icon.svg')} style={{ width: 24, height: 24 }} /></View>

          <View><Text style={MyStyleSheet.cardTitleText}>Service</Text><Text style={MyStyleSheet.cardSubText}>{service}</Text></View>
        </View>


        <View style={MyStyleSheet.summaryCard}>

          <View style={MyStyleSheet.iconPlaceholderSquare}><Image source={require('../public/vet.svg')} style={{ width: 24, height: 24 }} /></View>
          <View><Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text><Text style={MyStyleSheet.cardSubText}>{vet}</Text></View>
        </View>

        <View style={MyStyleSheet.summaryCard}>

          <View style={MyStyleSheet.iconPlaceholderSquare}><Image source={require('../public/Calendar.svg')} style={{ width: 24, height: 24 }} /></View>
          <View><Text style={MyStyleSheet.cardTitleText}>Date & Time</Text><Text style={MyStyleSheet.cardSubText}>{selectedDate} | {formattedTime}</Text></View>
        </View>


        <Text style={MyStyleSheet.noteLabel}>Add Note</Text>

        <TextInput style={MyStyleSheet.noteInput} placeholder="Suggested" multiline value={note} onChangeText={setNote} />


        <TouchableOpacity style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]} onPress={() => setPolicyModal(true)}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>{appointmentId ? "Confirm Reschedule" : "Send Request"}</Text>
        </TouchableOpacity>
      </ScrollView>

 
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