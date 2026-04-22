import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../context/supabase'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function HealthCardPage({ route, navigation }) {
  // 1. Kunin ang pet object mula sa navigation parameters
  const { pet } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState({ name: '', contact: '' });

  // 2. Fetch Owner details (First Name, Last Name, at Phone Number)
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      if (!pet?.owner_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch First Name at Last Name mula sa profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', pet.owner_id)
          .single();

        if (profileError) console.error("Profile Fetch Error:", profileError.message);

        // Fetch Contact Number mula sa customer_contact_methods table
        const { data: contactData, error: contactError } = await supabase
          .from('customer_contact_methods')
          .select('value_primary')
          .eq('customer_id', pet.owner_id)
          .eq('channel', 'phone')
          .single();

        if (contactError) console.error("Contact Fetch Error:", contactError.message);

        // Pagsamahin ang Pangalan
        const fullName = profileData 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : 'N/A';

        setOwnerInfo({
          name: fullName,
          contact: contactData?.value_primary || 'N/A'
        });

      } catch (error) {
        console.error("General Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [pet]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#2E3A91" />
        <Text style={{ marginTop: 10, color: '#2E3A91' }}>Loading health card...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      
      {/* 1. TOP HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E3A91" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2E3A91', marginLeft: 15 }}>
          {pet?.pet_name || 'Pet'}'s health card
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* 2. PET INFO SECTION */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 25, marginBottom: 30, alignItems: 'center' }}>
          <Image 
            source={pet?.pimage ? { uri: pet.pimage } : require('../public/bluepaw.png')} 
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#00AEEF' }} 
          />
          <View style={{ marginLeft: 20, flex: 1 }}>
            <InfoRow label="Birthday" value={pet?.age || '00/00/0000'} />
            <InfoRow label="Species" value={pet?.species || 'N/A'} />
            <InfoRow label="Gender" value={pet?.gender || 'N/A'} />
            <InfoRow label="Breed" value={pet?.breed || 'N/A'} />
            <InfoRow label="Owner's name" value={ownerInfo.name} />
            <InfoRow label="Contact number" value={ownerInfo.contact} />
          </View>
        </View>

        {/* 3. VACCINATION RECORD SECTION */}
        <SectionHeader title="Vaccination Record" />
        <View style={MyStyleSheet.healthCardContainer}>
           <SearchBox />
           <RecordCard 
             title="Rabies Vaccine" 
             date="Jan 10, 2026" 
             nextDate="Jan 10, 2027" 
             hasUpload={true} 
           />
           <RecordCard 
             title="Rabies Vaccine" 
             date="Jan 10, 2026" 
             nextDate="Jan 10, 2027" 
             hasUpload={true} 
           />
        </View>

        {/* 4. CHECK-UPS / VET VISITS SECTION */}
        <SectionHeader title="Check-Ups / Vet Visits" />
        <View style={MyStyleSheet.healthCardContainer}>
           <SearchBox />
           <CheckupCard title="Skin Allergy Check" date="Jan 10, 2026" vet="Dr. Santos" />
           <CheckupCard title="Dental Cleaning" date="Jan 10, 2026" vet="Dr. Santos" />
        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

// --- SUB-COMPONENTS ---

const InfoRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
    <Text style={{ color: '#2E3A91', fontSize: 12, fontWeight: 'bold', flex: 1 }}>{label}</Text>
    <Text style={{ color: '#AAA', fontSize: 12, flex: 1, textAlign: 'right' }}>{value}</Text>
  </View>
)

const SectionHeader = ({ title }) => (
  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E3A91', marginLeft: 25, marginBottom: 15 }}>
    {title}
  </Text>
)

const SearchBox = () => (
  <View style={{ backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 15, height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', marginBottom: 15 }}>
    <Ionicons name="search" size={18} color="#CCC" />
    <TextInput placeholder="Search" style={{ marginLeft: 10, flex: 1 }} />
  </View>
)

const RecordCard = ({ title, date, nextDate, hasUpload }) => (
  <View style={{ backgroundColor: '#EBF4FF', borderRadius: 20, padding: 15, marginBottom: 15 }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E3A91' }}>{title}</Text>
    <Text style={{ fontSize: 12, color: '#666' }}>{date}</Text>
    <View style={{ height: 1, backgroundColor: '#CCC', marginVertical: 10 }} />
    <Text style={{ fontSize: 12, color: '#2E3A91', marginBottom: 10 }}>Next: {nextDate}</Text>
    
    <TouchableOpacity style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#2E3A91', borderRadius: 10, padding: 8, alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>View details</Text>
    </TouchableOpacity>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity style={{ backgroundColor: '#2E3A91', borderRadius: 10, padding: 8, flex: 0.48, alignItems: 'center' }}>
        <Text style={{ color: '#FFF', fontSize: 11 }}>Upload vaccine card</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: '#CCC', borderRadius: 10, padding: 8, flex: 0.48, alignItems: 'center' }}>
        <Text style={{ color: '#888', fontSize: 11 }}>View photo</Text>
      </TouchableOpacity>
    </View>
  </View>
)

const CheckupCard = ({ title, date, vet }) => (
  <View style={{ backgroundColor: '#EBF4FF', borderRadius: 20, padding: 15, marginBottom: 15 }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E3A91' }}>{title}</Text>
    <Text style={{ fontSize: 12, color: '#666' }}>{date}</Text>
    <View style={{ height: 1, backgroundColor: '#CCC', marginVertical: 10 }} />
    <Text style={{ fontSize: 12, color: '#2E3A91', marginBottom: 10 }}>{vet}</Text>
    <TouchableOpacity style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#2E3A91', borderRadius: 10, padding: 8, alignItems: 'center' }}>
      <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>View details</Text>
    </TouchableOpacity>
  </View>
)