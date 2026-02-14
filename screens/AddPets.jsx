import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import * as ImagePicker from 'expo-image-picker';
import { Pets } from '../App';



export default function AddPets() {
  const navigation = useNavigation()



   const [getPet, setPet] = useState({ 
      pimage: null, 
      pname: "", 
      species: "", 
      breed: "",
      gender:"", 
      age: "", 
      weight: "",
      remarks:"", 
    });

    // 2. Function to pick an image
  const pickImage = async () => {
    // Request permission first
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop for profile circles
      quality: 1,
    });

    if (!result.canceled) {
      // Save the uri to your state
      setPet({ ...getPet, pimage: result.assets[0].uri });
    }
  };

    const [errorMsg, setErrorMsg] = useState("");

  // Handler copied from Register logic to filter inputs
  const changeHandler = (field, value) => {
    let filteredValue = value;

    // 1. Logic for Names/Breed/Species (Letters and spaces only)
    if (field === "pname" || field === "species" || field === "breed" || field === "gender") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // 2. Logic for Age and Weight (Numbers and decimals only)
    if (field === "age" || field === "weight") {
      filteredValue = value.replace(/[^0-9.]/g, ""); // Allow numbers and a dot
    }

    setPet({ ...getPet, [field]: filteredValue });
  };

  const handleContinue = () => {
    // Basic validation: Check if required fields are empty
    if (!getPet.pname || !getPet.species || !getPet.breed || !getPet.gender || !getPet.age || !getPet.weight) {
      setErrorMsg("Please fill up all required fields");
      return;
    }

    setErrorMsg(""); // Clear error
    // Navigate to next page and pass pet data
    navigation.navigate('addpetscont', { petData: getPet });
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Manual Header removed to get rid of the second arrow. 
          Make sure App.js has headerTitleAlign: 'center' and title: 'Add Pet'
      */}

      <ScrollView 
        contentContainerStyle={[MyStyleSheet.formScrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Upload Section */}
        <View style={MyStyleSheet.uploadContainer}>
          <View style={MyStyleSheet.profileCircleBlack}>
 {getPet.pimage ? (
              <Image 
                source={{ uri: getPet.pimage }} 
                style={{ width: 100, height: 100, borderRadius: 50 }} 
              />
            ) : (
              <Image 
                source={require('../public/bluepaw.svg')} 
                style={{ width: 60, height: 60 }} 
                resizeMode="contain"
              />
            )}
             
          </View>
          <TouchableOpacity style={MyStyleSheet.uploadOutlineBtn}>
            <Image 
              source={require('../public/upload.svg')} 
              style={{ width: 20, height: 20, marginRight: 8 }} 
            />
            <Text onPress={()=> pickImage()} style={MyStyleSheet.uploadBtnLabel}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</Text>
       

        {/* Input Fields Group */}
        <View style={MyStyleSheet.inputGroup}>
          <TextInput value={getPet.pname} onChangeText={(val) => changeHandler("pname", val)} style={MyStyleSheet.formInput} placeholder="Pet's name" placeholderTextColor="#AAA" />
          <TextInput value={getPet.species} onChangeText={(val) => changeHandler("species", val)} style={MyStyleSheet.formInput} placeholder="Species" placeholderTextColor="#AAA" />
          <TextInput value={getPet.breed} onChangeText={(val) => changeHandler("breed", val)} style={MyStyleSheet.formInput} placeholder="Breed" placeholderTextColor="#AAA" />
          <TextInput value={getPet.gender} onChangeText={(val) => changeHandler("gender", val)} style={MyStyleSheet.formInput} placeholder="Gender" placeholderTextColor="#AAA" />

          {/* Inline Age and Weight - FIXED OVERFLOW */}
          <View style={[MyStyleSheet.inlineInputs, { flexDirection: 'row', width: '100%' }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <TextInput value={getPet.age} onChangeText={(val) => changeHandler("age", val)} style={[MyStyleSheet.formInput, { width: '100%' }]} placeholder="Age"  placeholderTextColor="#AAA"  />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput 
                style={[MyStyleSheet.formInput, { width: '100%' }]} 
                placeholder="Weight" 
                placeholderTextColor="#AAA" 
                value={getPet.weight} onChangeText={(val) => changeHandler("weight", val)}
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

        {/* Continue Button */}
        <TouchableOpacity style={MyStyleSheet.continuePrimaryBtn} onPress={() => handleContinue()}>
          <Text style={MyStyleSheet.continueBtnText}>Continue</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}