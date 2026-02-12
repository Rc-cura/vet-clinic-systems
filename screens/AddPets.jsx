import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddPets() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Custom Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={MyStyleSheet.backBtn}>
          {/* Back Arrow Replacement */}
          <Image source={require('../public/back_arrow.svg')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Add Pet</Text>
        <View style={{ width: 40 }} /> {/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={MyStyleSheet.formScrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Upload Section */}
        <View style={MyStyleSheet.uploadContainer}>
          <View style={MyStyleSheet.profileCircleBlack}>
            {/* 🐱 Emoji replaced with SVG */}
            <Image 
              source={require('../public/bluepaw.svg')} 
              style={{ width: 60, height: 60 }} 
              resizeMode="contain"
            /> 
          </View>
          <TouchableOpacity style={MyStyleSheet.uploadOutlineBtn}>
            {/* 📤 Emoji replaced with SVG */}
            <Image 
              source={require('../public/upload.svg')} 
              style={{ width: 20, height: 20, marginRight: 8 }} 
            />
            <Text style={MyStyleSheet.uploadBtnLabel}>Upload Image</Text>
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

        {/* Continue Button */}
        <TouchableOpacity style={MyStyleSheet.continuePrimaryBtn} onPress={() => navigation.navigate('addpetscont')}>
          <Text style={MyStyleSheet.continueBtnText}>Continue</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}