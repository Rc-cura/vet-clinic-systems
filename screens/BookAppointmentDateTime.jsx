import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Dropdown } from 'react-native-element-dropdown'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function BookAppointmentDateTime() {
  const opx = useNavigation();
  const route = useRoute();
  
  const { appointmentId, petName, petImage, petDetails, petWeight, service } = route.params || {};

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null); 


  const today = new Date().toISOString().split('T')[0];

  const vetData = [
    { label: 'Dr. Smith', value: 'Dr. Smith' },
    { label: 'Dr. Garcia', value: 'Dr. Garcia' },
    { label: 'Dr. Santos', value: 'Dr. Santos' },
  ];

  const generateTimeSlots = () => {
    const slots = [];
    let start = 7.5; 
    let end = 17;    
    for (let time = start; time <= end; time += 0.5) {

      let hour = Math.floor(time);

      let minutes = (time % 1 === 0) ? '00' : '30';

      let ampm = hour >= 12 ? 'PM' : 'AM';

      let displayHour = hour > 12 ? hour - 12 : hour;

      if (displayHour === 0) displayHour = 12;

      const timeString = `${displayHour}:${minutes} ${ampm}`;

      slots.push({ label: timeString, value: timeString });
    }
    return slots;
  };

  const timeData = generateTimeSlots();

  return (
    <SafeAreaView style={MyStyleSheet.container}>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        
        <Text style={[MyStyleSheet.selectPetLabel, { textAlign: 'center' }]}>Select Veterinarian</Text>

        
        <View style={[MyStyleSheet.progressBarBg, { alignSelf: 'center', marginTop: 20, marginBottom: 20 }]}>

           <View style={{ width: '75%', backgroundColor: '#5C93E8', height: '100%', borderRadius: 2 }} />

        </View>

        <View style={{ marginBottom: 20 }}>

          <Text style={{ fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' }}>Attending Vet</Text>

          <Dropdown style={MyStyleSheet.dropdown}  placeholderStyle={MyStyleSheet.placeholderStyle} selectedTextStyle={MyStyleSheet.selectedTextStyle} data={vetData}
            maxHeight={300} labelField="label" valueField="value" placeholder="Select a veterinarian"value={selectedVet}onChange={item => setSelectedVet(item.value)}/>
        </View>
        

        <Text style={[MyStyleSheet.selectPetLabel, { marginBottom: 15, textAlign: 'center' }]}>Select Date & Time</Text>
        <View style={MyStyleSheet.calendarCard}>

          <Calendar minDate={today} onDayPress={day => setSelectedDate(day.dateString)} markedDates={{[selectedDate]: { selected: true, selectedColor: '#5C93E8' }}}
            theme={{todayTextColor: '#5C93E8', selectedDayBackgroundColor: '#5C93E8', textDayHeaderFontWeight: 'bold', textDisabledColor: '#d9e1e8'
            }}
          />

          <View style={{ marginTop: 20, paddingHorizontal: 10 }}>

            <Text style={{ fontSize: 14, marginBottom: 10, fontWeight: '600' }}>Select Time Slot</Text>

            <Dropdown style={MyStyleSheet.dropdown} placeholderStyle={MyStyleSheet.placeholderStyle} selectedTextStyle={MyStyleSheet.selectedTextStyle}  data={timeData} 
              maxHeight={200} labelField="label" valueField="value" placeholder="Select time" value={selectedTime}
              onChange={item => setSelectedTime(item.value)} />
          </View>

        </View>

        <TouchableOpacity style={[ MyStyleSheet.primaryBlueBtn, { marginTop: 30, opacity: (selectedDate && selectedTime && selectedVet) ? 1 : 0.6 }]}
          disabled={!(selectedDate && selectedTime && selectedVet)} onPress={() => opx.navigate('summary', { 
            appointmentId, petName, petImage, petDetails, petWeight, service,  selectedDate, formattedTime: selectedTime, vet: selectedVet})}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Continue</Text>

        </TouchableOpacity>

      </ScrollView>
      
    </SafeAreaView>
  );
}