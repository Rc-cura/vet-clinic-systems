import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App' 

export default function PetsAddedPage() {
  const opx = useNavigation()

  const renderPetCard = ({ item }) => (
    <View style={MyStyleSheet.petCardMain}>
      <View style={MyStyleSheet.petCardHeader}>
        {/* Rounded Image on the Left */}
        <View style={MyStyleSheet.petCardCircle}>
          {item.pimage ? (
            <Image source={{ uri: item.pimage }} style={{ width: '100%', height: '100%', borderRadius: 25 }} />
          ) : (
            <Image source={require('../public/blackpaw.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
          )}
        </View>

        {/* Text Details Section */}
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={MyStyleSheet.petCardName}>{item.pname}</Text>
          <Text style={MyStyleSheet.petCardSubBreed}>{item.breed}</Text>
          <Text style={MyStyleSheet.petCardGenderText}>{item.gender}</Text>

          {/* Action Buttons Row */}
          <View style={MyStyleSheet.petActionRow}>
            <TouchableOpacity 
              style={MyStyleSheet.viewProfileOutlineBtn} 
              onPress={() => opx.navigate('viewpets', { pet: item })}
            >
              <Text style={MyStyleSheet.viewProfileOutlineText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={MyStyleSheet.bookApptSolidBtn} 
              onPress={() => opx.navigate('service', { 
                petName: item.pname, 
                petImage: item.pimage,
                petDetails: `${item.species} | ${item.breed}` 
              })}
            >
              <Text style={MyStyleSheet.bookApptSolidText}>Book appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={MyStyleSheet.petHeaderSimple}>
        <Text style={MyStyleSheet.petHeaderTitle}>Pets</Text>
      </View>

      <FlatList 
        data={Pets} 
        renderItem={renderPetCard} 
        keyExtractor={(item, index) => index.toString()} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#AAA' }}>No pets found.</Text>
        )}
      />

      {/* Floating Sliding Drawer */}
      <View style={MyStyleSheet.bottomDrawerCard}>
        <View style={MyStyleSheet.dragHandleBar} />
        <Text style={MyStyleSheet.cardActionTitle}>Add a pet now</Text>
      </View>

      {/* Professional Bottom Navigation */}
      <View style={MyStyleSheet.minimalBottomNav}>
        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Pets.png')} style={[MyStyleSheet.navTabIcon, { tintColor: '#2E3A91' }]} />
          <Text style={[MyStyleSheet.navTabText, { color: '#2E3A91' }]}>Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('service')}>
          <Image source={require('../public/Book.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={MyStyleSheet.navTab}>
          <Image source={require('../public/Profile.png')} style={MyStyleSheet.navTabIcon} />
          <Text style={MyStyleSheet.navTabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}