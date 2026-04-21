import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

// 1. Import Supabase
import { supabase } from '../context/supabase'; 

export default function LoginPage() {
  const opx = useNavigation();
  
  // We don't need useUser() here anymore because Otplogin.jsx handles it now!
  const [getLogin, setLogin] = useState({ email: "", password: "" });
  const [Msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (field, value) => {
    setLogin({ ...getLogin, [field]: value });
  };

  const loginAccount = async () => {
    if (getLogin.email === "" || getLogin.password === "") {
        setMsg("Please fill up all fields");
        return;
    }

    setLoading(true);
    setMsg("");

    try {
      // 1. Verify the Password is correct first
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: getLogin.email,
        password: getLogin.password,
      });

      if (authError) throw authError;

      // 2. Clear the immediate session so Supabase allows an OTP to be sent
      await supabase.auth.signOut();

      // 3. THIS WAS MISSING: Actually tell Supabase to send the OTP email!
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: getLogin.email,
        options: {
          shouldCreateUser: false, // Don't create a new account by accident
        }
      });

      if (otpError) throw otpError;

      Alert.alert("Password Correct!", `An OTP has been sent to ${getLogin.email}`);
        
      // 4. Navigate to the OTP screen to finish logging in
      opx.navigate('otplogin', { email: getLogin.email }); 

    } catch (error) {
      setMsg(error.message);
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E3F2FD' }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFC1CC', opacity: 0.3 }} />
        <View style={{ position: 'absolute', bottom: 100, left: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: '#4E5DB2', opacity: 0.1 }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          <View style={MyStyleSheet.regHeader}>
            <View>
              <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
              <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
            </View>
            <View style={MyStyleSheet.logoCircleSmall}>
              <Image source={require('../public/logo.png')} style={{ width: 70, height: 70 }} />
            </View>
          </View>

          <View style={[MyStyleSheet.formCard, { marginHorizontal: 20, borderColor: '#FFC1CC', borderWidth: 1.5, elevation: 8 }]}>
            <Text style={[MyStyleSheet.cardTitle]}>Login</Text>

            {Msg ? (
              <Text style={{ alignSelf: "center", color: "red", marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>{Msg}</Text>
            ) : null}

            <View style={MyStyleSheet.inputGroup}>
              <Text style={[MyStyleSheet.label]}>Email Address</Text>
              <TextInput 
                style={MyStyleSheet.input} 
                onChangeText={(e) => changeHandler("email", e)} 
                placeholder='Enter Email' 
                placeholderTextColor="#A9A9A9"
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
            </View>

            <View style={MyStyleSheet.inputGroup}>
              <Text style={[MyStyleSheet.label]}>Password</Text>
              <TextInput 
                style={MyStyleSheet.input} 
                onChangeText={(e) => changeHandler("password", e)} 
                placeholder='Enter Password' 
                placeholderTextColor="#A9A9A9"
                secureTextEntry 
              />
            </View>

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
              <Text style={[MyStyleSheet.forgotText]}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[MyStyleSheet.regButton, { backgroundColor: '#4E5DB2', opacity: loading ? 0.7 : 1 }]} 
              onPress={loginAccount}
              disabled={loading}
            >
              <Text style={MyStyleSheet.buttonText}>{loading ? "VERIFYING..." : "LOGIN"}</Text>
            </TouchableOpacity>
          </View>

          <View style={MyStyleSheet.socialSection}>
            <View style={MyStyleSheet.dividerRow}>
              <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or login with</Text><View style={MyStyleSheet.line} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>FB</Text></TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>G</Text></TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Ap</Text></TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => opx.navigate('register')}>
              <Text style={MyStyleSheet.footerText}>Don't have an account? <Text style={{ fontWeight: 'bold' }}>Signup</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}