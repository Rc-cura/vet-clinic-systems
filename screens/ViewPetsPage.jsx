import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native' // Added useRoute
import MyStyleSheet from '../styles/MyStyleSheet'

export default function ViewPetsPage() {
  const opx = useNavigation()
  const route = useRoute()

  // Catch the pet data passed from the previous screen
  const { pet } = route.params || {}

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, flexGrow: 1, paddingTop: 20 }}>
        
        {/* Profile Hero */}
        <View style={MyStyleSheet.summaryHero}>
          <View style={{ flex: 1 }}>
            <Text style={MyStyleSheet.sumPetNameText}>{pet?.pname || 'Pet Name'}</Text>
            <Text style={MyStyleSheet.sumPetSubText}>
              {pet?.species || 'Type'} | {pet?.breed || 'Breed'}
            </Text>
          </View>
          <View style={MyStyleSheet.sumBigCircle}>
             {pet?.pimage ? (
                <Image 
                  source={{ uri: pet.pimage }} 
                  style={{ width: '100%', height: '100%', borderRadius: 50 }} 
                />
             ) : (
                <Image 
                  source={require('../public/bluepaw.svg')} 
                  style={{ width: 50, height: 50 }} 
                  resizeMode="contain" 
                />
             )}
          </View>
        </View>

        {/* Details with Lines */}
        <View style={MyStyleSheet.detailsListGroup}>
          
          {/* Gender Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Gender</Text>
            <Text style={MyStyleSheet.detailValueText}>{pet?.gender || 'N/A'}</Text>
          </View>

          {/* Age Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Age</Text>
            <Text style={MyStyleSheet.detailValueText}>{pet?.age || '0'}</Text>
          </View>

          {/* Weight Row */}
          <View style={MyStyleSheet.detailRowWithLine}>
            <Text style={MyStyleSheet.detailLabelText}>Weight</Text>
            <Text style={MyStyleSheet.detailValueText}>{pet?.weight ? `${pet.weight} kg` : 'N/A'}</Text>
          </View>

          {/* Remarks */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 15 }}>Remarks</Text>
            <Text style={{ color: '#666', marginTop: 5 }}>
                {pet?.remarks || "No additional remarks."}
            </Text>
          </View>
        </View>

        {/* Edit Button */}
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
          <TouchableOpacity 
            style={MyStyleSheet.primaryBlueBtn}
            onPress={() => opx.navigate('editpets', { pet })} // Pass pet data to edit screen
          >
            <Text style={MyStyleSheet.primaryBlueBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}