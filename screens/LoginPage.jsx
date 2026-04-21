import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext';

// 1. Import Supabase
import { supabase } from '../context/supabase'; 

export default function LoginPage() {
  const opx = useNavigation();
  const { updateUser } = useUser(); 
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
      // 2. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: getLogin.email,
        password: getLogin.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 3. Fetch the 'client' role and profile data from your table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw profileError;

        // 4. Update global context with the actual database data
        updateUser(profileData); 
        
        Alert.alert("Welcome back!", `Logged in as ${profileData.first_name}`);
        
        // Navigate to your main screen (e.g., 'home' or 'dashboard')
        opx.replace('dashboard'); 
      }

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
              <Text style={MyStyleSheet.buttonText}>{loading ? "LOGGING IN..." : "LOGIN"}</Text>
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