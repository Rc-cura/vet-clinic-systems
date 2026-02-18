import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';
import { Appointments } from '../App'; 

export default function AppointmentStatusPending() {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { appointment } = route.params || {};

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    return `${weekday}, ${day} ${month}`;
  };

  const handleConfirmCancellation = () => {
    const index = Appointments.findIndex(item => item.id === appointment?.id);
    if (index !== -1) {
      Appointments[index].status = 'Cancelled';
      Appointments[index].type = 'Past'; 
    }
    setCancelModalVisible(false);
    setTimeout(() => { setSuccessModalVisible(true); }, 500);
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        
        {/* HEADER */}
        <View style={MyStyleSheet.detailsMainCard}>
          <Text style={MyStyleSheet.detailsDateText}>{formatDisplayDate(appointment?.date)}</Text>
          <Text style={MyStyleSheet.detailsTimeText}>{appointment?.time || "Time TBA"}</Text>
          <View style={[MyStyleSheet.detailsStatusBadge, { backgroundColor: '#FFE8D1', width: 300 }]}>
            <Text style={[MyStyleSheet.detailsStatusText, { color: '#000', alignSelf:"center" }]}>{appointment?.status}</Text>
          </View>
          <Text style={MyStyleSheet.requestedDateLabel}>Requested on {appointment?.requestedDate}</Text>
        </View>

        {/* 1. PET CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderCircle}>
             <Image source={appointment?.petImage ? { uri: appointment.petImage } : require('../public/blackpaw.svg')} style={{ width: 35, height: 35, borderRadius: 17.5 }} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={MyStyleSheet.cardTitleText}>{appointment?.pet}</Text>
              <Text style={{ color: '#AAA', fontSize: 13 }}>{appointment?.petWeight} kg</Text>
            </View>
            <Text style={MyStyleSheet.cardSubText}>{appointment?.petDetails}</Text>
          </View>
        </View>

        {/* 2. SERVICE CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderSquare}><Image source={require('../public/medical_icon.svg')} style={{ width: 24, height: 24 }} /></View>
          <View><Text style={MyStyleSheet.cardTitleText}>Service</Text><Text style={MyStyleSheet.cardSubText}>{appointment?.service}</Text></View>
        </View>

        {/* 3. VET CARD */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderSquare}><Image source={require('../public/vet.svg')} style={{ width: 24, height: 24 }} /></View>
          <View><Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text><Text style={MyStyleSheet.cardSubText}>{appointment?.vet}</Text></View>
        </View>

        {/* 4. NOTE SECTION */}
        <Text style={MyStyleSheet.noteLabel}>Note</Text>
        <View style={MyStyleSheet.noteDisplayBox}>
          <Text style={MyStyleSheet.noteTextSmall}>{appointment?.note || "No additional notes provided."}</Text>
        </View>

        {/* ACTIONS */}
        <TouchableOpacity style={[MyStyleSheet.primaryBlueBtn, { marginTop: 20 }]}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Add to Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={MyStyleSheet.outlineBtn}
          onPress={() => navigation.navigate('datetime', {
            appointmentId: appointment?.id,
            petName: appointment?.pet,
            petImage: appointment?.petImage,
            petDetails: appointment?.petDetails,
            petWeight: appointment?.petWeight,
            service: appointment?.service,
            vet: appointment?.vet 
          })}
        >
          <Text style={MyStyleSheet.outlineBtnText}>Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[MyStyleSheet.secondaryBlueBtn, {borderRadius: 10}]} onPress={() => setCancelModalVisible(true)}>
          <Text style={MyStyleSheet.secondaryBlueBtnText}>Cancel Appointment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CANCEL MODAL */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Cancel Appointment?</Text>
            <Text style={MyStyleSheet.modalBodyText}>Cancellations must be made at least one day before.</Text>
            <TouchableOpacity style={MyStyleSheet.modalCancelBtn} onPress={() => setCancelModalVisible(false)}>
              <Text>Keep Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.modalUnderstandBtn} onPress={handleConfirmCancellation}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Confirm Cancellation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Appointment Cancelled</Text>
            <TouchableOpacity style={MyStyleSheet.modalUnderstandBtn} onPress={() => { setSuccessModalVisible(false); navigation.navigate('appointment'); }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}