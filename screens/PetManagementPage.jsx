import { View, Text, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App' // Import your global pet array

export default function PetManagementPage() {
  const opx = useNavigation()

  // Logic to render each pet card dynamically based on the global array
  const renderPetCard = ({ item }) => (
    <View style={MyStyleSheet.petCardMain}>
      <View style={MyStyleSheet.petCardHeader}>
        <View style={MyStyleSheet.petCardCircle}>
          {/* Display uploaded pet image or default icon */}
          {item.pimage ? (
            <Image source={{ uri: item.pimage }} style={{ width: 45, height: 45, borderRadius: 25 }} />
          ) : (
            <Image source={require('../public/blackpaw.svg')} style={{ width: 40, height: 40 }} resizeMode="contain" />
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={MyStyleSheet.petCardName}>{item.pname}</Text>
          <Text style={MyStyleSheet.petCardSub}>{item.species} - {item.breed} - {item.gender}</Text>
        </View>
        <Text style={MyStyleSheet.petWeightTag}>{item.weight} kg</Text>
      </View>
      
      <View style={MyStyleSheet.cardDivider} />

      <View style={MyStyleSheet.petActionRow}>
        <TouchableOpacity style={MyStyleSheet.petActionBtn} onPress={() => opx.navigate('service')}>
          <Image source={require('../public/addcalendar.svg')} style={{ width: 20, height: 20, marginRight: 5 }} />
          <Text style={MyStyleSheet.petActionLabel}>Add Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={MyStyleSheet.petActionBtn} onPress={() => opx.navigate('viewpets', { pet: item })}>
          <Image source={require('../public/bluepaw.svg')} style={{ width: 20, height: 20, marginRight: 5 }} />
          <Text style={MyStyleSheet.petActionLabel}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Dynamic Header based on pet count */}
      <View style={{ padding: 25 }}>
        <Text style={MyStyleSheet.sectionTitle}>Your Pets</Text>
        
        {/* Horizontal Pet Selector Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 20 }}>
          <TouchableOpacity style={MyStyleSheet.petSelectActive}>
            <Text style={MyStyleSheet.petSelectTextActive}>All{"\n"}Pets</Text>
          </TouchableOpacity>
          
          {/* Loop through global Pets array for the top circular indicators */}
          {Pets.map((pet, index) => (
            <View key={index} style={{ alignItems: 'center', marginRight: 15 }}>
              <View style={MyStyleSheet.petSelectCircle}>
                 {pet.pimage ? (
                   <Image source={{ uri: pet.pimage }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                 ) : (
                   <Image source={require('../public/bluepaw.svg')} style={{ width: 18, height: 18 }} />
                 )}
              </View>
              <Text style={MyStyleSheet.petSelectLabel}>{pet.pname}</Text>
            </View>
          ))}

          {/* Add New Button */}
          <TouchableOpacity onPress={() => opx.navigate('addpets')} style={{ alignItems: 'center' }}>
            <View style={[MyStyleSheet.petSelectCircle, { backgroundColor: '#D1E3FF' }]}>
              <Text style={{ fontSize: 24, color: '#5C93E8' }}>+</Text>
            </View>
            <Text style={MyStyleSheet.petSelectLabel}>Add New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conditional Rendering: Show List if Pets exist, else show Empty State */}
      {Pets.length > 0 ? (
        <FlatList
          data={Pets}
          renderItem={renderPetCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        />
      ) : (
        <View style={MyStyleSheet.emptyStateContainer}>
          <Image source={require('../public/cat.svg')} style={MyStyleSheet.emptyImage} resizeMode="contain" />
          <Text style={MyStyleSheet.emptyTextMain}>No pets listed here.{"\n"}Create their profiles now!</Text>
          <TouchableOpacity style={MyStyleSheet.addFirstBtn} onPress={() => opx.navigate('addpets')}>
            <Text style={MyStyleSheet.addFirstBtnText}>ADD YOUR FIRST PET</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
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