import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' 
import MyStyleSheet from '../styles/MyStyleSheet'

// 1. Import Supabase & UserContext
import { supabase } from '../context/supabase'; 
import { useUser } from '../context/UserContext';

export default function Otplogin() {
  const opx = useNavigation();
  const route = useRoute(); 
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

        // 6. Save to global context and navigate to dashboard
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
        type: 'magiclink', 
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
      
      {/* Light Blue Header with Logo */}
      <View style={MyStyleSheet.landingHeaderArea}>
        <Image 
          source={require('../public/logo.png')} 
          style={{ width: 160, height: 160 }} 
          resizeMode="contain" 
        />
      </View>

      {/* White Card Section */}
      <View style={[MyStyleSheet.landingBottomCard, { flex: 2.5 }]}>
        
        <Text style={[MyStyleSheet.landingWelcomeText, { fontSize: 40, marginBottom: 15 }]}>OTP Verification</Text>
        
        <Text style={{ color: '#AAA', fontSize: 14, lineHeight: 20, marginBottom: 40 }}>
          Please enter the verification code sent to <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>{email}</Text> to securely sign in to your account.
        </Text>

        {/* 6-Digit OTP Boxes */}
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

        {/* Primary Confirm Button */}
        <TouchableOpacity 
          style={MyStyleSheet.landingSignUpBtn} 
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={MyStyleSheet.landingSignUpText}>Confirm</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Text Button */}
        <TouchableOpacity 
          style={{ marginTop: 20, alignItems: 'center' }} 
          onPress={() => opx.goBack()} 
          disabled={loading}
        >
          <Text style={{ color: '#2E3A91', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
        </TouchableOpacity>

        {/* Bottom Resend Link */}
        <View style={{ marginTop: 'auto', marginBottom: 20, alignItems: 'center' }}>
           <TouchableOpacity onPress={handleResend} disabled={loading}>
            <Text style={{ color: '#AAA' }}>
              Didn’t get the code? <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Resend code</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}