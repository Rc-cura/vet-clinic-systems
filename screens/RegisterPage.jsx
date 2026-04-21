import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext';

// 1. Import your Supabase client
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
  const [loading, setLoading] = useState(false); // Added a loading state

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

    if (!fname || !lname || !email || !contact || !password || !cpassword) {
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
      // 3. Create the user in Supabase Auth
const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: `${fname} ${lname}`, // This shows up in the Auth tab
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // 4. Save extra details to your profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.user.id, // Links the profile to the auth account
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
        
        // 5. Navigate to the next screen on success
        Alert.alert("Success", "Account created successfully!");
        opx.replace("otp"); 
      }

    } catch (error) {
      setMsg(error.message);
      console.error("Registration Error:", error.message);
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
              {/* Remember to use the .png version if you converted it! */}
              <Image source={require('../public/logo.png')} style={{ width: 60, height: 60 }} />
            </View>
          </View>

          <View style={MyStyleSheet.formCard}>
            <Text style={MyStyleSheet.cardTitle}>Create Account</Text>
            
            {Msg ? (
              <Text style={{ 
                alignSelf: "center", 
                color: Msg.includes("Success") || Msg.includes("Strong") ? "#2E7D32" : "#C62828", 
                marginBottom: 15,
                fontSize: 13,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {Msg}
              </Text>
            ) : null}

            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>First Name</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.fname} onChangeText={(e) => changeHandler("fname", e)} placeholder='Enter First Name' placeholderTextColor="#A9A9A9" />
            </View>
            
            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>Last Name</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.lname} onChangeText={(e) => changeHandler("lname", e)} placeholder='Enter Last Name' placeholderTextColor="#A9A9A9" />
            </View>
            
            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>Email Address</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.email} onChangeText={(e) => changeHandler("email", e)} placeholder='example@gmail.com' placeholderTextColor="#A9A9A9" keyboardType="email-address" autoCapitalize="none" />
            </View>
            
            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>Contact Number</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.contact} onChangeText={(e) => changeHandler("contact", e)} placeholder='09123456789' placeholderTextColor="#A9A9A9" keyboardType="phone-pad" />
            </View>
            
            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>Password</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.password} onChangeText={(e) => changeHandler("password", e)} placeholder='••••••••' placeholderTextColor="#A9A9A9" secureTextEntry />
            </View>
            
            <View style={MyStyleSheet.inputGroup}>
              <Text style={MyStyleSheet.label}>Confirm Password</Text>
              <TextInput style={MyStyleSheet.input} value={getUser.cpassword} onChangeText={(e) => changeHandler("cpassword", e)} placeholder='••••••••' placeholderTextColor="#A9A9A9" secureTextEntry />
            </View>

            <TouchableOpacity 
              style={[MyStyleSheet.regButton, { opacity: loading ? 0.7 : 1 }]} 
              onPress={RegisteredAccs}
              disabled={loading}
            >
              <Text style={MyStyleSheet.buttonText}>
                {loading ? "CREATING..." : "REGISTER"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={MyStyleSheet.socialSection}>
            <View style={MyStyleSheet.dividerRow}>
              <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or register with</Text><View style={MyStyleSheet.line} />
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>FB</Text></TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>G</Text></TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { marginHorizontal: 10 }]}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Ap</Text></TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => opx.navigate('login')}>
              <Text style={MyStyleSheet.footerText}>Already have an account? <Text style={{ fontWeight: 'bold', color: '#4E5DB2' }}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}