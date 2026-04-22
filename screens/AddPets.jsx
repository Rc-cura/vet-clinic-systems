import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react' 
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

// Import Supabase and your User Context
import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext';

// --- FALLBACK OBJECTS (Kapag walang internet o offline pa ang database) ---
const fallbackSpecies = [
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
];

const fallbackBreeds = [
  { name: 'Aspin (Asong Pinoy)', species_name: 'Dog' },
  { name: 'Shih Tzu', species_name: 'Dog' },
  { name: 'Golden Retriever', species_name: 'Dog' },
  { name: 'Pug', species_name: 'Dog' },
  { name: 'Puspin (Pusang Pinoy)', species_name: 'Cat' },
  { name: 'Persian', species_name: 'Cat' },
  { name: 'Siamese', species_name: 'Cat' },
  { name: 'Maine Coon', species_name: 'Cat' },
];

export default function AddPets() {
  const navigation = useNavigation()
  const { user } = useUser(); 
  
  const [loadingForm, setLoadingForm] = useState(false);
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

  const [speciesList, setSpeciesList] = useState(fallbackSpecies);
  const [allBreedsList, setAllBreedsList] = useState(fallbackBreeds); 
  const [filteredBreedsList, setFilteredBreedsList] = useState([]); 

  const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  // ================= FETCH SPECIES/BREEDS PARA SA DROPDOWNS =================
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const { data: speciesData } = await supabase.from('species').select('name');
        if (speciesData && speciesData.length > 0) {
          setSpeciesList(speciesData.map(item => ({ label: item.name, value: item.name })));
        }

        const { data: breedsData } = await supabase.from('breeds').select('name, species_name');
        if (breedsData && breedsData.length > 0) {
           setAllBreedsList(breedsData);
        }
      } catch (error) {
        console.log("Using local fallback objects for species/breeds.");
      }
    };
    fetchDropdownData();
  }, []); 

  // ================= FORM HANDLERS =================
  const changeHandler = (field, value) => {
    let filteredValue = value;
    
    // Kapag pumili ng Species, ifi-filter ang Breed dropdown
    if (field === "species") {
      setPet({ ...getPet, species: value, breed: "", customBreed: "" });
      const relevantBreeds = allBreedsList
        .filter(breed => breed.species_name === value)
        .map(breed => ({ label: breed.name, value: breed.name }));
      
      relevantBreeds.push({ label: 'Other / Mixed Breed', value: 'Other' });
      setFilteredBreedsList(relevantBreeds);
      return;
    }

    if (field === "pname" || field === "gender") filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (field === "age" || field === "weight") filteredValue = value.replace(/[^0-9.]/g, "");
    
    setPet({ ...getPet, [field]: filteredValue });
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

  const handleSavePet = async () => {
    // 1. Validation Checks
    if (!user || !user.id) {
      Alert.alert("Error", "No user session found. Please log in again.");
      navigation.navigate('login');
      return;
    }

    if (!getPet.pname || !getPet.species || !getPet.breed || !getPet.gender || !getPet.age || !getPet.weight) {
      setErrorMsg("Please fill up all required fields");
      return;
    }

    if (getPet.breed === 'Other' && !getPet.customBreed.trim()) {
      setErrorMsg("Please specify the pet's breed");
      return;
    }

    setErrorMsg("");
    setLoadingForm(true);

    try {
      let finalImageUrl = null;

      // 2. Upload Image to Supabase Storage (Kung may pinili ang user)
      if (getPet.pimage) {
        const fileExt = getPet.pimage.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const response = await fetch(getPet.pimage);
        const blob = await response.blob();

        await supabase.storage.from('pet-images').upload(fileName, blob, { contentType: `image/${fileExt}` });
        const { data: urlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // 3. Save Pet Data to Database
      const { error: insertError } = await supabase.from('pets').insert([{
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
      
      // Babalik sa PetManagementPage kapag successful!
      navigation.goBack();

    } catch (error) {
      setErrorMsg(error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={MyStyleSheet.formHeader}>
        {/* Back Button - Babalik sa PetManagementPage */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={MyStyleSheet.petHeaderTitle}>Add pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.addPetScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Picture Upload */}
        <View style={MyStyleSheet.imagePickerContainer}>
          <View style={MyStyleSheet.mainProfileCircle}>
            {getPet.pimage ? (
              <Image source={{ uri: getPet.pimage }} style={MyStyleSheet.mainProfileImage} />
            ) : (
              <View style={[MyStyleSheet.mainProfileImage, { backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' }]}>
                 <Text style={{fontSize: 40}}>🐾</Text>
              </View>
            )}
            <TouchableOpacity style={MyStyleSheet.plusCircle} onPress={pickImage} disabled={loadingForm}>
              <Text style={MyStyleSheet.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {errorMsg ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 15 }}>{errorMsg}</Text> : null}

        <Text style={MyStyleSheet.formSectionTitle}>Basic information</Text>

        {/* Inputs */}
        <View style={MyStyleSheet.inputGroup}>
          <Text style={MyStyleSheet.fieldLabel}>Pet's name</Text>
          <TextInput value={getPet.pname} onChangeText={(val) => changeHandler("pname", val)} style={MyStyleSheet.styledInput} placeholder="Enter pet's name" placeholderTextColor="#AAA" editable={!loadingForm}/>

          <Text style={MyStyleSheet.fieldLabel}>Species</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={speciesList} labelField="label" valueField="value" placeholder="Select species" value={getPet.species} onChange={item => changeHandler("species", item.value)} disable={loadingForm} />

          <Text style={MyStyleSheet.fieldLabel}>Breed</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={filteredBreedsList} labelField="label" valueField="value" placeholder={getPet.species ? "Select breed" : "Select species first"} value={getPet.breed} onChange={item => changeHandler("breed", item.value)} disable={loadingForm || !getPet.species} search />

          {getPet.breed === 'Other' && (
            <TextInput value={getPet.customBreed} onChangeText={(val) => changeHandler("customBreed", val)} style={MyStyleSheet.styledInput} placeholder="Specify breed" placeholderTextColor="#AAA" editable={!loadingForm} />
          )}

          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={genderData} labelField="label" valueField="value" placeholder="Select gender" value={getPet.gender} onChange={item => changeHandler("gender", item.value)} disable={loadingForm} />

          <Text style={MyStyleSheet.fieldLabel}>Birthday</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="00/00/0000" placeholderTextColor="#AAA" value={getPet.age} onChangeText={(val) => changeHandler("age", val)} keyboardType="numeric" editable={!loadingForm} />

          <Text style={MyStyleSheet.fieldLabel}>Weight</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="Kg" placeholderTextColor="#AAA" value={getPet.weight} onChangeText={(val) => changeHandler("weight", val)} keyboardType="numeric" editable={!loadingForm} />

          <Text style={MyStyleSheet.fieldLabel}>Remarks</Text>
          <TextInput style={[MyStyleSheet.styledInput, { height: 100, textAlignVertical: 'top', paddingTop: 15 }]} placeholder="Notes or remarks" placeholderTextColor="#AAA" onChangeText={(val) => setPet({...getPet, remarks: val})} multiline={true} numberOfLines={4} editable={!loadingForm} />
        </View>

        <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { opacity: loadingForm ? 0.6 : 1 }]} onPress={handleSavePet} disabled={loadingForm}>
          {loadingForm ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.primaryActionBtnText}>Save</Text>}
        </TouchableOpacity>

      </ScrollView>

      {/* Spacer sa ilalim */}
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}