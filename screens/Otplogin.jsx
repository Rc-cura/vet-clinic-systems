import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'

// 1. Import Supabase & UserContext
import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext';

export default function Otplogin() {
  const opx = useNavigation();
  const route = useRoute(); // We need this to catch the email from LoginPage
  const { updateUser } = useUser(); 
  
  // 2. Get the email passed from the Login Page
  const email = route.params?.email || ""; 

  // 3. State for the OTP boxes and loading
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next box
    if (text.length !== 0 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join('');

    if (token.length < 6) {
      Alert.alert("Error", "Please enter the full 6-digit code.");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email is missing. Please return to login.");
      return;
    }

    setLoading(true);

    try {
      // 4. Verify the OTP using the 'email' type (Magic Link login flow)
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'email', 
      });

      if (error) throw error;

      if (data.session) {
        // 5. Fetch their profile data from the database
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileError) throw profileError;

        // 6. Save to global context and navigate to profilepic
        updateUser(profileData); 
        Alert.alert("Success", "Login complete!");
        opx.replace('dashboard'); 
      }
    } catch (error) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'magiclink', // Resend type for login
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
            <Image source={require('../public/logo.png')} style={{width: 70, height: 70}}/>
          </View>
        </View>

        <View style={MyStyleSheet.formCard}>
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => opx.goBack()} disabled={loading}>
            <Text style={{ fontSize: 20, color: '#666' }}>✕</Text>
          </TouchableOpacity>

          <Text style={[MyStyleSheet.cardTitle, { alignSelf: 'flex-start' }]}>OTP Verification</Text>
          <Text style={MyStyleSheet.otpInstruction}>
            Please enter the verification code sent to {email || "your email"} to securely sign in to your account.
          </Text>

          <View style={MyStyleSheet.otpRow}>
            {otp.map((digit, i) => (
              <TextInput 
                key={i} 
                ref={(el) => (inputRefs.current[i] = el)}
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