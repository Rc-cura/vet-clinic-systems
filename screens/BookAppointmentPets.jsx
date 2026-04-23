import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App'

export default function BookAppointmentPets() {
  const opx = useNavigation()
  const route = useRoute()

  // Dynamic header title based on which service was picked
  const { service } = route.params || { service: 'Consultation / Routine Check-up' }
  
  const [selectedPet, setSelectedPet] = useState(null)

  const renderPetItem = ({ item }) => {
    const isSelected = selectedPet?.id === item.id;

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={[
          MyStyleSheet.dashOverviewCleanCard, 
          { 
            flexDirection: 'row', 
            padding: 0, 
            overflow: 'hidden', 
            height: 130, 
            marginBottom: 20,
            borderWidth: isSelected ? 2 : 0,
            borderColor: '#2E3A91'
          }
        ]} 
        onPress={() => setSelectedPet(item)} 
      >
        {/* Left Side: Pet Image */}
        <View style={{ width: 130, height: '100%' }}>
          {item.pimage ? (
            <Image source={{ uri: item.pimage }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#F0F5FF', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../public/bluepaw.png')} style={{ width: 60, height: 60 }} resizeMode="contain" />
            </View>
          )}
        </View>

        {/* Right Side: Pet Info (Centered vertically like your screenshot) */}
        <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E3A91' }}>{item.pname}</Text>
          <Text style={{ fontSize: 14, color: '#2E3A91', marginTop: 2 }}>{item.breed}</Text>
          
          <Text style={{ fontSize: 12, color: '#2E3A91', marginTop: 20 }}>{item.gender}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[MyStyleSheet.whiteContainer, { backgroundColor: '#FFF' }]}>
      
      {/* HEADER */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start', paddingHorizontal: 20, marginBottom: 10 }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10, flex: 1 }]}>
            Book an appointment ( {service} )
        </Text>
      </View>

      <View style={{ paddingHorizontal: 25, flex: 1 }}>
        
        <Text style={[MyStyleSheet.profileMenuTitle, { marginTop: 20, marginBottom: 15 }]}>Select your pet</Text>

        {/* SEARCH BAR WITH YOUR ICON */}
        <View style={[MyStyleSheet.searchContainer, { marginBottom: 25 }]}>
            <Image 
                source={require('../public/search_icon.png')} 
                style={{ width: 18, height: 18, marginRight: 10, tintColor: '#AAA' }} 
                resizeMode="contain"
            />
            <TextInput 
                placeholder="Search" 
                placeholderTextColor="#AAA"
                style={{ flex: 1, height: '100%', color: '#2E3A91' }} 
            />
        </View>

        <FlatList 
          data={Pets} 
          renderItem={renderPetItem} 
          keyExtractor={(item, index) => index.toString()} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        /> 

      </View>

      {/* FOOTER ACTION BUTTON */}
      <View style={{ paddingHorizontal: 25, paddingBottom: 20 }}>
        <TouchableOpacity 
            style={[
                MyStyleSheet.primaryActionBtn, 
                !selectedPet && { backgroundColor: '#F0F0F0' }
            ]}
            disabled={!selectedPet}
            onPress={() => opx.navigate('datetime', { 
                petName: selectedPet.pname, 
                petImage: selectedPet.pimage,
                petWeight: selectedPet.weight,
                service: service 
            })}
        >
            <Text style={[MyStyleSheet.primaryActionBtnText, !selectedPet && { color: '#CCC' }]}>Next</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}