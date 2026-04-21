import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App'

export default function EditPetsPage() {
  const opx = useNavigation()
  const route = useRoute()
  
  const { pet } = route.params || {}

  const [pname, setPname] = useState(pet?.pname || '')
  const [species, setSpecies] = useState(pet?.species || '')
  const [breed, setBreed] = useState(pet?.breed || '')
  const [gender, setGender] = useState(pet?.gender || '')
  const [age, setAge] = useState(pet?.age || '')
  const [weight, setWeight] = useState(pet?.weight || '')
  const [remarks, setRemarks] = useState(pet?.remarks || '')
  const [modalVisible, setModalVisible] = useState(false)

  const handleSave = () => {
    const index = Pets.findIndex(item => item.pname === pet?.pname);
    if (index !== -1) {
      Pets[index] = {
        ...Pets[index],
        pname,
        species,
        breed,
        gender,
        age,
        weight,
        remarks,
      };
    }
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      {/* 1. Updated Header Section */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={MyStyleSheet.petHeaderTitle}>Edit pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* 2. Profile Image with Plus Overlay */}
        <View style={MyStyleSheet.imagePickerContainer}>
          <View style={MyStyleSheet.mainProfileCircle}>
            {pet?.pimage ? (
              <Image source={{ uri: pet.pimage }} style={MyStyleSheet.mainProfileImage} />
            ) : (
              <View style={[MyStyleSheet.mainProfileImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
                 <Text style={{fontSize: 40}}>🐾</Text>
              </View>
            )}
            <TouchableOpacity style={MyStyleSheet.plusCircle}>
              <Text style={MyStyleSheet.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={MyStyleSheet.formSectionTitle}>Basic information</Text>

        {/* 3. Labeled Form Inputs */}
        <View style={MyStyleSheet.inputGroup}>
          <Text style={MyStyleSheet.fieldLabel}>Pet's name</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Enter pet's name" 
            value={pname} 
            onChangeText={setPname} 
            placeholderTextColor="#AAA" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Species</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Select species" 
            value={species} 
            onChangeText={setSpecies} 
            placeholderTextColor="#AAA" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Breed</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Select breed" 
            value={breed} 
            onChangeText={setBreed} 
            placeholderTextColor="#AAA" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Select gender" 
            value={gender} 
            onChangeText={setGender} 
            placeholderTextColor="#AAA" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Birthday</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="00/00/0000" 
            value={age} 
            onChangeText={setAge} 
            placeholderTextColor="#AAA" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Weight</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Kg" 
            value={weight} 
            onChangeText={setWeight} 
            keyboardType="numeric" 
            placeholderTextColor="#AAA" 
          />
        </View>

        {/* 4. Action Buttons */}
        <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { marginTop: 30 }]} onPress={handleSave}>
          <Text style={MyStyleSheet.primaryActionBtnText}>Save changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.deleteBtn} onPress={() => {/* Delete Logic */}}>
          <Text style={MyStyleSheet.deleteBtnText}>Delete</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Success Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.modalContainer}>
            <Text style={MyStyleSheet.modalTitle}>Successfully Edited Pet Profile</Text>
            <TouchableOpacity 
              style={MyStyleSheet.modalViewProfileBtn} 
              onPress={() => {
                setModalVisible(false);
                opx.navigate('viewpets', { 
                  pet: { ...pet, pname, species, breed, gender, age, weight, remarks } 
                });
              }}
            >
              <Text style={MyStyleSheet.modalViewText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Spacer */}
      <View style={{ height: 80 }} />
    </SafeAreaView>
  )
}