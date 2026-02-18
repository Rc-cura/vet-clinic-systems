import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App'

export default function BookAppointmentPets() {
  const opx = useNavigation()

  const renderPetItem = ({ item }) => {
    if (item.empty) {
      return <View style={[MyStyleSheet.gridItem, { backgroundColor: 'transparent' }]} />;
    }

    return (
      <TouchableOpacity 
        style={MyStyleSheet.gridItem} 
        onPress={() => opx.navigate('service', { 
          petName: item.pname, 
          petImage: item.pimage, 
          // Build the details string here
          petDetails: `${item.species} - ${item.breed} - ${item.gender}`,
          petWeight: item.weight
        })} 
      >
        <View style={MyStyleSheet.gridImagePlaceholder}>
          {item.pimage ? (
            <Image source={{ uri: item.pimage }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          ) : (
            <Image source={require('../public/bluepaw.svg')} style={{ width: 40, height: 40 }} resizeMode="contain" />
          )}
        </View>
        <Text style={{ textAlign: 'center', marginTop: 8, fontWeight: '500' }}>{item.pname}</Text>
      </TouchableOpacity>
    );
  }

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <View style={{ paddingHorizontal: 25, paddingTop: 20 }}>
        <Text style={MyStyleSheet.selectPetLabel}>Select Pet</Text>
        <View style={[MyStyleSheet.progressBarBg, { marginTop: 20 }]}>
          <View style={[MyStyleSheet.progressBarActive, { width: '25%' }]} />
        </View>
        <FlatList
          data={formatData([...Pets], 2)}
          renderItem={renderPetItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={{ marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        /> 
      </View>
    </SafeAreaView>
  )
}