import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function PetManagementPage() {
  const navigation = useNavigation();
  // State to toggle drawer height
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ flex: 1 }}>
        
        {/* Header Section */}
        <View style={MyStyleSheet.petHeaderSimple}>
          <Text style={MyStyleSheet.petHeaderTitle}>Pets</Text>
        </View>

        {/* Main Content Area (Empty State) */}
        {/* We use a container with paddingBottom to prevent the drawer from covering the text */}
        <View style={[MyStyleSheet.emptyStateCentered, { paddingBottom: 150 }]}>
          <Image 
            source={require('../public/cat.png')} 
            style={MyStyleSheet.catIllustration} 
            resizeMode="contain" 
          />
          <Text style={MyStyleSheet.emptyStateSubtitle}>
            There are no pets listed here.{"\n"}Create their profiles now!
          </Text>
        </View>

        {/* Floating Drawer Card */}
        <View style={[
          MyStyleSheet.bottomDrawerCard, 
          isExpanded ? { height: 250 } : { height: 110 }
        ]}>
          
          {/* Tappable Area to Pull Up/Down */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setIsExpanded(!isExpanded)}
            style={{ alignItems: 'center', width: '100%' }}
          >
            <View style={MyStyleSheet.dragHandleBar} />
            <Text style={MyStyleSheet.cardActionTitle}>Add a pet now</Text>
          </TouchableOpacity>
          
          {/* Show Button only when expanded */}
          {isExpanded && (
            <TouchableOpacity 
              style={MyStyleSheet.primaryActionBtn} 
              onPress={() => navigation.navigate('addpets')}
            >
              <Text style={MyStyleSheet.primaryActionBtnText}>Add pet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Navigation Bar at the very bottom */}
        <View style={MyStyleSheet.minimalBottomNav}>
          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('dashboard')}>
            <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab}>
            <Image source={require('../public/Pets.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
            <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Pets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('service')}>
            <Image source={require('../public/Book.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Book</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => navigation.navigate('appointment')}>
            <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={MyStyleSheet.navTab}>
            <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
            <Text style={MyStyleSheet.navTabText}>Profile</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}