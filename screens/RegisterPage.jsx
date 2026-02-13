import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Registered } from '../App'
import { useUser } from '../context/UserContext';

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

  const changeHandler = (field, value) => {
    let filteredValue = value;

    // 1. Logic for Names (Letters only)
    if (field === "fname" || field === "lname") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, ""); // Removes anything not a letter or space
    }

    // 2. Logic for Contact (Numbers only, max 11 digits)
    if (field === "contact") {
      filteredValue = value.replace(/[^0-9]/g, "").slice(0, 11); // Removes non-numbers and limits length
    }

    // 3. Update the state with filtered value
    setUser({ ...getUser, [field]: filteredValue });

    // Password Strength Logic
    if (field === "password") {
      if (filteredValue.length === 0) {
        setMsg("");
      } else if (filteredValue.length <= 3) {
        setMsg("Weak Password");
      } else if (filteredValue.length <= 8) {
        setMsg("Medium Password");
      } else {
        setMsg("Strong Password");
      }
    }

    // Email Validation Logic
    if (field === "email") {
      if (filteredValue.length > 0 && !filteredValue.toLowerCase().endsWith("@gmail.com")) {
        setMsg("Must be a @gmail.com address");
      } else {
        setMsg("");
      }
    }
  };

  const RegisteredAccs = () => {
    // Basic validation for empty fields
    if (getUser.fname === "" || getUser.email === "" || getUser.contact === "" || getUser.password === "" || getUser.lname === "" || getUser.cpassword === "") {
      setMsg("Please fill up all fields");
      return;
    }

    if (getUser.password !== getUser.cpassword) {
      setMsg("Password and Confirm Password Not Match");
      return;
    }

    const Exists = Registered.find((item) => item.email === getUser.email);
    if (Exists) {
      setMsg("Email already exists");
      return;
    }

    Registered.push(getUser);
    updateUser(getUser); 
    opx.replace("otp");
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/500' }}
          style={MyStyleSheet.bgImage}
          resizeMode="cover"
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          >
            <View style={MyStyleSheet.regHeader}>
              <View>
                <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
                <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
              </View>
              <View style={MyStyleSheet.logoCircleSmall}>
                <Image source={require('../public/logo.svg')} style={{ width: 70, height: 70 }} />
              </View>
            </View>

            <View style={MyStyleSheet.formCard}>
              <Text style={MyStyleSheet.cardTitle}>Create an account</Text>
              <Text style={{ alignSelf: "center", color: Msg === "Strong Password" ? "green" : "red", marginBottom: 10 }}>{Msg}</Text>

              {/* Added 'value' prop so the TextInput reflects the filtered text */}
              <TextInput style={MyStyleSheet.input} value={getUser.fname} onChangeText={(e) => changeHandler("fname", e)} placeholder='Enter First Name' />
              <TextInput style={MyStyleSheet.input} value={getUser.lname} onChangeText={(e) => changeHandler("lname", e)} placeholder='Enter Last Name' />
              <TextInput style={MyStyleSheet.input} value={getUser.email} onChangeText={(e) => changeHandler("email", e)} placeholder='Enter Email' keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={MyStyleSheet.input} value={getUser.contact} onChangeText={(e) => changeHandler("contact", e)} placeholder='Enter Contact Number' keyboardType="phone-pad" />
              
              <TextInput style={MyStyleSheet.input} onChangeText={(e) => changeHandler("password", e)} placeholder='Enter Password' secureTextEntry />
              <TextInput style={MyStyleSheet.input} onChangeText={(e) => changeHandler("cpassword", e)} placeholder='Confirm Password' secureTextEntry />

              <TouchableOpacity style={MyStyleSheet.regButton} onPress={RegisteredAccs}>
                <Text style={MyStyleSheet.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <View style={MyStyleSheet.socialSection}>
              <View style={MyStyleSheet.dividerRow}>
                <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or register with</Text><View style={MyStyleSheet.line} />
              </View>

              <View style={MyStyleSheet.iconRow}>
                <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>FB</Text></TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>G</Text></TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>Ap</Text></TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => opx.navigate('login')}>
                <Text style={MyStyleSheet.footerText}>Already have an account? <Text style={{ fontWeight: 'bold', color: '#4E5DB2' }}>Login</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}