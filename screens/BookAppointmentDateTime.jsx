import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function BookAppointmentDateTime() {
  const opx = useNavigation();
  const route = useRoute();
  
  const { appointmentId, petName, petImage, petDetails, petWeight, service } = route.params || {};

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('9:41 AM'); // Default like screenshot
  const [selectedVet, setSelectedVet] = useState('Dr. Leonarda Belchez'); 

  const today = new Date().toISOString().split('T')[0];

  const vets = [
    { id: '1', name: 'Dr. Leonarda Belchez', role: 'General Veterinarian', image: require('../public/bluepaw.png') },
    { id: '2', name: 'Dr. Pauline Chua', role: 'General Veterinarian', image: require('../public/bluepaw.png') },
    { id: '3', name: 'Dr. RC Cura', role: 'General Veterinarian', image: require('../public/bluepaw.png') },
  ];

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

      {/* MAIN SHADOWED CONTAINER */}
      <View style={MyStyleSheet.paymentFloatingContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          <Text style={[MyStyleSheet.profileMenuTitle, { fontSize: 20 }]}>Select Veterinarian and Date & Time</Text>
          <Text style={{ color: '#AAA', fontSize: 12, marginBottom: 20 }}>
            This appointment includes initial assessment for the requested procedure.
          </Text>

          {/* SEARCH BAR */}
          <View style={[MyStyleSheet.searchContainer, { marginBottom: 15 }]}>
            <Image 
                source={require('../public/search_icon.png')} 
                style={{ width: 16, height: 16, marginRight: 10, tintColor: '#AAA' }} 
                resizeMode="contain"
            />
            <TextInput placeholder="Search" placeholderTextColor="#AAA" style={{ flex: 1 }} />
          </View>

          {/* VET SELECTION LIST */}
          <View style={{ marginBottom: 20 }}>
            {vets.map((vet) => (
              <TouchableOpacity 
                key={vet.id}
                onPress={() => setSelectedVet(vet.name)}
                style={[
                  MyStyleSheet.paymentMethodRow,
                  { backgroundColor: '#FFF', paddingVertical: 10 },
                  selectedVet === vet.name && MyStyleSheet.paymentMethodSelected
                ]}
              >
                <Image source={vet.image} style={{ width: 45, height: 45, borderRadius: 25, marginRight: 15 }} />
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E3A91' }}>{vet.name}</Text>
                    <Text style={{ fontSize: 12, color: '#667085' }}>{vet.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 1, backgroundColor: '#EEE', marginBottom: 20 }} />

          {/* CALENDAR SECTION */}
          <Calendar 
            minDate={today} 
            onDayPress={day => setSelectedDate(day.dateString)} 
            markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#2E3A91' }
            }}
            theme={{
                calendarBackground: '#FFF',
                textSectionTitleColor: '#2E3A91',
                selectedDayBackgroundColor: '#2E3A91',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#5C93E8',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                arrowColor: '#2E3A91',
                monthTextColor: '#2E3A91',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: 'bold',
            }}
          />

          <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 20 }} />

          {/* TIME PICKER SECTION */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5 }}>
            <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: '500' }}>Time</Text>
            <TouchableOpacity style={{ backgroundColor: '#E8E8E8', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 }}>
                <Text style={{ fontSize: 16, color: '#2E3A91', fontWeight: 'bold' }}>{selectedTime}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>

      {/* FOOTER BUTTON */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFF' }}>
        <TouchableOpacity 
            style={[MyStyleSheet.primaryActionBtn, { opacity: (selectedDate && selectedVet) ? 1 : 0.6 }]}
            disabled={!(selectedDate && selectedVet)} 
            onPress={() => opx.navigate('remarks', { 
                appointmentId, petName, petImage, petDetails, petWeight, service,  
                selectedDate, formattedTime: selectedTime, vet: selectedVet
            })}
        >
          <Text style={MyStyleSheet.primaryActionBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}