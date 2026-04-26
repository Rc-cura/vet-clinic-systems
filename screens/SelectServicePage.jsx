import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Using Expo icons instead of lucide

export default function SelectServicePage() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [selectedService, setSelectedService] = useState(null);

  // Grab data from previous page (if user came from Pet Profile)
  const { petId, petName, petInfo } = route.params || {};
  
  const hasPreselectedPet = Boolean(petId);
  const nextStep = hasPreselectedPet ? 'Date & Time' : 'Pet';

  const services = [
    { id: 'consultation', title: 'Consultation', iconName: 'stethoscope', type: 'FontAwesome5' },
    { id: 'vaccination', title: 'Vaccination', iconName: 'syringe', type: 'FontAwesome5' },
    { id: 'grooming', title: 'Grooming', iconName: 'cut', type: 'FontAwesome5' },
  ];

  const handleContinue = () => {
    if (!selectedService) return;

    if (hasPreselectedPet) {
      // Skip pet selection, go straight to Date
      navigation.navigate('selectdate', { // Ensure 'selectdate' is your App.js route name
        petId,
        petName,
        petInfo,
        serviceType: selectedService,
      });
      return;
    }

    // Default flow: Go to Select Pet
    navigation.navigate('selectpet', { // Ensure 'selectpet' is your App.js route name
      serviceType: selectedService,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Bar (Visual Only) */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 1 of {hasPreselectedPet ? '3' : '4'}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: hasPreselectedPet ? '33%' : '25%' }]} />
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {services.map((service) => {
            const isSelected = selectedService === service.title;
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(service.title)}
                style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
                  {service.type === 'FontAwesome5' ? (
                    <FontAwesome5 name={service.iconName} size={30} color={isSelected ? '#2E3A91' : '#64748B'} />
                  ) : (
                    <Ionicons name={service.iconName} size={30} color={isSelected ? '#2E3A91' : '#64748B'} />
                  )}
                </View>
                <Text style={[styles.serviceTitle, isSelected && styles.serviceTitleSelected]}>
                  {service.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="warning" size={20} color="#D97706" style={{ marginTop: 2 }} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.disclaimerTitle}>IMPORTANT DISCLAIMER</Text>
            <Text style={styles.disclaimerText}>
              Pet owners cannot diagnose their pets. You are strictly requesting a service type. The final diagnosis will be determined by the veterinarian.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <Text style={styles.nextText}>Next: {nextStep}</Text>
        <TouchableOpacity
          style={[styles.continueBtn, !selectedService && styles.continueBtnDisabled]}
          disabled={!selectedService}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Continue to {nextStep}</Text>
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
  
  content: { padding: 20, paddingBottom: 150 },
  
  progressContainer: { marginBottom: 30 },
  progressText: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 5 },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: '#2E3A91', borderRadius: 3 },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: {
    width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
    borderWidth: 2, borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    minHeight: 140,
  },
  serviceCardSelected: { borderColor: '#2E3A91', backgroundColor: '#EFF6FF' },
  iconWrapper: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  iconWrapperSelected: { backgroundColor: '#DBEAFE' },
  serviceTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', textAlign: 'center' },
  serviceTitleSelected: { color: '#2E3A91' },

  disclaimerBox: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A', marginTop: 10 },
  disclaimerTitle: { fontSize: 11, fontWeight: 'bold', color: '#92400E', marginBottom: 4 },
  disclaimerText: { fontSize: 12, color: '#B45309', lineHeight: 18 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center' },
  nextText: { fontSize: 12, color: '#64748B', fontWeight: 'bold', marginBottom: 10 },
  continueBtn: { backgroundColor: '#2E3A91', width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});