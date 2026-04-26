import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function SelectPetPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);

  const { serviceType } = route.params || {};

  useEffect(() => {
    async function fetchPets() {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', user.id);

        if (error) throw error;
        setPets(data || []);
      } catch (error) {
        console.error('Error fetching pets:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, [user]);

  const handleContinue = () => {
    if (!selectedPet || !serviceType) return;

    navigation.navigate('selectdate', { // Ensure 'selectdate' is your App.js route name
      petId: selectedPet.id,
      petName: selectedPet.pet_name,
      petInfo: selectedPet.breed || selectedPet.species || '',
      serviceType,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Progress Bar (Visual Only) */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 2 of 4</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
        </View>

        {!serviceType && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Please select a service first.</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.petsGrid}>
            {pets.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No pets found.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('addpets')}>
                  <Text style={styles.addPetLink}>Add your first pet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              pets.map((pet) => {
                const isSelected = selectedPet?.id === pet.id;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => setSelectedPet(pet)}
                    style={[styles.petCard, isSelected && styles.petCardSelected]}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.avatarWrapper, isSelected && styles.avatarWrapperSelected]}>
                      {pet.image_url ? (
                        <Image source={{ uri: pet.image_url }} style={styles.petImage} />
                      ) : (
                        <Text style={[styles.avatarInitials, isSelected && { color: '#2E3A91' }]}>
                          {pet.pet_name ? pet.pet_name.charAt(0).toUpperCase() : '?'}
                        </Text>
                      )}
                    </View>
                    
                    <Text style={[styles.petName, isSelected && styles.petNameSelected]} numberOfLines={1}>
                      {pet.pet_name}
                    </Text>
                    <Text style={[styles.petInfo, isSelected && styles.petInfoSelected]} numberOfLines={1}>
                      {pet.breed || pet.species}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}

            {/* Add Pet Button */}
            {pets.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('addpets')}
                style={styles.addPetBtn}
              >
                <View style={styles.addIconWrapper}>
                  <Ionicons name="add" size={30} color="#64748B" />
                </View>
                <Text style={styles.addPetBtnText}>Add Pet</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <Text style={styles.nextText}>Next: Date & Time</Text>
        <TouchableOpacity
          style={[styles.continueBtn, (!selectedPet || !serviceType) && styles.continueBtnDisabled]}
          disabled={!selectedPet || !serviceType}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Continue to Date & Time</Text>
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

  warningBox: { backgroundColor: '#FEF3C7', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#FDE68A' },
  warningText: { color: '#92400E', fontWeight: 'bold' },

  petsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  petCard: {
    width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
    borderWidth: 2, borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    minHeight: 160,
  },
  petCardSelected: { borderColor: '#2E3A91', backgroundColor: '#EFF6FF' },
  
  avatarWrapper: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#E2E8F0', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarWrapperSelected: { borderColor: '#BFDBFE' },
  petImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarInitials: { fontSize: 24, fontWeight: 'bold', color: '#94A3B8' },

  petName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', textAlign: 'center', marginBottom: 2 },
  petNameSelected: { color: '#2E3A91' },
  petInfo: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase' },
  petInfoSelected: { color: '#2E3A91' },

  emptyState: { width: '100%', backgroundColor: '#F1F5F9', borderRadius: 20, padding: 30, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' },
  emptyText: { color: '#64748B', marginBottom: 10 },
  addPetLink: { color: '#2E3A91', fontWeight: 'bold' },

  addPetBtn: {
    width: '48%', backgroundColor: 'transparent', borderRadius: 20, padding: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
    borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1',
    minHeight: 160,
  },
  addIconWrapper: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  addPetBtnText: { color: '#64748B', fontWeight: 'bold', fontSize: 14 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', alignItems: 'center' },
  nextText: { fontSize: 12, color: '#64748B', fontWeight: 'bold', marginBottom: 10 },
  continueBtn: { backgroundColor: '#2E3A91', width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});