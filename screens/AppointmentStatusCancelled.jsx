import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function AppointmentStatusCancelled() {
  const navigation = useNavigation();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleConfirmCancellation = () => {
    setCancelModalVisible(false);
    setSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Manual Header removed. Using system header from App.js now. */}

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        
        {/* Main Status Card */}
        <View style={MyStyleSheet.detailsMainCard}>
          <Text style={MyStyleSheet.detailsDateText}>Thursday, 05 February</Text>
          <Text style={MyStyleSheet.detailsTimeText}>9:00 AM</Text>
          
          {/* Light Red badge for Cancelled status */}
          <View style={[MyStyleSheet.detailsStatusBadge, { backgroundColor: '#FFBDBD', width: '100%' }]}>
            <Text style={[MyStyleSheet.detailsStatusText, { color: '#000', alignSelf: "center" }]}>Cancelled Appointment</Text>
          </View>
          
          <Text style={MyStyleSheet.requestedDateLabel}>
            Appointment Requested on 01-29-2025 9:00 a.m.
          </Text>
        </View>

        {/* Pet Info */}
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

        {/* Service Info */}
        <View style={MyStyleSheet.summaryCard}>
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image source={require('../public/medical_icon.svg')} style={{ width: 24, height: 24 }} />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Service</Text>
            <Text style={MyStyleSheet.cardSubText}>Type of Service</Text>
          </View>
        </View>

        {/* Vet Info */}
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

        {/* Action Button */}
        <TouchableOpacity style={MyStyleSheet.primaryBlueBtn} onPress={() => navigation.navigate('selectpet')}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Book an Appointment</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.policyBox}>
            <Text style={MyStyleSheet.modalTitleLarge}>Appointment Cancelled</Text>
            <Text style={MyStyleSheet.modalBodyText}>
              Your appointment has been successfully cancelled.
            </Text>
            <TouchableOpacity 
                style={MyStyleSheet.modalUnderstandBtn} 
                onPress={() => {
                    setSuccessModalVisible(false);
                    navigation.navigate('AppointmentPage'); 
                }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}