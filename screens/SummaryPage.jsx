import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator, Modal, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function SummaryPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();

  // Data passed from Date Selection
  const { petId, serviceType, date, time, vetId } = route.params || {};

  const [pet, setPet] = useState(null);
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Fetch Final Data ---
  useEffect(() => {
    async function fetchData() {
      if (!petId) { setLoading(false); return; }
      try {
        // Fetch Pet Details
        const { data: petData } = await supabase.from('pets').select('*').eq('id', petId).single();
        if (petData) setPet(petData);

        // Fetch Vet Details
        if (vetId) {
          let { data: vetData, error } = await supabase
            .from('veterinarians')
            .select('id, user_id, full_name, specialization')
            .eq('user_id', vetId)
            .single();

          if (!vetData) {
             ({ data: vetData, error } = await supabase
              .from('veterinarians')
              .select('id, user_id, full_name, specialization')
              .eq('id', vetId)
              .single());
          }

          if (vetData) {
            setVet(vetData);
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [petId, vetId]);

  // --- Submit Booking ---
  const submitBooking = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const vetUserId = vet ? vet.user_id : null;

    const { data: insertedAppointment, error } = await supabase
      .from('appointments')
      .insert({
        pet_id: petId,
        client_id: user.id,
        vet_id: vetUserId,
        service_type: serviceType,
        appointment_date: date,
        appointment_time: time,
        status: 'Pending',
        notes: null,
      })
      .select('id')
      .single();

    if (error) {
      console.error("DB Constraint Violation:", error);
      Alert.alert("Database Error", `${error.message}. Please check if the Veterinarian selection is valid.`);
      setIsSubmitting(false);
      setShowPolicyModal(false);
    } else {
      // NOTE: We skip the web-specific notifications (email API/Next.js specific logic) 
      // but the appointment is successfully saved in Supabase.
      
      setIsSubmitting(false);
      setShowPolicyModal(false);
      setShowSuccessModal(true);

      // Auto redirect after success
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('appointment'); // Ensure this matches your App.js route for the Appointments tab
      }, 1500);
    }
  };

  // --- Format Display Data ---
  const displayDate = date ? new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
  }) : 'Invalid Date';

  const displayTime = (() => {
    if (!time) return 'N/A';
    const [hoursText, minutesText] = time.split(':');
    const hours = Number(hoursText);
    const minutes = Number(minutesText);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  })();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2E3A91" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <Ionicons name="checkmark-circle" size={60} color="#10B981" style={{ marginBottom: 15 }} />
            <Text style={styles.successTitle}>Booking Successful!</Text>
            <Text style={styles.successSub}>Redirecting to appointments...</Text>
          </View>
        </View>
      </Modal>

      {/* CANCELLATION POLICY MODAL */}
      <Modal visible={showPolicyModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.policyModalCard}>
            <Text style={styles.policyTitle}>Cancellation Policy</Text>
            <Text style={styles.policyText}>
              Cancellations are only permitted up to one day before your scheduled appointment.
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPolicyModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmBtn} 
                onPress={submitBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                   <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.titleUnderline} />

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderSmallText}>APPOINTMENT REQUEST</Text>
            <Text style={styles.cardHeaderTitle}>Summary Information</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Pet Info Row */}
            <View style={styles.petInfoRow}>
              <View style={styles.petImageWrapper}>
                {pet?.image_url ? (
                  <Image source={{ uri: pet.image_url }} style={styles.petImage} />
                ) : (
                  <Ionicons name="paw" size={30} color="#94A3B8" />
                )}
              </View>
              <View style={styles.petDetails}>
                <Text style={styles.petLabel}>PET</Text>
                <Text style={styles.petName}>{pet?.pet_name || 'Unknown'}</Text>
                <Text style={styles.petBreed}>{pet?.species} {pet?.breed ? `• ${pet.breed}` : ''}</Text>
                
                <View style={styles.petMetricsRow}>
                  <View style={styles.metricItem}>
                    <Ionicons name="male-female" size={14} color="#F472B6" />
                    <Text style={styles.metricText}>{pet?.gender || 'N/A'}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="scale" size={14} color="#60A5FA" />
                    <Text style={styles.metricText}>{pet?.weight ? `${pet.weight} kg` : 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              
              <View style={styles.detailBox}>
                <View style={styles.detailTitleRow}>
                  <FontAwesome5 name="stethoscope" size={14} color="#2E3A91" />
                  <Text style={styles.detailLabel}>SERVICE</Text>
                </View>
                <Text style={styles.detailValue} style={{textTransform: 'capitalize'}}>{serviceType || 'Not selected'}</Text>
              </View>

              <View style={styles.detailBox}>
                <View style={styles.detailTitleRow}>
                  <FontAwesome5 name="user-md" size={14} color="#2E3A91" />
                  <Text style={styles.detailLabel}>VETERINARIAN</Text>
                </View>
                <Text style={styles.detailValue}>{vet ? vet.full_name : 'No Vet Selected'}</Text>
              </View>

              <View style={[styles.detailBox, { width: '100%' }]}>
                <View style={styles.detailTitleRow}>
                  <Ionicons name="calendar" size={16} color="#2E3A91" />
                  <Text style={styles.detailLabel}>DATE AND TIME</Text>
                </View>
                <Text style={styles.detailValue}>{displayDate} at {displayTime}</Text>
              </View>

            </View>
          </View>

        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sendBtn} onPress={() => setShowPolicyModal(true)}>
          <Text style={styles.sendBtnText}>Send Request</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
  titleUnderline: { width: 60, height: 4, backgroundColor: '#2E3A91', borderRadius: 2, marginBottom: 20 },

  summaryCard: { backgroundColor: '#FFF', borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  
  cardHeader: { backgroundColor: '#EFF6FF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  cardHeaderSmallText: { fontSize: 10, fontWeight: 'bold', color: '#2E3A91', letterSpacing: 1.5, marginBottom: 5 },
  cardHeaderTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B' },

  cardBody: { padding: 20 },
  
  petInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  petImageWrapper: { width: 65, height: 65, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 15 },
  petImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  petDetails: { flex: 1 },
  petLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 1 },
  petName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  petBreed: { fontSize: 12, fontWeight: 'bold', color: '#2E3A91', textTransform: 'uppercase', marginTop: 2 },
  petMetricsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metricItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  metricText: { fontSize: 12, fontWeight: '600', color: '#64748B', marginLeft: 4 },

  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 20 },

  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailBox: { width: '48%', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  detailTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailLabel: { fontSize: 10, fontWeight: '900', color: '#2E3A91', marginLeft: 6, letterSpacing: 1 },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginTop: 5 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  sendBtn: { backgroundColor: '#2E3A91', width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#2E3A91', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  sendBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  successModalCard: { width: '100%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 25, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  successSub: { fontSize: 14, color: '#64748B', fontWeight: '600' },

  policyModalCard: { width: '100%', maxWidth: 350, backgroundColor: '#FFF', borderRadius: 25, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  policyTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  policyText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalCancelBtn: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginRight: 10 },
  modalCancelText: { color: '#475569', fontSize: 16, fontWeight: 'bold' },
  modalConfirmBtn: { flex: 1, backgroundColor: '#2E3A91', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginLeft: 10 },
  modalConfirmText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});