import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function ViewPetsPage() {
  const opx = useNavigation()

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, flexGrow: 1, paddingTop: 20 }}>
        
        {/* Profile Hero */}
        <View style={MyStyleSheet.summaryHero}>
          <View style={{ flex: 1 }}>
            <Text style={MyStyleSheet.sumPetNameText}>Pet Name</Text>
            <Text style={MyStyleSheet.sumPetSubText}>Type | Breed</Text>
          </View>
          <View style={MyStyleSheet.sumBigCircle} />
        </View>

        {/* Details with Lines */}
        <View style={MyStyleSheet.detailsListGroup}>
          
          {/* Gender Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Gender</Text>
            <Text style={MyStyleSheet.detailValueText}>Female</Text>
          </View>

          {/* Age Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Age</Text>
            <Text style={MyStyleSheet.detailValueText}>2</Text>
          </View>

          {/* Weight Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Weight</Text>
            <Text style={MyStyleSheet.detailValueText}>kg</Text>
          </View>

          {/* Remarks */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 15 }}>Remarks</Text>
          </View>
        </View>

        {/* Edit Button */}
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
          <TouchableOpacity 
            style={MyStyleSheet.primaryBlueBtn}
            onPress={() => opx.navigate('editpets')}
          >
            <Text style={MyStyleSheet.primaryBlueBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}