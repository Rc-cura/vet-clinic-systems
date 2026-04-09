import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Registered } from '../App'
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const opx = useNavigation();
  const { updateUser } = useUser(); 
  const [getLogin, setLogin] = useState({ email: "", password: "" });
  const [Msg, setMsg] = useState("");

  const changeHandler = (field, value) => {
    setLogin({ ...getLogin, [field]: value });
  };

  const loginAccount = () => {
    const userFound = Registered.find(item => item.email === getLogin.email && item.password === getLogin.password);
    
    if (getLogin.email === "" || getLogin.password === "") {
        setMsg("Please fill up all fields");
        return;
    }

    if (!userFound) {
      setMsg("Invalid email or password");
      return;
    }
    
    updateUser(userFound); 
    opx.navigate('otplogin'); 
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E3F2FD' }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* --- CSS BACKGROUND DECORATIONS (Matches Register Page) --- */}
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

          <View style={[MyStyleSheet.formCard, { 
            marginHorizontal: 20, 
            borderColor: '#FFC1CC', 
            borderWidth: 1.5,
            elevation: 8,
            shadowColor: '#4E5DB2',
            shadowOpacity: 0.1,
            shadowRadius: 10
          }]}>
            <Text style={[MyStyleSheet.cardTitle]}>Login</Text>

            {Msg ? (
              <Text style={{ alignSelf: "center", color: "red", marginBottom: 10, fontWeight: 'bold' }}>{Msg}</Text>
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

            <TouchableOpacity style={[MyStyleSheet.regButton, { backgroundColor: '#4E5DB2' }]} onPress={() => loginAccount()}>
              <Text style={MyStyleSheet.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={MyStyleSheet.socialSection}>
            <View style={MyStyleSheet.dividerRow}>
              <View style={MyStyleSheet.line} />
              <Text style={MyStyleSheet.orText}>or login with</Text>
              <View style={MyStyleSheet.line} />
            </View>

            {/* FIXED: Social icons now sit beside each other */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>FB</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[MyStyleSheet.socialIcon, { backgroundColor: '#FFC1CC', marginHorizontal: 10 }]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ap</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => opx.navigate('register')}>
              <Text style={MyStyleSheet.footerText}>
                Don't have an account? <Text style={{ fontWeight: 'bold' }}>Signup</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}