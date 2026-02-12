import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function PetsAddedPage() {
  const opx = useNavigation()

  const petData = [
    { id: '1', name: 'Pet Name', info: 'Species - Breed - Gender', weight: 'kg' },
    { id: '2', name: 'Pet Name', info: 'Species - Breed - Gender', weight: 'kg' },
    { id: '3', name: 'Pet Name', info: 'Species - Breed - Gender', weight: 'kg' },
  ]

  const renderPetCard = ({ item }) => (
    <View style={MyStyleSheet.petCardMain}>
      <View style={MyStyleSheet.petCardHeader}>
        <View style={MyStyleSheet.petCardCircle}>
          {/* Pet Photo SVG */}
          <Image source={require('../public/blackpaw.svg')} style={{ width: 40, height: 40 }} resizeMode="contain" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={MyStyleSheet.petCardName}>{item.name}</Text>
          <Text style={MyStyleSheet.petCardSub}>{item.info}</Text>
        </View>
        <Text style={MyStyleSheet.petWeightTag}>{item.weight}</Text>
      </View>
      
      <View style={MyStyleSheet.cardDivider} />

      <View style={MyStyleSheet.petActionRow}>
        <TouchableOpacity style={MyStyleSheet.petActionBtn} onPress={()=>{opx.navigate('service')}}>
          {/* Calendar SVG */}
          <Image source={require('../public/addcalendar.svg')} style={{ width: 20, height: 20, marginRight: 5 }} />
          <Text style={MyStyleSheet.petActionLabel}>Add Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.petActionBtn} onPress={()=>{opx.navigate('viewpets')}}>
          {/* Paw SVG */}
          <Image source={require('../public/bluepaw.svg')} style={{ width: 20, height: 20, marginRight: 5 }} />
          <Text style={MyStyleSheet.petActionLabel}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={{ padding: 25 }}>
        <Text style={MyStyleSheet.sectionTitle}>Your Pets</Text>
        
        {/* Horizontal Pet Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 20 }}>
          <TouchableOpacity style={MyStyleSheet.petSelectActive}>
            <Text style={MyStyleSheet.petSelectTextActive}>All{"\n"}Pets</Text>
          </TouchableOpacity>
          
          {[1, 2, 3].map((num) => (
            <View key={num} style={{ alignItems: 'center', marginRight: 15 }}>
              <View style={MyStyleSheet.petSelectCircle}>
                 {/* Paw SVG for individual selectors */}
                 <Image source={require('../public/bluepaw.svg')} style={{ width: 18, height: 18 }} />
              </View>
              <Text style={MyStyleSheet.petSelectLabel}>Pet {num}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={() => opx.navigate('addpets')} style={{ alignItems: 'center' }}>
            <View style={[MyStyleSheet.petSelectCircle, { backgroundColor: '#D1E3FF' }]}>
              <Text style={{ fontSize: 24, color: '#5C93E8' }}>+</Text>
            </View>
            <Text style={MyStyleSheet.petSelectLabel}>Add New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={petData}
        renderItem={renderPetCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      />

      {/* Bottom Nav */}
      <View style={MyStyleSheet.bottomNav}>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('dashboard')}>
          <Image source={require('../public/HomePage.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Home</Text>
        </TouchableOpacity>
        <View style={MyStyleSheet.navItemContainer}>
           <TouchableOpacity style={MyStyleSheet.navItemActive}>
              <Image source={require('../public/Pets.svg')} style={{ width: 22, height: 22 }} />
           </TouchableOpacity>
        </View>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('appointment')}>
          <Image source={require('../public/Calendar.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Appt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.navItem} onPress={() => opx.navigate('billing')}>
          <Image source={require('../public/Bill.svg')} style={{ width: 22, height: 22 }} />
          <Text style={MyStyleSheet.navLabel}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}