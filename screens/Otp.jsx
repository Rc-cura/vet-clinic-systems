import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native' // Removed useRoute
import MyStyleSheet from '../styles/MyStyleSheet'

export default function Otp() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/500' }} 
        style={MyStyleSheet.bgImage}
        resizeMode="cover"
      >
        <View style={MyStyleSheet.regHeader}>
          <View>
            <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
            <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
          </View>
          <View style={MyStyleSheet.logoCircleSmall}><Image source={require('../public/logo.svg')} style={{width: 70, height: 70}} /></View>
        </View>

        <View style={MyStyleSheet.formCard}>
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => opx.goBack()}>
            <Text style={{ fontSize: 20, color: '#666' }}>✕</Text>
          </TouchableOpacity>

          <Text style={[MyStyleSheet.cardTitle, { alignSelf: 'flex-start' }]}>OTP Verification</Text>
          <Text style={MyStyleSheet.otpInstruction}>
            Please enter the OTP sent to your registered email to complete your verification.
          </Text>

          <View style={MyStyleSheet.otpRow}>
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <TextInput key={i} style={MyStyleSheet.otpInput} keyboardType="number-pad" maxLength={1} />
            ))}
          </View>

          <View style={MyStyleSheet.timerRow}>
            <Text style={MyStyleSheet.timerText}>Remaining Time: 00:00s</Text>
            <TouchableOpacity><Text style={MyStyleSheet.resendText}>Didn't get the code? <Text style={{fontWeight: 'bold'}}>Resend</Text></Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={MyStyleSheet.cancelBtn} onPress={() => opx.goBack()}>
            <Text style={MyStyleSheet.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          {/* CLEAN NAVIGATION: Context already has the user if you saved it in RegisterPage */}
          <TouchableOpacity style={MyStyleSheet.regButton} onPress={() => opx.navigate('login')}>
            <Text style={MyStyleSheet.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}