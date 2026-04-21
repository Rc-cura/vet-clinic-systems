import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'

export default function ViewPetsPage() {
  const opx = useNavigation()
  const route = useRoute()
  const { pet } = route.params || {}

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      {/* 1. Header with Back Arrow and Dynamic Title */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={MyStyleSheet.petHeaderTitle}>{pet?.pname ? `${pet.pname}’s profile` : "Pet's profile"}</Text>
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
            <Text style={MyStyleSheet.detailValueTextGray}>{pet?.age || '0'}</Text>
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
            onPress={() => {/* Health card logic */}}
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