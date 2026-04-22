import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext';

// Import your Supabase client
import { supabase } from '../context/supabase'; 

export default function RegisterPage() {
  const opx = useNavigation();
  const { updateUser } = useUser(); 
  
  const [getUser, setUser] = useState({ 
    fname: "", 
    lname: "", 
    email: "", 
    contact: "", 
    password: "", 
    cpassword: "" 
  });
  
  const [Msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Strength Logic
  useEffect(() => {
    if (getUser.password.length > 0) {
      const hasUpperCase = /[A-Z]/.test(getUser.password);
      const hasNumber = /[0-9]/.test(getUser.password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(getUser.password);

      if (getUser.password.length < 9) {
        setMsg("Weak Password");
      } else if (!(hasUpperCase && hasNumber && hasSymbol)) {
        setMsg("Medium Password");
      } else {
        setMsg("Strong Password");
      }
    } else {
      setMsg("");
    }
  }, [getUser.password]);

  const changeHandler = (field, value) => {
    let filteredValue = value;
    if (field === "fname" || field === "lname") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); 
    }
    if (field === "contact") {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 11); 
    }
    setUser({ ...getUser, [field]: filteredValue });
  };

  const RegisteredAccs = async () => {
    const { fname, lname, email, contact, password, cpassword } = getUser;

    // Validation checks
    if (!fname || !lname || !email || !password || !cpassword) {
      setMsg("Please fill up all fields");
      return;
    }

    if (lname.trim().length < 2) {
      setMsg("Surname must be at least 2 characters long.");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setMsg("Must be a @gmail.com address");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 9 || !hasUpperCase || !hasNumber || !hasSymbol) {
      setMsg("Password must be Strong (Caps, Numbers, Symbols, 9+ chars)");
      return;
    }

    if (password !== cpassword) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    setMsg("Registering...");

    try {
      // 1. Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: `${fname} ${lname}`, 
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // 2. Save extra details to profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.user.id, 
              first_name: fname, 
              last_name: lname, 
              contact_number: contact,
              email: email,
              role: 'client'
            },
          ]);

        if (profileError) throw profileError;

        updateUser(getUser); 
        setMsg("");
        
        Alert.alert("Success", "Account created successfully! Check your email for the OTP.");
        opx.navigate("otp", { email: email });
      }

    } catch (error) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.landingMainContainer}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* Header Area with Logo */}
        <View style={MyStyleSheet.landingHeaderArea}>
          <Image source={require('../public/logo.png')} style={{ width: 160, height: 160 }} resizeMode="contain" />
        </View>

        {/* Registration Card Section */}
        <View style={[MyStyleSheet.landingBottomCard, { flex: 4 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            <Text style={[MyStyleSheet.landingWelcomeText, { fontSize: 40, marginBottom: 20 }]}>Sign Up</Text>

            {Msg ? (
              <Text style={{ 
                color: Msg.includes("Weak") || Msg.includes("match") ? "red" : "#2E3A91", 
                marginBottom: 15, textAlign: 'center', fontWeight: 'bold' 
              }}>
                {Msg}
              </Text>
            ) : null}

            {/* Input Fields */}
            <TextInput style={MyStyleSheet.styledInput} value={getUser.fname} onChangeText={(e) => changeHandler("fname", e)} placeholder='First Name' placeholderTextColor="#AAA" />
            <TextInput style={MyStyleSheet.styledInput} value={getUser.lname} onChangeText={(e) => changeHandler("lname", e)} placeholder='Last Name' placeholderTextColor="#AAA" />
            <TextInput style={MyStyleSheet.styledInput} value={getUser.email} onChangeText={(e) => changeHandler("email", e)} placeholder='Email Address' placeholderTextColor="#AAA" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={MyStyleSheet.styledInput} value={getUser.password} onChangeText={(e) => changeHandler("password", e)} placeholder='Password' placeholderTextColor="#AAA" secureTextEntry />
            <TextInput style={MyStyleSheet.styledInput} value={getUser.cpassword} onChangeText={(e) => changeHandler("cpassword", e)} placeholder='Confirm Password' placeholderTextColor="#AAA" secureTextEntry />

            {/* Main Sign Up Button */}
            <TouchableOpacity 
              style={[MyStyleSheet.landingSignUpBtn, { marginTop: 10, opacity: loading ? 0.7 : 1 }]} 
              onPress={RegisteredAccs}
              disabled={loading}
            >
              <Text style={MyStyleSheet.landingSignUpText}>
                {loading ? "CREATING..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Social Registration Section */}
            <View style={{ marginTop: 25, alignItems: 'center' }}>
              <Text style={{ color: '#AAA', marginBottom: 15 }}>Or sign up with</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Redirect */}
            <TouchableOpacity onPress={() => opx.navigate('login')} style={{ marginTop: 30, alignItems: 'center' }}>
              <Text style={{ color: '#AAA' }}>
                Already have an account? <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Login</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}