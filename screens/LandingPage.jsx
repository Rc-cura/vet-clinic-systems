import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function LandingPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.landingMainContainer}>
      
      {/* 1. Header Area - Reduced Flex to pull card UP */}
      <View style={MyStyleSheet.landingHeaderArea}>
        <View style={MyStyleSheet.landingLogoContainer}>
          <Image 
            source={require('../public/logo.png')} 
            style={MyStyleSheet.landingLogoImage} 
            resizeMode="contain"
          />
        </View>
      </View>

      {/* 2. Bottom Card - Increased Flex to occupy more screen height */}
      <View style={MyStyleSheet.landingBottomCard}>
        
        <View style={MyStyleSheet.landingTextSection}>
          <Text style={MyStyleSheet.landingWelcomeText}>Welcome to</Text>
          <Text style={MyStyleSheet.landingBrandText}>PawCare</Text>
          <Text style={MyStyleSheet.landingSubText}>Your local partner in pet health.</Text>
        </View>

        <View style={MyStyleSheet.landingButtonSection}>
          <TouchableOpacity 
            style={MyStyleSheet.landingSignInBtn} 
            onPress={() => opx.navigate('login')}
          >
            <Text style={MyStyleSheet.landingSignInText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={MyStyleSheet.landingSignUpBtn} 
            onPress={() => opx.navigate('register')}
          >
            <Text style={MyStyleSheet.landingSignUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>

    </SafeAreaView>
  )
}