import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'

// 1. Import your Supabase client
import { supabase } from '../context/supabase'; 

export default function Otp() {
  const opx = useNavigation();
  const route = useRoute();
  
  // 2. Get the email passed from the Register Page
  const email = route.params?.email || ""; 

  // 3. State for the 6 boxes and loading indicator
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // 4. Handle typing and auto-focusing the next box
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // If they typed a number and it's not the last box, move to the next one
    if (text.length !== 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 5. The Verification Function
  const handleVerify = async () => {
    const token = otp.join(''); // Combine the 6 boxes into one string (e.g., "123456")

    if (token.length < 6) {
      Alert.alert("Error", "Please enter the full 6-digit code.");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email is missing. Please register again.");
      return;
    }

    setLoading(true);

    try {
      // Send the code to Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'signup', // 'signup' because they are verifying a new account
      });

      if (error) throw error;

      if (data.session || data.user) {
        Alert.alert("Success", "Account verified successfully!");
        opx.replace('login'); // Send them to login
      }
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Optional: Resend Code Function
  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      Alert.alert("Sent", "A new code has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>

        <View style={MyStyleSheet.regHeader}>
          <View>
            <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
            <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
          </View>
          <View style={MyStyleSheet.logoCircleSmall}>
            <Image source={require('../public/logo.png')} style={{width: 70, height: 70}} />
          </View>
        </View>

        <View style={MyStyleSheet.formCard}>

          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => opx.goBack()}>
            <Text style={{ fontSize: 20, color: '#666' }}>✕</Text>
          </TouchableOpacity>

          <Text style={[MyStyleSheet.cardTitle, { alignSelf: 'flex-start' }]}>OTP Verification</Text>
          <Text style={MyStyleSheet.otpInstruction}>
            Please enter the OTP sent to {email || "your registered email"} to complete your verification.
          </Text>

          {/* 7. The 6 OTP Input Boxes */}
          <View style={MyStyleSheet.otpRow}>
            {otp.map((digit, i) => (
              <TextInput 
                key={i} 
                ref={(el) => (inputRefs.current[i] = el)} // Attach the ref for auto-focus
                style={MyStyleSheet.otpInput} 
                keyboardType="number-pad" 
                maxLength={1} 
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
              />
            ))}
          </View>

          <View style={MyStyleSheet.timerRow}>
            <Text style={MyStyleSheet.timerText}>Remaining Time: 00:00s</Text>
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={MyStyleSheet.resendText}>Didn't get the code? <Text style={{fontWeight: 'bold'}}>Resend</Text></Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={MyStyleSheet.cancelBtn} onPress={() => opx.goBack()} disabled={loading}>
            <Text style={MyStyleSheet.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[MyStyleSheet.regButton, { opacity: loading ? 0.7 : 1 }]} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.buttonText}>Verify</Text>}
          </TouchableOpacity>
        </View>

    </SafeAreaView>
  )
}