import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext';

export default function AddPets() {
  const navigation = useNavigation()
  const { user } = useUser(); 
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [getPet, setPet] = useState({ 
    pimage: null, 
    pname: "", 
    species: "", 
    breed: "",
    customBreed: "", 
    gender: "", 
    age: "", 
    weight: "",
    remarks: "", 
  });

  const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const speciesData = [
    { label: 'Dog', value: 'Dog' },
    { label: 'Cat', value: 'Cat' },
  ];

  // RESTORED FULL BREED LIST
  const breedData = {
    Dog: [
      { label: 'Aspin (Asong Pinoy)', value: 'Aspin' },
      { label: 'Shih Tzu', value: 'Shih Tzu' },
      { label: 'Golden Retriever', value: 'Golden Retriever' },
      { label: 'Pug', value: 'Pug' },
      { label: 'Labrador Retriever', value: 'Labrador' },
      { label: 'Bulldog', value: 'Bulldog' },
      { label: 'Beagle', value: 'Beagle' },
      { label: 'Poodle', value: 'Poodle' },
      { label: 'Chihuahua', value: 'Chihuahua' },
      { label: 'Dachshund', value: 'Dachshund' },
      { label: 'German Shepherd', value: 'German Shepherd' },
      { label: 'Siberian Husky', value: 'Siberian Husky' },
      { label: 'Pomeranian', value: 'Pomeranian' },
      { label: 'Corgi', value: 'Corgi' },
      { label: 'Chow Chow', value: 'Chow Chow' },
      { label: 'Belgian Malinois', value: 'Belgian Malinois' },
      { label: 'Rottweiler', value: 'Rottweiler' },
      { label: 'Dalmatian', value: 'Dalmatian' },
      { label: 'Other / Mixed Breed', value: 'Other' },
    ],
    Cat: [
      { label: 'Puspin (Pusang Pinoy)', value: 'Puspin' },
      { label: 'Persian', value: 'Persian' },
      { label: 'Siamese', value: 'Siamese' },
      { label: 'Maine Coon', value: 'Maine Coon' },
      { label: 'British Shorthair', value: 'British Shorthair' },
      { label: 'Bengal', value: 'Bengal' },
      { label: 'Ragdoll', value: 'Ragdoll' },
      { label: 'Scottish Fold', value: 'Scottish Fold' },
      { label: 'Sphynx', value: 'Sphynx' },
      { label: 'Abyssinian', value: 'Abyssinian' },
      { label: 'Russian Blue', value: 'Russian Blue' },
      { label: 'Munchkin', value: 'Munchkin' },
      { label: 'Himalayan', value: 'Himalayan' },
      { label: 'Other / Mixed Breed', value: 'Other' },
    ]
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, 
    });

    if (!result.canceled) {
      setPet({ ...getPet, pimage: result.assets[0].uri });
    }
  };

  const changeHandler = (field, value) => {
    // Reset breed if species changes
    if (field === "species") {
      setPet({ ...getPet, species: value, breed: "", customBreed: "" });
    } else {
      setPet({ ...getPet, [field]: value });
    }
  };

  const handleSavePet = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No user session found.");
      return;
    }

    if (!getPet.pname || !getPet.species || !getPet.breed || !getPet.gender || !getPet.age || !getPet.weight) {
      setErrorMsg("Please fill up all required fields");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = null;

      if (getPet.pimage) {
        const fileExt = getPet.pimage.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const response = await fetch(getPet.pimage);
        const blob = await response.blob();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(fileName, blob, { contentType: `image/${fileExt}` });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('pets')
        .insert([{
          owner_id: user.id,
          pet_name: getPet.pname,
          species: getPet.species,
          breed: getPet.breed === 'Other' ? getPet.customBreed : getPet.breed,
          gender: getPet.gender,
          age: getPet.age,
          weight: getPet.weight,
          image_url: finalImageUrl,
          remarks: getPet.remarks
        }]);

      if (insertError) throw insertError;

      Alert.alert("Success", "Pet registered successfully!");
      navigation.replace('dashboard');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={MyStyleSheet.petHeaderTitle}>Add pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        <View style={MyStyleSheet.imagePickerContainer}>
          <View style={MyStyleSheet.mainProfileCircle}>
            {getPet.pimage ? (
              <Image source={{ uri: getPet.pimage }} style={MyStyleSheet.mainProfileImage} />
            ) : (
              <View style={[MyStyleSheet.mainProfileImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
                 <Text style={{fontSize: 40}}>🐾</Text>
              </View>
            )}
            <TouchableOpacity style={MyStyleSheet.plusCircle} onPress={pickImage}>
              <Text style={MyStyleSheet.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={MyStyleSheet.formSectionTitle}>Basic information</Text>

        <View style={MyStyleSheet.inputGroup}>
          <Text style={MyStyleSheet.fieldLabel}>Pet's name</Text>
          <TextInput 
            value={getPet.pname} 
            onChangeText={(val) => changeHandler("pname", val)} 
            style={MyStyleSheet.styledInput} 
            placeholder="Enter pet's name" 
          />

          <Text style={MyStyleSheet.fieldLabel}>Species</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={speciesData} 
            labelField="label" valueField="value" 
            placeholder="Select species" 
            value={getPet.species} 
            onChange={item => changeHandler("species", item.value)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Breed</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={getPet.species ? breedData[getPet.species] : []} 
            search labelField="label" valueField="value" 
            placeholder={getPet.species ? "Select breed" : "Select species first"} 
            value={getPet.breed} 
            onChange={item => changeHandler("breed", item.value)}
          />

          {getPet.breed === 'Other' && (
            <TextInput 
              value={getPet.customBreed} 
              onChangeText={(val) => changeHandler("customBreed", val)} 
              style={[MyStyleSheet.styledInput, { marginTop: 10 }]} 
              placeholder="Specify breed" 
            />
          )}

          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={genderData} 
            labelField="label" valueField="value" 
            placeholder="Select gender" 
            value={getPet.gender} 
            onChange={item => changeHandler("gender", item.value)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Birthday</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="00/00/0000" 
            value={getPet.age} 
            onChangeText={(val) => changeHandler("age", val)}
          />

          <Text style={MyStyleSheet.fieldLabel}>Weight</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Kg" 
            value={getPet.weight} 
            onChangeText={(val) => changeHandler("weight", val)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[MyStyleSheet.primaryActionBtn, { marginTop: 40 }]} 
          onPress={handleSavePet}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.primaryActionBtnText}>Save</Text>}
        </TouchableOpacity>

      </ScrollView>

      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}