import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { useUser } from '../context/UserContext';
import { supabase } from '../context/supabase'; 

export default function RegisterPage() {
  const opx = useNavigation();
  const { updateUser } = useUser(); 
  
  // ================= WEB STATE ALIGNMENT =================
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= WEB PASSWORD STRENGTH LOGIC =================
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    
    if (score <= 2) return 'Weak';
    if (score === 3 || score === 4) return 'Moderate';
    if (score >= 5) return 'Strong';
    return '';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  // ================= WEB SUBMIT LOGIC =================
  const handleSubmit = async () => {
    setErrorMsg('');

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();

    // Validation checks exactly like the web
    if (firstName.length < 2 || lastName.length < 2) {
      setErrorMsg('Please enter at least 2 characters for first and last name.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create the user in Supabase Auth mapping Web Logic
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: formData.password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'client',
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        // 2. Save extra details to profiles table manually to ensure stability
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            { 
              id: data.user.id, 
              first_name: firstName, 
              last_name: lastName, 
              email: email,
              role: 'client'
            },
          ]);

        if (profileError) throw profileError;

        updateUser(data.user); 
        Alert.alert("Success", "Account created successfully! Check your email for the OTP.");
        opx.navigate("otp", { email: email });
      }

    } catch (error) {
      setErrorMsg(error.message);
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

            {errorMsg ? (
              <Text style={{ color: "red", marginBottom: 15, textAlign: 'center', fontWeight: 'bold' }}>
                {errorMsg}
              </Text>
            ) : null}

            {/* Input Fields */}
            <TextInput 
              style={MyStyleSheet.styledInput} 
              value={formData.firstName} 
              onChangeText={(e) => handleChange("firstName", e)} 
              placeholder='Enter First Name' 
              placeholderTextColor="#AAA" 
            />
            <TextInput 
              style={MyStyleSheet.styledInput} 
              value={formData.lastName} 
              onChangeText={(e) => handleChange("lastName", e)} 
              placeholder='Enter Last Name' 
              placeholderTextColor="#AAA" 
            />
            <TextInput 
              style={MyStyleSheet.styledInput} 
              value={formData.email} 
              onChangeText={(e) => handleChange("email", e)} 
              placeholder='Enter Email' 
              placeholderTextColor="#AAA" 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />
            
            <TextInput 
              style={MyStyleSheet.styledInput} 
              value={formData.password} 
              onChangeText={(e) => handleChange("password", e)} 
              placeholder='Enter Password' 
              placeholderTextColor="#AAA" 
              secureTextEntry 
            />

            {/* Dynamic Password Strength Text */}
            {formData.password ? (
              <Text style={{
                marginTop: -10, 
                marginBottom: 15, 
                marginLeft: 5,
                fontSize: 13, 
                fontWeight: '600',
                color: passwordStrength === 'Weak' ? '#e53e3e' : passwordStrength === 'Moderate' ? '#d69e2e' : '#38a169'
              }}>
                Password strength: {passwordStrength}
              </Text>
            ) : null}

            <TextInput 
              style={MyStyleSheet.styledInput} 
              value={formData.confirmPassword} 
              onChangeText={(e) => handleChange("confirmPassword", e)} 
              placeholder='Confirm Password' 
              placeholderTextColor="#AAA" 
              secureTextEntry 
            />

            {/* Main Sign Up Button */}
            <TouchableOpacity 
              style={[MyStyleSheet.landingSignUpBtn, { marginTop: 10, opacity: loading ? 0.7 : 1 }]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={MyStyleSheet.landingSignUpText}>
                {loading ? "Creating..." : "Create"}
              </Text>
            </TouchableOpacity>

            {/* Social Registration Section */}
            <View style={{ marginTop: 25, alignItems: 'center' }}>
              <Text style={{ color: '#AAA', marginBottom: 15 }}>Or sign up with</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle} onPress={() => Alert.alert('Notice', 'Mobile OAuth requires setup.')}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle} onPress={() => Alert.alert('Notice', 'Mobile OAuth requires setup.')}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity style={MyStyleSheet.socialIconCircle} onPress={() => Alert.alert('Notice', 'Mobile OAuth requires setup.')}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' }} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Redirect */}
            <TouchableOpacity onPress={() => opx.navigate('login')} style={{ marginTop: 30, alignItems: 'center' }}>
              <Text style={{ color: '#AAA' }}>
                Already have an account? <Text style={{ color: '#2E3A91', fontWeight: 'bold' }}>Log in</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}