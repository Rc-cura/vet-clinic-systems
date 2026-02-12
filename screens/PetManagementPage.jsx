import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function PetManagementPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header Section */}
      <View style={MyStyleSheet.petHeader}>
        <Text style={MyStyleSheet.petHeaderText}>Your Pets</Text>
        <View style={MyStyleSheet.petHeaderDivider} />
      </View>

      {/* Top Filter/Add Section */}
      <View style={MyStyleSheet.petActionRow}>
        <TouchableOpacity style={MyStyleSheet.allPetsCircle}>
          <Text style={MyStyleSheet.allPetsText}>All{"\n"}Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.addNewContainer} onPress={() => opx.navigate('addpets')}>
          <View style={MyStyleSheet.addNewCircle}>
            {/* If you have a plus icon image, use it here, otherwise keep the Text '+' */}
            <Text style={{ fontSize: 24, color: '#5C93E8' }}>+</Text>
          </View>
          <Text style={MyStyleSheet.addNewLabel}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State Illustration Section */}
      <View style={MyStyleSheet.emptyStateContainer}>
        <Image 
          // Changed from URL to your local landing/public image
          source={require('../public/cat.svg')} 
          style={MyStyleSheet.emptyImage}
          resizeMode="contain"
        />
        <Text style={MyStyleSheet.emptyTextMain}>
          There are no pets listed here.{"\n"}Create their profiles now!
        </Text>

        <TouchableOpacity style={MyStyleSheet.addFirstBtn} onPress={() => opx.navigate('addpets')}>
          <Text style={MyStyleSheet.addFirstBtnText}>ADD YOUR FIRST PET</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={MyStyleSheet.bottomNav}>
        {/* Home */}
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.svg')} style={{ width: 24, height: 24 }} />
          <Text style={MyStyleSheet.navLabel}>Home</Text>
        </TouchableOpacity>
        
        {/* Active Pets Tab */}
        <View style={MyStyleSheet.navItemContainer}>
           <TouchableOpacity style={MyStyleSheet.navItemActive}>
              <Image source={require('../public/Pets.svg')} style={{ width: 24, height: 24 }} />
           </TouchableOpacity>
        </View>

        {/* Appointment */}
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.svg')} style={{ width: 24, height: 24 }} />
          <Text style={MyStyleSheet.navLabel}>Appointment</Text>
        </TouchableOpacity>

        {/* Invoice */}
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('billing')}>
          <Image source={require('../public/Bill.svg')} style={{ width: 24, height: 24 }} />
          <Text style={MyStyleSheet.navLabel}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}