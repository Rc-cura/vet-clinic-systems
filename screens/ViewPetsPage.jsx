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
  const calculateAge = (birthdayString) => {
    if (!birthdayString) return 'N/A';

    // Sinusubukan nitong lagyan ng slashes kung 6 digits lang (hal: 072705 -> 07/27/05)
    let formattedDate = birthdayString;
    if (birthdayString.length === 6 && !birthdayString.includes('/')) {
      formattedDate = `${birthdayString.slice(0, 2)}/${birthdayString.slice(2, 4)}/${birthdayString.slice(4)}`;
    } 
    // Kung 8 digits naman (hal: 07272005 -> 07/27/2005)
    else if (birthdayString.length === 8 && !birthdayString.includes('/')) {
      formattedDate = `${birthdayString.slice(0, 2)}/${birthdayString.slice(2, 4)}/${birthdayString.slice(4)}`;
    }

    const birthDate = new Date(formattedDate);
    
    // Kung hindi valid na date ang na-input, ibalik na lang ang original string
    if (isNaN(birthDate.getTime())) return birthdayString; 

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Kung less than 1 year old, months ang ipakita natin
    if (age < 1) {
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
      return months > 0 ? `${months} months` : 'Just born';
    }

    return `${age} yrs old`;
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      {/* 1. Header with Back Arrow and Dynamic Title */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        
        <Text style={MyStyleSheet.petHeaderTitle}>
          {pet?.pet_name ? `${pet.pet_name}’s profile` : "Pet's profile"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false}>
        
        {/* 2. Detailed Info Rows */}
        <View style={[MyStyleSheet.inputGroup, { marginTop: 20 }]}>
          
          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Species</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.species || 'N/A'}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Breed</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.breed || 'N/A'}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Gender</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.gender || 'N/A'}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Age</Text>
            {/* 🔴 IN-UPDATE: Dito na gagamitin yung calculateAge function */}
            <Text style={MyStyleSheet.detailValueTextGray}>{calculateAge(pet?.age)}</Text>
          </View>

          <View style={MyStyleSheet.detailRow}>
            <Text style={MyStyleSheet.detailLabelText}>Weight</Text>
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.weight ? `${pet.weight}kg` : 'N/A'}</Text>
          </View>

        </View>

        {/* 3. Action Buttons Section */}
        <View style={{ marginTop: 40 }}>
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

      {/* 4. Navigation Bar */}
      <View style={MyStyleSheet.minimalBottomNav}>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('petsadded')}>
          <Image source={require('../public/Pets.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
          <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Book.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}