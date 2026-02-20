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
    <SafeAreaView style={MyStyleSheet.container}>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40, paddingTop: 20 }}>


        <View style={MyStyleSheet.editPhotoContainer}>

          <View style={MyStyleSheet.sumBigCircle}>

             {pet?.pimage ? (
                <Image  source={{ uri: pet.pimage }}  style={{ width: '100%', height: '100%', borderRadius: 50 }} />
             ) : (
                <Image source={require('../public/blackpaw.svg')}style={{ width: 80, height: 80 }} resizeMode="contain"/>
             )}
          </View>
          <TouchableOpacity style={MyStyleSheet.cameraIconOverlay}>
            <Image source={require('../public/camera.svg')} style={{ width: 20, height: 20 }} resizeMode='contain'/>
          </TouchableOpacity>
        </View>

        <View style={MyStyleSheet.inputGroup}>

          <TextInput style={MyStyleSheet.formInput}  placeholder="Pet's name"  value={pname} onChangeText={setPname} placeholderTextColor="#AAA" />
          <TextInput style={MyStyleSheet.formInput} placeholder="Species" value={species} onChangeText={setSpecies} placeholderTextColor="#AAA" />
          <TextInput style={MyStyleSheet.formInput}  placeholder="Breed"  value={breed} onChangeText={setBreed}  placeholderTextColor="#AAA" />
          <TextInput  style={MyStyleSheet.formInput} placeholder="Gender"  value={gender} onChangeText={setGender} placeholderTextColor="#AAA" />


          <View style={[MyStyleSheet.inlineInputs, { flexDirection: 'row', width: '100%' }]}>

            <View style={{ flex: 1, marginRight: 10 }}>

              <TextInput style={[MyStyleSheet.formInput, { width: '100%' }]} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor="#AAA"/>
            </View>

            <View style={{ flex: 1 }}>

              <TextInput style={[MyStyleSheet.formInput, { width: '100%' }]} placeholder="Weight" value={weight}  onChangeText={setWeight} keyboardType="numeric" placeholderTextColor="#AAA" />
            </View>

          </View>

          <TextInput style={[MyStyleSheet.formInput, MyStyleSheet.textArea]}  placeholder="Remarks" value={remarks} onChangeText={setRemarks}  placeholderTextColor="#AAA" multiline={true} numberOfLines={4}/>
        </View>

    
        <TouchableOpacity style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]} onPress={handleSave}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Save</Text>

        </TouchableOpacity>

      </ScrollView>


      <Modal animationType="fade" transparent={true} visible={modalVisible}>

        <View style={MyStyleSheet.modalOverlay}>

          <View style={MyStyleSheet.modalContainer}>

            <Text style={MyStyleSheet.modalTitle}>Successfully Edited Pet Profile</Text>

            <TouchableOpacity style={MyStyleSheet.modalViewProfileBtn}  onPress={() => {

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

    </SafeAreaView>
  )
}