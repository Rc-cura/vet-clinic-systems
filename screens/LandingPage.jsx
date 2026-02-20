import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function LandingPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>

      <View style={MyStyleSheet.header}>

        <View style={MyStyleSheet.logoCircle}>

          <Image source={require('../public/logo.svg')} style={MyStyleSheet.logoIcon} />
          
        </View>
      </View>

      <View style={MyStyleSheet.content}>
        <Image source={require('../public/landing.svg')} style={{width:300, height:300, marginBottom:20}}  />
        <Text style={MyStyleSheet.title}>Welcome to the Family!</Text>
        <Text style={MyStyleSheet.subtitle}>Your Pet's Health in Your Pocket</Text>
        <View style={MyStyleSheet.pagination}>
          <View style={[MyStyleSheet.dot, MyStyleSheet.activeDot]} /><View style={MyStyleSheet.dot} /><View style={MyStyleSheet.dot} />
        </View>

      <View>
        <TouchableOpacity style={MyStyleSheet.button} onPress={()=>opx.navigate('register')}><Text style={MyStyleSheet.buttonText}>Sign Up</Text></TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.button} onPress={()=>opx.navigate('login')}><Text style={MyStyleSheet.buttonText}>Login</Text></TouchableOpacity>
      </View>

      </View>


    </SafeAreaView>
  )
}