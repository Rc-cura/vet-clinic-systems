import { View, Text, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'
import { Pets } from '../App'



export default function AddPetsCont() {
  const navigation = useNavigation()



  const route = useRoute();
  const { petData } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false); 

    const handleAddToAccount = () => {
  if (petData) {
    Pets.push(petData); // Simply push the object
    console.log("Pet added to array:", Pets);
    setModalVisible(true);     // Show success message
  }
};

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Custom Header removed. Using system header from App.js now. */}

      <View style={{ paddingHorizontal: 30, flex: 1, marginTop: 20 }}>
        {/* Profile Section */}
        <View style={MyStyleSheet.summaryProfileRow}>
          <View>
            <Text style={MyStyleSheet.summaryPetName}>{petData?.pname}</Text>
            <Text style={MyStyleSheet.summaryPetType}>{petData?.species} | {petData?.breed}</Text>
          </View>
          <View style={MyStyleSheet.summaryCircleGray}>
            {petData?.pimage ? (
    <Image 
      source={{ uri: petData.pimage }} 
      style={{ width: '100%', height: '100%', borderRadius: 50 }} 
    />
  ) : (
    <Image 
      source={require('../public/bluepaw.svg')} 
      style={{ width: 45, height: 45 }} 
      resizeMode="contain"
    />
  )}
          </View>
        </View>

        {/* Details List */}
        <View style={MyStyleSheet.detailsContainer}>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Gender</Text><Text style={MyStyleSheet.detailValue}>{petData?.gender}</Text></View>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Age</Text><Text style={MyStyleSheet.detailValue}>{petData?.age}</Text></View>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Weight</Text><Text style={MyStyleSheet.detailValue}>{petData?.weight}</Text></View>
          <View style={[MyStyleSheet.detailItem, { borderBottomWidth: 0 }]}><Text style={MyStyleSheet.detailLabel}>{petData?.remarks}</Text></View>
        </View>

        {/* Add to Account Button */}
        <TouchableOpacity 
          style={MyStyleSheet.continuePrimaryBtn} 
          onPress={() => handleAddToAccount()} 
        >
          <Text style={MyStyleSheet.continueBtnText}>Add to Account</Text>
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.modalContainer}>
            <Text style={MyStyleSheet.modalTitle}>Successfully Added Pet</Text>
            
            <TouchableOpacity 
              style={MyStyleSheet.modalBackBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={MyStyleSheet.modalBackText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={MyStyleSheet.modalViewProfileBtn}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('pet'); 
              }}
            >
              <Text style={MyStyleSheet.modalViewText}>View Pets</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}