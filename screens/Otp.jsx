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
    const token = otp.join(''); 

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
        type: 'signup', 
      });

      if (error) throw error;

      if (data.session || data.user) {
        Alert.alert("Success", "Account verified successfully!");
        opx.replace('login'); 
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
    <SafeAreaView style={MyStyleSheet.landingMainContainer}>
        
        {/* Header Area with Logo */}
        <View style={MyStyleSheet.landingHeaderArea}>
          <Image source={require('../public/logo.png')} style={{width: 160, height: 160}} resizeMode="contain" />
        </View>

        {/* White Card Section */}
        <View style={[MyStyleSheet.landingBottomCard, { flex: 2.5 }]}>
          
          <Text style={[MyStyleSheet.landingWelcomeText, { fontSize: 40, marginBottom: 15 }]}>OTP Verification</Text>
          
          <Text style={{ color: '#AAA', fontSize: 14, lineHeight: 20, marginBottom: 40 }}>
            Please enter the OTP sent to your registered email to complete your verification. <Text style={{ color: '#AAA', fontWeight: 'bold' }}>{email}</Text>
          </Text>

          {/* 7. The 6 OTP Input Boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            {otp.map((digit, i) => (
              <TextInput 
                key={i} 
                ref={(el) => (inputRefs.current[i] = el)} 
                style={MyStyleSheet.otpStyledInput} 
                keyboardType="number-pad" 
                maxLength={1} 
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
              />
            ))}
          </View>

          <Text style={{ textAlign: 'center', color: '#CCC', marginBottom: 60 }}>Remaining Time: 00:00s</Text>

          <TouchableOpacity 
            style={MyStyleSheet.landingSignUpBtn} 
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.landingSignUpText}>Confirm</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 20, alignItems: 'center' }} 
            onPress={() => opx.goBack()} 
            disabled={loading}
          >
            <Text style={{ color: '#2E3A91', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 'auto', marginBottom: 20, alignItems: 'center' }}>
             <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={{ color: '#AAA' }}>Didn’t get the code? <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Resend code</Text></Text>
            </TouchableOpacity>
          </View>

        </View>
    </SafeAreaView>
  )
}