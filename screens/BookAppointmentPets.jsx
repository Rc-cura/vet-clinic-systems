import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentPets() {
  const opx = useNavigation()

  // Halimbawang data para sa mga Pets
  const petData = [
    { id: '1', name: 'Pet 1' },
    { id: '2', name: 'Pet 2' },
    { id: '3', name: 'Pet 3' },
    { id: '4', name: 'Pet 4' },
  ]

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={MyStyleSheet.gridItem}
      onPress={() => opx.navigate('service')} // Palitan ng tamang route
    >
      <View style={MyStyleSheet.gridImagePlaceholder} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => opx.goBack()}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Book an Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 25, marginTop: 20 }}>
        <Text style={MyStyleSheet.selectPetLabel}>Select Pet</Text>
        
        {/* Progress Bar (Blue line) */}
        <View style={MyStyleSheet.progressBarBg}>
          <View  style={[MyStyleSheet.progressBarActive, { width: '25%' }]} />
        </View>

        <FlatList
          data={petData}
          renderItem={renderPetItem}
          keyExtractor={item => item.id}
          numColumns={2} // Eto ang gagawa ng Grid
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  )
}