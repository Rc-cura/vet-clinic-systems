import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function LoginPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/500' }} // Use your background asset here
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

        {/* Floating Login Card */}
        <View style={MyStyleSheet.formCard}>
          <Text style={MyStyleSheet.cardTitle}>Login</Text>
          
          <TextInput style={MyStyleSheet.input} placeholder='Enter Email' keyboardType="email-address" autoCapitalize="none"/>
          <TextInput style={MyStyleSheet.input} placeholder='Enter Password' secureTextEntry/>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
            <Text style={MyStyleSheet.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.regButton} onPress={() => opx.navigate('otplogin')}>
            <Text style={MyStyleSheet.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Social Footer */}
        <View style={MyStyleSheet.socialSection}>
          <View style={MyStyleSheet.dividerRow}>
            <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or login with</Text><View style={MyStyleSheet.line} />
          </View>
          
          <View style={MyStyleSheet.iconRow}>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>FB</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>G</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>Ap</Text></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => opx.navigate('register')}>
            <Text style={MyStyleSheet.footerText}>Don't have an account? <Text style={{fontWeight: 'bold', color: '#4E5DB2'}}>Signup</Text></Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
}