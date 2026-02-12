import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Dropdown } from 'react-native-element-dropdown'; 
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function AppointmentDateTime() {
  const opx = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null); // State para sa Vet

  // Listahan ng mga Veterinarian (Base sa image_59acdc.png)
  const vetData = [
    { label: 'Dr. Smith', value: 'dr_smith' },
    { label: 'Dr. Garcia', value: 'dr_garcia' },
    { label: 'Dr. Santos', value: 'dr_santos' },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    let start = 7.5; // 7:30 AM
    let end = 17;    // 5:00 PM
    for (let time = start; time <= end; time += 0.5) {
      let hour = Math.floor(time);
      let minutes = (time % 1 === 0) ? '00' : '30';
      let ampm = hour >= 12 ? 'PM' : 'AM';
      let displayHour = hour > 12 ? hour - 12 : hour;
      const timeString = `${displayHour}:${minutes} ${ampm}`;
      slots.push({ label: timeString, value: timeString });
    }
    return slots;
  };

  const timeData = generateTimeSlots();

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Book an Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40 }}>
        
        {/* PROGRESS BAR SECTION (Optional, base sa photo) */}
        <View style={{ height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginVertical: 20, flexDirection: 'row' }}>
           <View style={{ width: '75%', backgroundColor: '#5C93E8', height: '100%', borderRadius: 2 }} />
        </View>

        {/* SELECT VETERINARIAN SECTION */}
        <Text style={[MyStyleSheet.selectPetLabel, { marginBottom: 10 }]}>Select Veterinarian</Text>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' }}>Attending Vet</Text>
          <Dropdown
            style={MyStyleSheet.dropdown}
            placeholderStyle={MyStyleSheet.placeholderStyle}
            selectedTextStyle={MyStyleSheet.selectedTextStyle}
            data={vetData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a veterinarian"
            value={selectedVet}
            onChange={item => setSelectedVet(item.value)}
          />
        </View>

        {/* SELECT DATE & TIME SECTION */}
        <Text style={[MyStyleSheet.selectPetLabel, { marginBottom: 10 }]}>Select Date & Time</Text>
        <View style={MyStyleSheet.calendarCard}>
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#5C93E8' }
            }}
            theme={{
              todayTextColor: '#5C93E8',
              selectedDayBackgroundColor: '#5C93E8',
              textDayHeaderFontWeight: 'bold',
            }}
          />

          <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 14, marginBottom: 10, fontWeight: '600' }}>Select Time Slot</Text>
            <Dropdown
              style={MyStyleSheet.dropdown}
              placeholderStyle={MyStyleSheet.placeholderStyle}
              selectedTextStyle={MyStyleSheet.selectedTextStyle}
              data={timeData}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Select time"
              value={selectedTime}
              onChange={item => setSelectedTime(item.value)}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[
            MyStyleSheet.primaryBlueBtn, 
            { marginTop: 30, opacity: (selectedDate && selectedTime && selectedVet) ? 1 : 0.6 }
          ]}
          disabled={!(selectedDate && selectedTime && selectedVet)}
          onPress={() => opx.navigate('summary', { 
            selectedDate, 
            formattedTime: selectedTime,
            vet: selectedVet
          })}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}