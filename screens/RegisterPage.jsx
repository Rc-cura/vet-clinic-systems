import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function RegisterPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Background Image (The paws and pink splashes) */}
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/500' }} // Replace with your actual bg image
        style={MyStyleSheet.bgImage}
        resizeMode="cover"
      >
        {/* Header Section */}
        <View style={MyStyleSheet.regHeader}>
          <View>
            <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
            <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
          </View>
          <View style={MyStyleSheet.logoCircleSmall}>
             <Image source={require('../public/logo.svg')} style={{width: 70, height: 70}} />
          </View>
        </View>

        {/* Floating Card */}
        <View style={MyStyleSheet.formCard}>
          <Text style={MyStyleSheet.cardTitle}>Create an account</Text>
          
          <TextInput style={MyStyleSheet.input} placeholder='Enter First Name'/>
          <TextInput style={MyStyleSheet.input} placeholder='Enter Last Name'/>
          <TextInput style={MyStyleSheet.input} placeholder='Enter Email'/>
          <TextInput style={MyStyleSheet.input} placeholder='Enter Password' secureTextEntry/>
          <TextInput style={MyStyleSheet.input} placeholder='Confirm Password' secureTextEntry/>

          <TouchableOpacity style={MyStyleSheet.regButton} onPress={() => opx.navigate('otp')}>
            <Text style={MyStyleSheet.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={MyStyleSheet.socialSection}>
          <View style={MyStyleSheet.dividerRow}>
            <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or register with</Text><View style={MyStyleSheet.line} />
          </View>
          
          <View style={MyStyleSheet.iconRow}>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>FB</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>G</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>Ap</Text></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => opx.navigate('login')}>
            <Text style={MyStyleSheet.footerText}>Already have an account? <Text style={{fontWeight: 'bold', color: '#4E5DB2'}}>Login</Text></Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
}