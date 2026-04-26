import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert, Platform, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../context/supabase';
import MyStyleSheet from '../styles/MyStyleSheet'; // Adjust path if needed

export default function SelectDatePage() {
  const navigation = useNavigation();
  const route = useRoute();

  // 1. Get data passed from previous screens
  const { petId, petName, petInfo, serviceType } = route.params || {};

  // --- Constants & Helper Functions (Direct from your web code) ---
  const CLINIC_OPEN_MINUTES = 9 * 60;
  const CLINIC_CLOSE_MINUTES = 17 * 60;
  const SLOT_STEP_MINUTES = 15;

  const getInitialBookingDate = () => {
    const today = new Date();
    if (today.getDay() === 0) { // If Sunday, move to Monday
      today.setDate(today.getDate() + 1);
    }
    return today;
  };

  const isSunday = (targetDate) => targetDate.getDay() === 0;
  const getDayName = (targetDate) => targetDate.toLocaleDateString('en-US', { weekday: 'long' });

  const toHHMM = (timeValue) => {
    if (!timeValue || typeof timeValue !== 'string') return '';
    return timeValue.slice(0, 5);
  };

  const hhmmToMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) return null;
    const [h, m] = hhmm.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return (h * 60) + m;
  };

  const minutesToHHMM = (totalMinutes) => {
    const safeMinutes = Math.max(0, Number(totalMinutes) || 0);
    const h = Math.floor(safeMinutes / 60);
    const m = safeMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const toDisplayTime = (hhmm) => {
    const minutes = hhmmToMinutes(hhmm);
    if (minutes === null) return hhmm;
    const hour24 = Math.floor(minutes / 60);
    const min = minutes % 60;
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:${String(min).padStart(2, '0')} ${suffix}`;
  };

  const normalizeServiceName = (value) => {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (raw.includes('vaccine') || raw.includes('vaccination')) return 'vaccination';
    if (raw.includes('consult')) return 'consultation';
    if (raw.includes('groom')) return 'grooming';
    if (raw.includes('surgery') || raw.includes('surgical')) return 'surgery';
    return raw;
  };

  const parseDurationMinutes = (durationValue) => {
    if (durationValue === null || durationValue === undefined) return null;
    if (typeof durationValue === 'number' && durationValue > 0) return durationValue;
    const match = String(durationValue).match(/\d+/);
    if (!match) return null;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  // --- State ---
  const [date, setDate] = useState(getInitialBookingDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSelectedVetOffDay, setIsSelectedVetOffDay] = useState(false);
  const [services, setServices] = useState([]);

  // Vet State
  const [vets, setVets] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [vetDropdownData, setVetDropdownData] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchVets() {
      const { data, error } = await supabase
        .from('veterinarians')
        .select('id, user_id, full_name, specialization, profile_id')
        .order('full_name');

      if (data) {
        const vetRows = data || [];
        const userIds = vetRows.map(vet => vet.user_id).filter(Boolean);
        let scheduleMap = {};

        if (userIds.length > 0) {
          const { data: profileRows } = await supabase
            .from('profiles')
            .select('id, schedule')
            .in('id', userIds);

          if (profileRows) {
            scheduleMap = profileRows.reduce((acc, profile) => {
              acc[profile.id] = profile.schedule || null;
              return acc;
            }, {});
          }
        }

        const vetsWithSchedule = vetRows.map(vet => ({
          ...vet,
          schedule: scheduleMap[vet.user_id] || null,
        }));

        setVets(vetsWithSchedule);
        setVetDropdownData(vetsWithSchedule.map(v => ({ label: v.full_name, value: v.user_id })));
      }
    }
    fetchVets();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('id, service_name, category, duration, duration_minutes, is_active')
        .eq('is_active', true);
      if (!error) setServices(data || []);
    }
    fetchServices();
  }, []);

  // --- Logic Computations ---
  const getServiceDurationMinutes = (serviceLabel) => {
    const target = normalizeServiceName(serviceLabel);
    const matchedService = services.find((service) => {
      const name = normalizeServiceName(service.service_name);
      const category = normalizeServiceName(service.category);
      return name === target || category === target;
    });

    const fromDbMinutes = matchedService
      ? (parseDurationMinutes(matchedService.duration) ?? parseDurationMinutes(matchedService.duration_minutes))
      : null;

    if (fromDbMinutes) return fromDbMinutes;

    const fallbackMinutes = { consultation: 30, vaccination: 30, grooming: 45, surgery: 50 };
    return fallbackMinutes[target] || 30;
  };

  const selectedServiceDuration = useMemo(
    () => getServiceDurationMinutes(serviceType),
    [serviceType, services]
  );

  const generateTimeSlots = (durationMinutes) => {
    const slots = [];
    for (let startMin = CLINIC_OPEN_MINUTES; startMin + durationMinutes <= CLINIC_CLOSE_MINUTES; startMin += SLOT_STEP_MINUTES) {
      slots.push(minutesToHHMM(startMin));
    }
    return slots;
  };

  const allSlots = useMemo(() => generateTimeSlots(selectedServiceDuration), [selectedServiceDuration]);

  const getScheduleDays = (schedule) => {
    if (!schedule || typeof schedule !== 'object' || !Array.isArray(schedule.days)) return null;
    return schedule.days.filter(day => typeof day === 'string').map(day => day.trim().toLowerCase());
  };

  const isVetAvailableOnDate = (vet, targetDate) => {
    const scheduleDays = getScheduleDays(vet?.schedule);
    if (!scheduleDays) return true;
    return scheduleDays.includes(getDayName(targetDate).toLowerCase());
  };

  // Check Availability
  useEffect(() => {
    async function fetchAvailability() {
      if (!date) return;
      setLoadingSlots(true);
      setSelectedTime(null);
      setIsSelectedVetOffDay(false);

      if (!selectedVet) {
        setBookedSlots(allSlots);
        setLoadingSlots(false);
        return;
      }

      const offset = date.getTimezoneOffset();
      const formattedDate = new Date(date.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

      let query = supabase
        .from('appointments')
        .select('appointment_time, vet_id, service_type, status')
        .eq('appointment_date', formattedDate)
        .neq('status', 'Cancelled');

      const vetMatch = vets.find(v => v.user_id === selectedVet);
      if (vetMatch && vetMatch.user_id) {
        if (!isVetAvailableOnDate(vetMatch, date)) {
          setBookedSlots(allSlots);
          setIsSelectedVetOffDay(true);
          setLoadingSlots(false);
          return;
        }
        query = query.eq('vet_id', vetMatch.user_id);
      }

      const { data } = await query;
      const activeAppointments = (data || []).filter((app) => (app.status || '').toLowerCase() !== 'cancelled');

      const doesSlotOverlap = (slot, appointmentsForVet) => {
        const slotStart = hhmmToMinutes(slot);
        if (slotStart === null) return false;
        const slotEnd = slotStart + selectedServiceDuration;

        return appointmentsForVet.some((app) => {
          const appointmentStart = hhmmToMinutes(toHHMM(app.appointment_time));
          if (appointmentStart === null) return false;
          const appointmentDuration = getServiceDurationMinutes(app.service_type);
          const appointmentEnd = appointmentStart + appointmentDuration;
          return slotStart < appointmentEnd && slotEnd > appointmentStart;
        });
      };

      if (activeAppointments.length > 0) {
        const taken = allSlots.filter(slot => doesSlotOverlap(slot, activeAppointments));
        setBookedSlots(taken);
      } else {
        setBookedSlots([]);
      }
      setLoadingSlots(false);
    }
    fetchAvailability();
  }, [date, selectedVet, vets, allSlots, selectedServiceDuration, supabase]);

  // --- Handlers ---
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    
    if (isSunday(currentDate)) {
      Alert.alert("Closed", "Sorry, the clinic is closed on Sundays.");
      return;
    }
    setDate(currentDate);
  };

  const handleContinue = () => {
    if (!selectedVet || !date || !selectedTime) return;

    const offset = date.getTimezoneOffset();
    const formattedDate = new Date(date.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
    const vetObject = vets.find(v => v.user_id === selectedVet) || null;

    // Navigate to Summary passing all the data
    navigation.navigate('summary', { // Ensure you have a 'summary' screen registered in App.js
      petId,
      petName,
      petInfo,
      serviceType,
      date: formattedDate,
      time: selectedTime,
      vetId: vetObject ? vetObject.user_id : '',
      vetName: vetObject ? vetObject.full_name : '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Progress Bar (Visual Only) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 5 }}>Step 3 of 4</Text>
          <View style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 }}>
            <View style={{ height: '100%', width: '75%', backgroundColor: '#2E3A91', borderRadius: 3 }} />
          </View>
        </View>

        {/* Vet Selection */}
        <Text style={styles.sectionLabel}>ATTENDING VET</Text>
        <Dropdown
          style={styles.dropdown}
          data={vetDropdownData}
          labelField="label"
          valueField="value"
          placeholder="Select Veterinarian (Required)"
          value={selectedVet}
          onChange={item => setSelectedVet(item.value)}
        />
        
        {selectedVet && vets.find(v => v.user_id === selectedVet) && (
          <Text style={styles.vetSubText}>
            Specialization: {vets.find(v => v.user_id === selectedVet)?.specialization}
          </Text>
        )}

        {/* Date Selection */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SELECT DATE</Text>
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Time Slots */}
        <Text style={[styles.sectionLabel, { marginTop: 25 }]}>AVAILABLE TIME SLOTS</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Service Duration: {selectedServiceDuration} mins</Text>
          <Text style={styles.infoBoxSub}>Clinic Schedule: 9:00 AM to 5:00 PM</Text>
        </View>

        {isSelectedVetOffDay && selectedVet && (
          <Text style={styles.errorText}>This veterinarian is not available on {getDayName(date)}.</Text>
        )}

        {loadingSlots ? (
          <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.slotsGrid}>
            {allSlots.map((slot) => {
              const isTaken = bookedSlots.includes(slot);
              const isSelected = selectedTime === slot;
              
              const slotStart = hhmmToMinutes(slot);
              const slotEnd = slotStart === null ? null : slotStart + selectedServiceDuration;
              const slotRange = slotEnd === null ? toDisplayTime(slot) : `${toDisplayTime(slot)} - ${toDisplayTime(minutesToHHMM(slotEnd))}`;

              return (
                <TouchableOpacity
                  key={slot}
                  disabled={isTaken}
                  onPress={() => setSelectedTime(slot)}
                  style={[
                    styles.slotBtn,
                    isTaken && styles.slotBtnTaken,
                    isSelected && styles.slotBtnSelected
                  ]}
                >
                  <Text style={[styles.slotText, isTaken && styles.slotTextTaken, isSelected && styles.slotTextSelected]}>
                    {toDisplayTime(slot)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueBtn, (!selectedVet || !date || !selectedTime || isSunday(date)) && styles.continueBtnDisabled]}
          disabled={!selectedVet || !date || !selectedTime || isSunday(date)}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Continue to Summary</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 5 },
  backBtnText: { fontSize: 28, color: '#2E3A91' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#2E3A91' },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginBottom: 10, letterSpacing: 1 },
  
  dropdown: { height: 55, backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  vetSubText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 8, paddingHorizontal: 5 },
  
  datePickerBtn: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  datePickerText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  
  infoBox: { backgroundColor: '#EFF6FF', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' },
  infoBoxTitle: { fontSize: 14, fontWeight: 'bold', color: '#1D4ED8' },
  infoBoxSub: { fontSize: 12, color: '#64748B', marginTop: 4 },
  
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotBtn: { width: '48%', backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginBottom: 10 },
  slotBtnTaken: { backgroundColor: '#F1F5F9', borderColor: 'transparent', opacity: 0.5 },
  slotBtnSelected: { backgroundColor: '#2E3A91', borderColor: '#2E3A91' },
  slotText: { fontSize: 14, fontWeight: 'bold', color: '#334155' },
  slotTextTaken: { color: '#94A3B8' },
  slotTextSelected: { color: '#FFF' },
  errorText: { color: '#D97706', fontSize: 13, fontWeight: 'bold', marginBottom: 15 },
  
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  continueBtn: { backgroundColor: '#2E3A91', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});