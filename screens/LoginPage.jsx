import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

// 1. Import Supabase
import { supabase } from '../context/supabase'; 

export default function LoginPage() {
  const opx = useNavigation();
  const [getLogin, setLogin] = useState({ email: "", password: "" });
  const [Msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = (field, value) => {
    setLogin({ ...getLogin, [field]: value });
  };

  // ================= WEB LOGIC INTEGRATION =================
  const loginAccount = async () => {
    if (getLogin.email === "" || getLogin.password === "") {
        setMsg("Please fill up all fields");
        return;
    }
    
    setLoading(true);
    setMsg("");
    
    try {
      // 1. Check password credentials
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: getLogin.email,
        password: getLogin.password,
      });

      // Ignore "Email not confirmed" base sa web logic mo
      if (signInError && !signInError.message.includes('Email not confirmed')) {
        throw signInError;
      }

      // 2. THE BOUNCER: Check if the user's profile is active
      if (authData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_active')
          .eq('id', authData.user.id)
          .single();

        if (profile && profile.is_active === false) {
          await supabase.auth.signOut(); // Kick them out instantly
          throw new Error("Your account has been disabled. Please contact the administrator.");
        }
      }

      // 3. Proceed with OTP if the account is active
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: getLogin.email,
        options: { shouldCreateUser: false }
      });

      if (otpError) throw otpError;

      Alert.alert("Success", `An OTP has been sent to ${getLogin.email}`);
      opx.navigate('otplogin', { email: getLogin.email }); 
      
    } catch (error) {
      // Custom error message cleaner base sa web logic mo
      if (!error.message || !error.message.startsWith('For security purposes')) {
        setMsg(error.message);
      } else {
        setMsg('');
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD FUNCTION =================
  const handleForgotPassword = async () => {
    if (getLogin.email === "") {
      setMsg("Please enter your email first to reset your password.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(getLogin.email);
      if (error) throw error;
      Alert.alert(
        "Check your email", 
        `Password reset instructions have been sent to ${getLogin.email}`
      );
    } catch (error) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.landingMainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* 1. Header Area with Logo */}
        <View style={MyStyleSheet.landingHeaderArea}>
          <Image 
            source={require('../public/logo.png')} 
            style={{ width: 180, height: 180 }} 
            resizeMode="contain"
          />
        </View>

        {/* 2. White Login Card */}
        <View style={[MyStyleSheet.landingBottomCard, { flex: 2.5 }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            <Text style={[MyStyleSheet.landingWelcomeText, { marginBottom: 30, fontSize: 40 }]}>Sign In</Text>

            {Msg ? (
              <Text style={{ color: "red", marginBottom: 15, textAlign: 'center', paddingHorizontal: 10 }}>{Msg}</Text>
            ) : null}

            {/* Email Input */}
            <TextInput 
              style={MyStyleSheet.styledInput} 
              onChangeText={(e) => changeHandler("email", e)} 
              placeholder='Email' 
              placeholderTextColor="#AAA"
              keyboardType="email-address" 
              autoCapitalize="none" 
            />

            {/* Password Input */}
            <TextInput 
              style={MyStyleSheet.styledInput} 
              onChangeText={(e) => changeHandler("password", e)} 
              placeholder='Password' 
              placeholderTextColor="#AAA"
              secureTextEntry 
            />

            {/* Forgot Password Button */}
            <TouchableOpacity 
              style={{ alignSelf: 'flex-end', marginBottom: 30 }}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={{ color: '#2E3A91', fontWeight: '600' }}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={MyStyleSheet.landingSignUpBtn} 
              onPress={loginAccount}
              disabled={loading}
            >
              <Text style={MyStyleSheet.landingSignUpText}>
                {loading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>

            {/* Google Sign In Button */}
            <TouchableOpacity 
              style={[MyStyleSheet.landingSignInBtn, { marginTop: 15, flexDirection: 'row' }]}
              onPress={() => Alert.alert("Notice", "OAuth login requires expo-auth-session configuration on mobile.")}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} 
                style={{ width: 20, height: 20, marginRight: 10 }} 
              />
              <Text style={MyStyleSheet.landingSignInText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => opx.navigate('register')}
              style={{ marginTop: 40, alignItems: 'center' }}
            >
              <Text style={{ color: '#AAA' }}>
                Don’t have an account? <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}