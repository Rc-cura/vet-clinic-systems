import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Registered } from '../App'




export default function RegisterPage() {
  const opx = useNavigation()

    const [getUser, setUser] = useState({
    fname: "",
    lname:"",
    email: "",
    password: "",
    cpassword:""
    
});

const [Msg, setMsg] = useState("");

const changeHandler = (field, value) => {
    setUser({ ...getUser, [field]: value });


    if (field === "password") {
        if (value.length === 0) {
            setMsg(""); 
        } else if (value.length <= 3) {
            setMsg("Weak Password");
        } else if (value.length <= 8) {
            setMsg("Medium Password");
        } else {
            setMsg("Strong Password");
        }
    }

    
    if (field === "email") {
        if (value.length > 0 && !value.toLowerCase().endsWith("@gmail.com")) {
            setMsg("Must be a @gmail.com address");
        } else {
            setMsg("");
        }
    }


};

const RegisteredAccs = () => {

    

    if (getUser.fname === "" || getUser.email === "" || getUser.password === "" || getUser.lname === "" || getUser.cpassword === "") {
        setMsg("Please fill up all fields");
        return;
    }

    if (getUser.password !== getUser.cpassword){
      setMsg("Password and Confirm Password Not Match")
      return;
    }

    const Exists = Registered.find((item) => {
        return item.email === getUser.email;
    });

    if (Exists) {
        setMsg("Email already exists");
        return;
    }

   
   Registered.push(getUser);
   setMsg("");
    opx.replace("otp");
};

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Background Image (The paws and pink splashes) */}
      <ImageBackground 
        source={{ uri: 'https://via.placeholder.com/500' }} // Replace with your actual bg image
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
             <Image source={require('../public/logo.svg')} style={{width: 70, height: 70}} />
          </View>
        </View>

        {/* Floating Card */}
        <View style={MyStyleSheet.formCard}>
          <Text style={MyStyleSheet.cardTitle}>Create an account</Text>

          <Text style={{alignSelf:"center", color: Msg === "Strong Password" ? "green" : "red", marginBottom:10}}>{Msg}</Text>
          
          <TextInput style={MyStyleSheet.input}  onChangeText={(e) => {changeHandler("fname", e);}} placeholder='Enter First Name'/>
          <TextInput style={MyStyleSheet.input}  onChangeText={(e) => {changeHandler("lname", e);}} placeholder='Enter Last Name'/>
          <TextInput style={MyStyleSheet.input}  onChangeText={(e) => {changeHandler("email", e);}} placeholder='Enter Email' />
          <TextInput style={MyStyleSheet.input}  onChangeText={(e) => {changeHandler("password", e);}} placeholder='Enter Password' secureTextEntry/>
          <TextInput style={MyStyleSheet.input}  onChangeText={(e) => {changeHandler("cpassword", e);}} placeholder='Confirm Password' secureTextEntry/>

          <TouchableOpacity style={MyStyleSheet.regButton} onPress={() => RegisteredAccs()}>
            <Text style={MyStyleSheet.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
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
            <Text style={MyStyleSheet.footerText}>Already have an account? <Text style={{fontWeight: 'bold', color: '#4E5DB2'}}>Login</Text></Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </SafeAreaView>
  )
}