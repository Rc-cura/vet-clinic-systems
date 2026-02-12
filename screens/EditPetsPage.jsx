import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function EditPetsPage() {
  const opx = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          {/* Back Arrow SVG */}
          <Image 
            source={require('../public/back_arrow.svg')} 
            style={{ width: 24, height: 24 }} 
          />
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Edit Pet Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        
        {/* Profile Image with Camera Icon Overlay */}
        <View style={MyStyleSheet.editPhotoContainer}>
          <View style={MyStyleSheet.sumBigCircle}>
            {/* Main Pet Image SVG */}
            <Image 
              source={require('../public/blackpaw.svg')} 
              style={{ width: 80, height: 80 }} 
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={MyStyleSheet.cameraIconOverlay}>
            {/* Camera Icon SVG */}
            <Image 
              source={require('../public/camera.svg')} 
              style={{ width: 20, height: 20 }} 
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>

        {/* Input Fields Group */}
        <View style={MyStyleSheet.inputGroup}>
          <TextInput style={MyStyleSheet.formInput} placeholder="Pet's name" placeholderTextColor="#AAA" />
          <TextInput style={MyStyleSheet.formInput} placeholder="Species" placeholderTextColor="#AAA" />
          <TextInput style={MyStyleSheet.formInput} placeholder="Breed" placeholderTextColor="#AAA" />
          <TextInput style={MyStyleSheet.formInput} placeholder="Gender" placeholderTextColor="#AAA" />

          {/* Inline Age and Weight */}
          <View style={MyStyleSheet.inlineInputs}>
            <TextInput style={[MyStyleSheet.formInput, { flex: 1, marginRight: 10 }]} placeholder="Age" placeholderTextColor="#AAA" />
            <TextInput style={[MyStyleSheet.formInput, { flex: 1, width:10 }]} placeholder="Weight" placeholderTextColor="#AAA" />
          </View>

          <TextInput 
            style={[MyStyleSheet.formInput, MyStyleSheet.textArea]} 
            placeholder="Remarks" 
            placeholderTextColor="#AAA"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[MyStyleSheet.primaryBlueBtn, { marginTop: 30 }]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={MyStyleSheet.primaryBlueBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SUCCESS MODAL */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.modalContainer}>
            {/* Success Checkmark SVG  <Image 
              source={require('../public/success_check.svg')} 
              style={{ width: 50, height: 50, marginBottom: 15, alignSelf: 'center' }} 
            />*/}
           
            <Text style={MyStyleSheet.modalTitle}>Successfully Edited Pet Profile</Text>
            <TouchableOpacity 
              style={MyStyleSheet.modalViewProfileBtn}
              onPress={() => {
                setModalVisible(false);
                opx.navigate('viewpets');
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