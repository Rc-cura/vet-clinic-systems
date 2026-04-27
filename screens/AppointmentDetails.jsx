import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../context/supabase';

export default function AppointmentDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { appointment } = route.params || {};

  const [modalType, setModalType] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(appointment?.status || 'Pending');
  
  // 🟢 BAGONG STATE PARA SA DOCTOR'S NAME
  const [vetName, setVetName] = useState('Loading vet details...');

  // ================= FETCH VET NAME =================
  useEffect(() => {
    const fetchVetDetails = async () => {
      if (!appointment?.vet_id) {
        setVetName('No Vet Assigned');
        return;
      }
      try {
        let { data, error } = await supabase
          .from('veterinarians')
          .select('full_name')
          .eq('user_id', appointment.vet_id)
          .single();

        if (!data) {
           const fallback = await supabase
            .from('veterinarians')
            .select('full_name')
            .eq('id', appointment.vet_id)
            .single();
           data = fallback.data;
        }
        
        setVetName(data ? `Dr. ${data.full_name}` : 'Unknown Vet');
      } catch (err) {
        setVetName('Unknown Vet');
      }
    };

    if (appointment) fetchVetDetails();
  }, [appointment]);

  if (!appointment) return null;

  // ================= DATE FORMATTERS =================
  const aptDateObj = new Date(appointment.appointment_date);
  const displayFullDate = aptDateObj.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  const displayDay = aptDateObj.toLocaleDateString('en-US', { weekday: 'long' });
  
  const displayTime = (() => {
    if (!appointment.appointment_time) return 'N/A';
    const [h, m] = appointment.appointment_time.split(':');
    const hours = Number(h);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${m} ${period}`;
  })();

  const requestedDate = new Date(appointment.created_at || appointment.appointment_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  // ================= STATUS STYLING =================
  const statusLower = currentStatus.toLowerCase();
  const isCanceled = statusLower === 'cancelled' || statusLower === 'canceled';
  
  let badgeColor = '#FEF3C7'; 
  let badgeTextColor = '#D97706';
  
  if (['confirmed', 'approved', 'scheduled'].includes(statusLower)) {
    badgeColor = '#D1FAE5'; 
    badgeTextColor = '#047857';
  } else if (isCanceled) {
    badgeColor = '#E2E8F0'; 
    badgeTextColor = '#64748B';
  }

  // ================= BUTTON ACTIONS =================
  const handleCancelPress = () => {
    if (statusLower === 'pending') {
      setModalType('pending_cancel');
    } else {
      const fullAptDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time || '00:00:00'}`);
      const now = new Date();
      const diffMs = fullAptDate - now;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 0 && diffHours < 24) {
        setModalType('restricted'); 
      } else {
        setModalType('standard_cancel');
      }
    }
  };

  const executeCancellation = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', appointment.id);

      if (error) throw error;
      
      setCurrentStatus('Cancelled');
      setModalType('success');
    } catch (error) {
      alert("Error cancelling appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeReschedule = () => {
    setModalType(null);
    navigation.navigate('selectdate', {
      petId: appointment.pet_id,
      petName: appointment.pets?.pet_name,
      serviceType: appointment.service_type,
      isRescheduling: true,
      appointmentId: appointment.id
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{appointment.pets?.pet_name || 'Pet'}'s appointment</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        
        <View style={styles.dateCard}>
          <View style={styles.dateCardTop}>
            <View>
              <Text style={styles.dateText}>{displayFullDate}</Text>
              <Text style={styles.dayText}>{displayDay}</Text>
              <Text style={styles.timeText}>{displayTime}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={[styles.badgeText, { color: badgeTextColor }]}>{currentStatus}</Text>
            </View>
          </View>
          <View style={styles.dateCardBottom}>
            <Text style={styles.requestedText}>Appointment requested on {requestedDate} at {displayTime}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={[styles.detailValue, styles.capitalize]}>{appointment.service_type || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Veterinarian</Text>
            <Text style={styles.detailValue}>{vetName}</Text>
          </View>
        </View>

      </View>

      {!isCanceled && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalType('reschedule')}>
            <Text style={styles.primaryBtnText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleCancelPress}>
            <Text style={styles.secondaryBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= MODALS ================= */}
      
      <Modal visible={modalType === 'pending_cancel'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>This appointment is still pending.</Text>
            <Text style={styles.modalDesc}>Are you sure you want to cancel it?</Text>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={executeCancellation} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalPrimaryBtnText}>Confirm cancellation</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setModalType(null)} disabled={isProcessing}>
              <Text style={styles.modalSecondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'standard_cancel'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel appointment?</Text>
            <Text style={styles.modalDesc}>Just a reminder that cancellations must be made at least one day before your appointment date.</Text>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={executeCancellation} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalPrimaryBtnText}>Confirm cancellation</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setModalType(null)} disabled={isProcessing}>
              <Text style={styles.modalSecondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'restricted'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalDesc}>This appointment is scheduled within the next 24 hours and can no longer be cancelled online. Please contact the clinic directly.</Text>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setModalType(null)}>
              <Text style={styles.modalSecondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'success'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Appointment cancelled</Text>
            <Text style={styles.modalDesc}>Your appointment has been successfully cancelled.</Text>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => { setModalType(null); navigation.goBack(); }}>
              <Text style={styles.modalSecondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'reschedule'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalDesc}>You can only reschedule this appointment up to 2 times. If you need further changes, please contact the clinic.</Text>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={executeReschedule}>
              <Text style={styles.modalPrimaryBtnText}>Continue to Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setModalType(null)}>
              <Text style={styles.modalSecondaryBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  spacer: { width: 34 },
  
  content: { paddingHorizontal: 25 },
  
  dateCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 30 },
  dateCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 20 },
  dateText: { fontSize: 22, fontWeight: '900', color: '#2E3A91' },
  dayText: { fontSize: 15, color: '#2E3A91', marginTop: 2, fontWeight: '500' },
  timeText: { fontSize: 15, color: '#2E3A91', marginTop: 10, fontWeight: '600' },
  
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  
  dateCardBottom: { paddingTop: 15 },
  requestedText: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },

  detailsSection: { paddingHorizontal: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  detailLabel: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  detailValue: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  capitalize: { textTransform: 'capitalize' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, paddingBottom: 40, backgroundColor: '#F8F9FD' },
  primaryBtn: { backgroundColor: '#2E3A91', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: 'transparent', paddingVertical: 18, borderRadius: 30, alignItems: 'center', borderWidth: 1.5, borderColor: '#CBD5E1' },
  secondaryBtnText: { color: '#2E3A91', fontSize: 15, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 340, backgroundColor: '#FFF', borderRadius: 24, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 15, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 12 },
  modalDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  
  modalPrimaryBtn: { backgroundColor: '#2E3A91', width: '100%', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 10 },
  modalPrimaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  modalSecondaryBtn: { backgroundColor: 'transparent', width: '100%', paddingVertical: 15, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  modalSecondaryBtnText: { color: '#1E293B', fontSize: 14, fontWeight: 'bold' },
});