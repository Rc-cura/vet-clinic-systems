import { View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddPets() {
  const navigation = useNavigation()

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
            <Image 
              source={require('../public/bluepaw.svg')} 
              style={{ width: 60, height: 60 }} 
              resizeMode="contain"
            /> 
          </View>
          <TouchableOpacity style={MyStyleSheet.uploadOutlineBtn}>
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

          {/* Inline Age and Weight - FIXED OVERFLOW */}
          <View style={[MyStyleSheet.inlineInputs, { flexDirection: 'row', width: '100%' }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <TextInput 
                style={[MyStyleSheet.formInput, { width: '100%' }]} 
                placeholder="Age" 
                placeholderTextColor="#AAA" 
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput 
                style={[MyStyleSheet.formInput, { width: '100%' }]} 
                placeholder="Weight" 
                placeholderTextColor="#AAA" 
              />
            </View>
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