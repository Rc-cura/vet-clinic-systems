import { View, Text, TouchableOpacity, SafeAreaView, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

// Import Supabase and Context
import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext';

export default function PetManagementPage() {
  const navigation = useNavigation();
  const { user } = useUser();
  const isFocused = useIsFocused(); // Para ma-detect kung binuksan ang tab na ito
  
  // State for Drawer
  const [isExpanded, setIsExpanded] = useState(false);

  // State for Pets List
  const [userPets, setUserPets] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Function para kunin ang pets sa database
  const fetchPets = async () => {
    if (!user || !user.id) {
      setLoadingList(false); 
      return;
    }
    setLoadingList(true);
    try {
      const { data, error } = await supabase.from('pets').select('*').eq('owner_id', user.id);
      if (error) throw error;
      setUserPets(data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoadingList(false);
    }
  };

  // I-fetch agad ang pets tuwing pinipindot ang Pets Tab
  useEffect(() => {
    if (isFocused) {
      fetchPets();
      setIsExpanded(false); // Itago ang add pet button by default pagka-load
    }
  }, [isFocused, user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <View style={{ flex: 1 }}>
        
        {/* Header Section */}
        <View style={MyStyleSheet.petHeaderSimple}>
          <Text style={MyStyleSheet.petHeaderTitle}>Pets</Text>
        </View>

        {/* Main Content Area (List or Empty State) */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
          
          {loadingList ? (
            
            <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 50 }} />
            
          ) : userPets.length === 0 ? (
            
            /* EMPTY STATE */
            <View style={[MyStyleSheet.emptyStateCentered, { marginTop: 60 }]}>
              <Image 
                source={require('../public/cat.png')} 
                style={MyStyleSheet.catIllustration} 
                resizeMode="contain" 
              />
              <Text style={MyStyleSheet.emptyStateSubtitle}>
                There are no pets listed here.{"\n"}Create their profiles now!
              </Text>
            </View>

          ) : (

            /* PETS LIST / CARDS */
            <View style={styles.petsList}>
              {userPets.map((pet) => (
                <View key={pet.id} style={styles.petCard}>
                  <Image source={pet.image_url ? { uri: pet.image_url } : require('../public/bluepaw.png')} style={styles.petImage} />
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.pet_name}</Text>
                    <Text style={styles.petBreed}>{pet.breed}</Text>
                    <Text style={styles.petGender}>{pet.gender}</Text>
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('viewpets', { pet: pet })} 
>
  <Text style={styles.outlineBtnText}>View Profile</Text>
</TouchableOpacity>
                      <TouchableOpacity style={styles.solidBtn}><Text style={styles.solidBtnText}>Book appointment</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

          )}
        </ScrollView>

        {/* Floating Drawer Card */}
        <View style={[
          MyStyleSheet.bottomDrawerCard, 
          isExpanded ? { height: 250 } : { height: 110 }
        ]}>
          
          {/* Tappable Area to Pull Up/Down */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setIsExpanded(!isExpanded)}
            style={{ alignItems: 'center', width: '100%' }}
          >
            <View style={MyStyleSheet.dragHandleBar} />
            <Text style={MyStyleSheet.cardActionTitle}>Add a pet now</Text>
          </TouchableOpacity>
          
          {/* Show Button only when expanded - PUPUNTA SA AddPets.jsx */}
          {isExpanded && (
            <TouchableOpacity 
              style={MyStyleSheet.primaryActionBtn} 
              onPress={() => navigation.navigate('addpets')} 
            >
              <Text style={MyStyleSheet.primaryActionBtnText}>Add pet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation Bar at the very bottom */}
        <View style={MyStyleSheet.minimalBottomNav}>
          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('dashboard')}>
            <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab}>
            <Image source={require('../public/Pets.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
            <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Pets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('service')}>
            <Image source={require('../public/Book.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Book</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('appointment')}>
            <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('userprofile')}>
            <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// Kailangan natin ilagay ang styles para sa cards dito para hindi masira ang design mo
const styles = StyleSheet.create({
  petsList: { marginTop: 10 },
  petCard: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30,
    padding: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
  },
  petImage: { width: 100, height: 120, borderRadius: 20, marginRight: 15, backgroundColor: '#F0F0F0' },
  petInfo: { flex: 1, justifyContent: 'center' },
  petName: { fontSize: 22, fontWeight: '900', color: '#2E3A91' },
  petBreed: { fontSize: 13, color: '#2E3A91', marginBottom: 8 },
  petGender: { fontSize: 11, color: '#2E3A91', marginBottom: 12 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between' },
  outlineBtn: { flex: 1, borderWidth: 1.2, borderColor: '#2E3A91', borderRadius: 20, paddingVertical: 7, alignItems: 'center', marginRight: 8 },
  outlineBtnText: { color: '#2E3A91', fontSize: 9.5, fontWeight: '700' },
  solidBtn: { flex: 1.2, backgroundColor: '#2E3A91', borderRadius: 20, paddingVertical: 7, alignItems: 'center' },
  solidBtnText: { color: '#FFF', fontSize: 9.5, fontWeight: '700' },
});