import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

export default function AddPets() {
  const navigation = useNavigation()

  const [getPet, setPet] = useState({ 
    pimage: null, 
    pname: "", 
    species: "", 
    breed: "",
    customBreed: "", // Added to store the typed breed
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
      quality: 1,
    });

    if (!result.canceled) {
      setPet({ ...getPet, pimage: result.assets[0].uri });
    }
  };

  const [errorMsg, setErrorMsg] = useState("");

  const changeHandler = (field, value) => {
    let filteredValue = value;

    if (field === "species") {
      setPet({ ...getPet, species: value, breed: "", customBreed: "" });
      return;
    }

    if (field === "pname" || field === "gender") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (field === "age" || field === "weight") {
      filteredValue = value.replace(/[^0-9.]/g, "");
    }

    setPet({ ...getPet, [field]: filteredValue });
  };

  const handleContinue = () => {
    // Basic validation
    if (!getPet.pname || !getPet.species || !getPet.breed || !getPet.gender || !getPet.age || !getPet.weight) {
      setErrorMsg("Please fill up all required fields");
      return;
    }

    // Validation for "Other" breed
    if (getPet.breed === 'Other' && !getPet.customBreed.trim()) {
      setErrorMsg("Please specify the pet's breed");
      return;
    }

    setErrorMsg("");

    // Use customBreed if 'Other' was selected, otherwise use breed
    const finalData = {
      ...getPet,
      breed: getPet.breed === 'Other' ? getPet.customBreed : getPet.breed
    };

    navigation.navigate('addpetscont', { petData: finalData });
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={[MyStyleSheet.formScrollContent, { paddingTop: 20 }]} showsVerticalScrollIndicator={false}>
        <View style={MyStyleSheet.uploadContainer}>
          <View style={MyStyleSheet.profileCircleBlack}>
            {getPet.pimage ? (
              <Image source={{ uri: getPet.pimage }} style={{ width: 100, height: 100, borderRadius: 50 }}/>
            ) : (
              <Text style={{fontSize: 40}}>🐾</Text>
            )}
          </View>

          <TouchableOpacity style={MyStyleSheet.uploadOutlineBtn} onPress={pickImage}>
            <Text style={MyStyleSheet.uploadBtnLabel}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</Text>

        <View style={MyStyleSheet.inputGroup}>
          <TextInput 
            value={getPet.pname} 
            onChangeText={(val) => changeHandler("pname", val)} 
            style={MyStyleSheet.formInput} 
            placeholder="Pet's name" 
            placeholderTextColor="#AAA" 
          />

          <Dropdown 
            style={MyStyleSheet.formInput} 
            placeholderStyle={{ color: '#AAA' }} 
            selectedTextStyle={{ color: '#000' }} 
            data={speciesData} 
            labelField="label"
            valueField="value" 
            placeholder="Species" 
            value={getPet.species} 
            onChange={item => changeHandler("species", item.value)}
          />

          <Dropdown 
            style={[MyStyleSheet.formInput, !getPet.species && { opacity: 0.5 }]} 
            placeholderStyle={{ color: '#AAA' }} 
            selectedTextStyle={{ color: '#000' }} 
            data={getPet.species ? breedData[getPet.species] : []} 
            search // Enabled search to help find breeds faster
            searchPlaceholder="Search breed..."
            labelField="label"
            valueField="value" 
            placeholder={getPet.species ? "Select Breed" : "Select Species first"} 
            value={getPet.breed} 
            disable={!getPet.species}
            onChange={item => changeHandler("breed", item.value)}
          />

          {/* Conditional Input for "Other" Breed */}
          {getPet.breed === 'Other' && (
            <TextInput 
              value={getPet.customBreed} 
              onChangeText={(val) => setPet({...getPet, customBreed: val})} 
              style={[MyStyleSheet.formInput, { borderBottomColor: '#4A8CF7', borderBottomWidth: 2 }]} 
              placeholder="Enter specific breed" 
              placeholderTextColor="#AAA" 
              autoFocus={true}
            />
          )}
          
          <Dropdown 
            style={MyStyleSheet.formInput} 
            placeholderStyle={{ color: '#AAA' }} 
            selectedTextStyle={{ color: '#000' }} 
            data={genderData} 
            labelField="label"
            valueField="value" 
            placeholder="Gender" 
            value={getPet.gender} 
            onChange={item => changeHandler("gender", item.value)}
          />

          <View style={[MyStyleSheet.inlineInputs, { flexDirection: 'row', width: '100%' }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <TextInput 
                value={getPet.age} 
                onChangeText={(val) => changeHandler("age", val)} 
                style={[MyStyleSheet.formInput, { width: '100%' }]} 
                placeholder="Age"  
                placeholderTextColor="#AAA" 
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 1 }}>
              <TextInput 
                style={[MyStyleSheet.formInput, { width: '100%' }]} 
                placeholder="Weight(kg)" 
                placeholderTextColor="#AAA"  
                value={getPet.weight}  
                onChangeText={(val) => changeHandler("weight", val)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TextInput 
            style={[MyStyleSheet.formInput, MyStyleSheet.textArea]} 
            placeholder="Remarks"  
            placeholderTextColor="#AAA" 
            onChangeText={(val) => setPet({...getPet, remarks: val})} 
            multiline={true} 
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={MyStyleSheet.continuePrimaryBtn} onPress={handleContinue}>
          <Text style={MyStyleSheet.continueBtnText}>Continue</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}