import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native'
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

  // 1. You need this function to handle typing
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
    
    updateUser(userFound); // Saves to Context
    opx.navigate('otplogin'); 
  };

  // REMOVED the extra " }; " that was here

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/500' }} 
        style={MyStyleSheet.bgImage}
        resizeMode="cover"
      >
        {/* Header Section */}
        <View style={MyStyleSheet.regHeader}>
          <View>
            <Text style={MyStyleSheet.clinicName}>ST JOSEPH</Text>
            <Text style={MyStyleSheet.clinicSub}>VETERINARY CLINIC</Text>
          </View>
          <View style={MyStyleSheet.logoCircleSmall}>
            <Image source={require('../public/logo.svg')} style={{ width: 70, height: 70 }} />
          </View>
        </View>

        {/* Floating Login Card */}
        <View style={MyStyleSheet.formCard}>
          <Text style={MyStyleSheet.cardTitle}>Login</Text>
          <Text style={{ alignSelf: "center", color: "red", marginBottom: 10 }}>{Msg}</Text>

          <TextInput 
            style={MyStyleSheet.input} 
            onChangeText={(e) => changeHandler("email", e)} 
            placeholder='Enter Email' 
            keyboardType="email-address" 
            autoCapitalize="none" 
          />
          <TextInput 
            style={MyStyleSheet.input} 
            onChangeText={(e) => changeHandler("password", e)} 
            placeholder='Enter Password' 
            secureTextEntry 
          />

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
            <Text style={MyStyleSheet.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.regButton} onPress={() => loginAccount()}>
            <Text style={MyStyleSheet.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Social Footer */}
        <View style={MyStyleSheet.socialSection}>
          <View style={MyStyleSheet.dividerRow}>
            <View style={MyStyleSheet.line} /><Text style={MyStyleSheet.orText}>or login with</Text><View style={MyStyleSheet.line} />
          </View>

          <View style={MyStyleSheet.iconRow}>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>FB</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>G</Text></TouchableOpacity>
            <TouchableOpacity style={MyStyleSheet.socialIcon}><Text>Ap</Text></TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => opx.navigate('register')}>
            <Text style={MyStyleSheet.footerText}>Don't have an account? <Text style={{ fontWeight: 'bold', color: '#4E5DB2' }}>Signup</Text></Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
}