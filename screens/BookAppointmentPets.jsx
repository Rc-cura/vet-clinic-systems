import { View, Text, TouchableOpacity, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BookAppointmentPets() {
  const opx = useNavigation()

  const petData = [
    { id: '1', name: 'Pet 1' },
    { id: '2', name: 'Pet 2' },
    { id: '3', name: 'Pet 3' },
    { id: '4', name: 'Pet 4' },
  ]

  const renderPetItem = ({ item }) => (
    <TouchableOpacity 
      style={MyStyleSheet.gridItem}
      onPress={() => opx.navigate('service')} 
    >
      <View style={MyStyleSheet.gridImagePlaceholder} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={{ paddingHorizontal: 25, paddingTop: 20 }}>
        <Text style={MyStyleSheet.selectPetLabel}>Select Pet</Text>
        
        <View style={[MyStyleSheet.progressBarBg, { marginTop: 20 }]}>
          <View style={[MyStyleSheet.progressBarActive, { width: '25%' }]} />
        </View>

        <FlatList
          data={petData}
          renderItem={renderPetItem}
          keyExtractor={item => item.id}
          numColumns={2} 
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={{ marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}