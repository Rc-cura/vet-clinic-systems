import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function AppointmentStatusCompleted() {
  const navigation = useNavigation();
  const [downloadModal, setDownloadModal] = useState(false);

  return (
    <SafeAreaView style={MyStyleSheet.container}>


      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        

        <View style={MyStyleSheet.detailsMainCard}>

          <Text style={MyStyleSheet.detailsDateText}>Thursday, 05 February</Text>

          <Text style={MyStyleSheet.detailsTimeText}>9:00 AM</Text>
          
          <View style={[MyStyleSheet.detailsStatusBadge, { backgroundColor: '#D1FFD7', width: 350 }]}>

            <Text style={[MyStyleSheet.detailsStatusText, { color: '#000', alignSelf: "center" }]}>Appointment Completed</Text>

          </View>
          
          <Text style={MyStyleSheet.requestedDateLabel}>

            Appointment Requested on 01-29-2025 9:00 a.m.

          </Text>

        </View>


        <View style={MyStyleSheet.summaryCard}>

          <View style={[MyStyleSheet.iconPlaceholderCircle, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image source={require('../public/blackpaw.svg')} style={{ width: 35, height: 35 }} resizeMode="contain" />
          </View>


          <View>
            <Text style={MyStyleSheet.cardTitleText}>Pet Name</Text>

            <Text style={MyStyleSheet.cardSubText}>Species - Breed - Gender</Text>

          </View>
        </View>


        <View style={MyStyleSheet.summaryCard}>

          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>

             <Image source={require('../public/medical_icon.svg')} style={{ width: 24, height: 24 }} />

          </View>

          <View>

            <Text style={MyStyleSheet.cardTitleText}>Service</Text>

            <Text style={MyStyleSheet.cardSubText}>Type of Service</Text>

          </View>
        </View>


        <Text style={MyStyleSheet.noteLabel}>Note</Text>

        <View style={MyStyleSheet.noteDisplayBox}>

          <Text style={MyStyleSheet.noteTextSmall}>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

          </Text>

        </View>


        <View style={MyStyleSheet.summaryCard}>

          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>

             <Image source={require('../public/vet.svg')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Veterinarian</Text>
          </View>
        </View>


        <TouchableOpacity style={MyStyleSheet.summaryCard} onPress={() => setDownloadModal(true)} >
          <View style={[MyStyleSheet.iconPlaceholderSquare, { justifyContent: 'center', alignItems: 'center' }]}>
             <Image source={require('../public/results.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </View>
          <View>
            <Text style={MyStyleSheet.cardTitleText}>Laboratory Results</Text>
          </View>
        </TouchableOpacity>


        <Text style={MyStyleSheet.noteLabel}>Key Findings</Text>
        <TextInput style={MyStyleSheet.findingsDisplayBox} placeholder="Summary of Result..." multiline editable={false}/>

      </ScrollView>


      <Modal visible={downloadModal} transparent animationType="fade">

        <View style={MyStyleSheet.modalOverlay}>

          <View style={MyStyleSheet.policyBox}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>

                <Text style={MyStyleSheet.modalTitleLarge}>Download</Text>

                <TouchableOpacity onPress={() => setDownloadModal(false)}>

                    <Text style={{fontSize: 20, color: '#999'}}>✕</Text>

                </TouchableOpacity>

            </View>
            
            <Text style={[MyStyleSheet.modalBodyText, {marginTop: 10}]}>

              Do you want to download?
            </Text>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>

                <TouchableOpacity style={[MyStyleSheet.modalHalfBtn, {backgroundColor: '#E0E0E0'}]} onPress={() => setDownloadModal(false)} >
                    <Text style={{fontWeight: 'bold'}}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[MyStyleSheet.modalHalfBtn, {backgroundColor: '#5C93E8'}]} onPress={() => setDownloadModal(false)}>
                    <Text style={{color: '#FFF', fontWeight: 'bold'}}>Yes</Text>

                </TouchableOpacity>

            </View>

          </View>

        </View>
        
      </Modal>

    </SafeAreaView>
  );
}