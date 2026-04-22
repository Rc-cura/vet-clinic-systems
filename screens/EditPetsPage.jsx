import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import * as ImagePicker from 'expo-image-picker' 
import { Dropdown } from 'react-native-element-dropdown'; // 🔴 Import Dropdown
import MyStyleSheet from '../styles/MyStyleSheet'

// Import Supabase
import { supabase } from '../context/supabase';

export default function EditPetsPage() {
  const opx = useNavigation()
  const route = useRoute()
  
  const { pet } = route.params || {}

  // Initial States
  const [pname, setPname] = useState(pet?.pet_name || pet?.pname || '')
  const [species, setSpecies] = useState(pet?.species || '')
  const [breed, setBreed] = useState(pet?.breed || '')
  const [gender, setGender] = useState(pet?.gender || '')
  const [age, setAge] = useState(pet?.age || '')
  const [weight, setWeight] = useState(pet?.weight || '')
  const [remarks, setRemarks] = useState(pet?.remarks || '')
  const [pimage, setPimage] = useState(pet?.pimage || null) 
  
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // 🔴 Data for Dropdowns
  const speciesData = [
    { label: 'Dog', value: 'Dog' },
    { label: 'Cat', value: 'Cat' },

  ];

  const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  // Sample Breed Data (Pwede mo itong palawigin depende sa species)
  const breedData = [
    { label: 'Golden Retriever', value: 'Golden Retriever' },
    { label: 'Pug', value: 'Pug' },
    { label: 'Shih Tzu', value: 'Shih Tzu' },
    { label: 'Persian Cat', value: 'Persian Cat' },
    { label: 'Siamese Cat', value: 'Siamese Cat' },
    { label: 'Puspin', value: 'Puspin' },
    { label: 'Aspin', value: 'Aspin' },
  ];

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission needed", "Kailangan ng access sa gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPimage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!pet?.id) {
      Alert.alert("Error", "Pet ID is missing.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          pet_name: pname,
          species: species,
          breed: breed,
          gender: gender,
          age: age,
          weight: weight,
          pimage: pimage
        })
        .eq('id', pet.id);

      if (error) throw error;
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={MyStyleSheet.petHeaderTitle}>Edit pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false}>

        <View style={MyStyleSheet.imagePickerContainer}>
          <View style={MyStyleSheet.mainProfileCircle}>
            {pimage ? (
              <Image source={{ uri: pimage }} style={MyStyleSheet.mainProfileImage} />
            ) : (
              <View style={[MyStyleSheet.mainProfileImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
                 <Text style={{fontSize: 40}}>🐾</Text>
              </View>
            )}
            <TouchableOpacity style={MyStyleSheet.plusCircle} onPress={handlePickImage}>
              <Text style={MyStyleSheet.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={MyStyleSheet.formSectionTitle}>Basic information</Text>

        <View style={MyStyleSheet.inputGroup}>
          <Text style={MyStyleSheet.fieldLabel}>Pet's name</Text>
          <TextInput style={MyStyleSheet.styledInput} value={pname} onChangeText={setPname} />

          {/* 🔴 Species Dropdown */}
          <Text style={MyStyleSheet.fieldLabel}>Species</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={speciesData} 
            labelField="label" 
            valueField="value" 
            placeholder="Select species"
            value={species}
            onChange={item => setSpecies(item.value)} 
          />

          {/* 🔴 Breed Dropdown */}
          <Text style={MyStyleSheet.fieldLabel}>Breed</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={breedData} 
            labelField="label" 
            valueField="value" 
            placeholder="Select breed"
            value={breed}
            onChange={item => setBreed(item.value)} 
          />

          {/* 🔴 Gender Dropdown */}
          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={genderData} 
            labelField="label" 
            valueField="value" 
            placeholder="Select gender"
            value={gender}
            onChange={item => setGender(item.value)} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Birthday</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="00/00/0000" value={age} onChangeText={setAge} />

          <Text style={MyStyleSheet.fieldLabel}>Weight</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="Kg" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        </View>

        <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { marginTop: 30 }]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.primaryActionBtnText}>Save changes</Text>}
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
                  pet: { ...pet, pet_name: pname, species, breed, gender, age, weight, pimage: pimage } 
                });
              }}
            >
              <Text style={MyStyleSheet.modalViewText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 80 }} />
    </SafeAreaView>
  )
}