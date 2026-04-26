import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'

export default function ViewPetsPage() {
  const opx = useNavigation()
  const route = useRoute()
  
  // Dito kukunin ang 'pet' object na ipinasa mula sa PetManagementPage
  const { pet } = route.params || {}

  // ================= AGE CALCULATOR FUNCTION =================
  const calculateAge = (birthdateData) => {
    if (!birthdateData) return 'N/A';

    // Kung plain number lang ang sinave for some reason (hal: "2")
    if (!isNaN(birthdateData) && String(birthdateData).length <= 2) {
        return `${birthdateData} yrs old`;
    }

    // Subukan i-parse as Standard Date (kadalasan YYYY-MM-DD ang bigay ni Supabase)
    let birthDate = new Date(birthdateData);

    // Kung sakaling custom MMDDYY string format yung sinave 
    if (isNaN(birthDate.getTime())) {
      let formattedDate = String(birthdateData);
      if (formattedDate.length === 6 && !formattedDate.includes('/')) {
        formattedDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}/${formattedDate.slice(4)}`;
      } else if (formattedDate.length === 8 && !formattedDate.includes('/')) {
        formattedDate = `${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}/${formattedDate.slice(4)}`;
      }
      birthDate = new Date(formattedDate);
    }
    
    // Kung talagang hindi date format ang dumating, ibalik nalang yung original text
    if (isNaN(birthDate.getTime())) return String(birthdateData);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Kung less than 1 year, display as months
    if (age < 1) {
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
      return months > 0 ? `${months} months` : 'Just born';
    }

    return `${age} yrs old`;
  };

  const displayPetName = pet?.pet_name || pet?.name || 'Unknown Pet';
  const displayImage = pet?.image_url || pet?.imageUrl;

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      {/* 1. Header with Back Arrow */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        
        <Text style={MyStyleSheet.petHeaderTitle}>
          Review Details
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false}>
        
        {/* Image at Pangalan */}
        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
          <View style={{
            width: 140, 
            height: 140, 
            borderRadius: 70, 
            backgroundColor: '#f1f5f9', 
            justifyContent: 'center', 
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: 4,
            borderColor: '#e2e8f0',
            marginBottom: 15
          }}>
            {displayImage ? (
              <Image 
                source={{ uri: displayImage }} 
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }} 
              />
            ) : (
              <Text style={{ fontSize: 50 }}>🐾</Text>
            )}
          </View>
          
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#1e293b' }}>
            {displayPetName}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#5b86e5', textTransform: 'uppercase', marginTop: 4 }}>
            {pet?.species || 'N/A'} {pet?.breed ? `• ${pet.breed}` : ''}
          </Text>
        </View>

        {/* 2. Detailed Info Rows */}
        <View style={[MyStyleSheet.inputGroup, { marginTop: 20, backgroundColor: '#f8fafc', padding: 20, borderRadius: 20 }]}>
          
          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Gender</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.gender || 'N/A'}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Age</Text>
            {/* 🔴 DITO YUNG FIX: Ginamit natin yung pet.birthdate (o birthday kung yun ang name) */}
            <Text style={MyStyleSheet.detailValueTextGray}>{calculateAge(pet?.birthdate || pet?.birthday)}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Weight</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.weight ? `${pet.weight} kg` : 'N/A'}</Text>
          </View>

        </View>

        {/* 3. Action Buttons Section */}
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity 
            style={MyStyleSheet.primaryActionBtn} 
            onPress={() => opx.navigate('editpets', { pet })}
          >
            <Text style={MyStyleSheet.primaryActionBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={MyStyleSheet.outlineActionBtn} 
            onPress={() => opx.navigate('healthcard', { pet: pet })}
          >
            <Text style={MyStyleSheet.outlineActionBtnText}>Health card</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}