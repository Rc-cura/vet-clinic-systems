import { View, Text, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddPetsCont() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false); 

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Custom Header removed. Using system header from App.js now. */}

      <View style={{ paddingHorizontal: 30, flex: 1, marginTop: 20 }}>
        {/* Profile Section */}
        <View style={MyStyleSheet.summaryProfileRow}>
          <View>
            <Text style={MyStyleSheet.summaryPetName}>Pet Name</Text>
            <Text style={MyStyleSheet.summaryPetType}>Type | Breed</Text>
          </View>
          <View style={MyStyleSheet.summaryCircleGray}>
             {/* You can uncomment this if you have the SVG ready */}
             {/* <Image 
                source={require('../public/bluepaw.svg')} 
                style={{ width: 45, height: 45 }} 
                resizeMode="contain"
             /> */}
          </View>
        </View>

        {/* Details List */}
        <View style={MyStyleSheet.detailsContainer}>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Gender</Text><Text style={MyStyleSheet.detailValue}>Female</Text></View>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Age</Text><Text style={MyStyleSheet.detailValue}>0</Text></View>
          <View style={MyStyleSheet.detailItem}><Text style={MyStyleSheet.detailLabel}>Weight</Text><Text style={MyStyleSheet.detailValue}>kg</Text></View>
          <View style={[MyStyleSheet.detailItem, { borderBottomWidth: 0 }]}><Text style={MyStyleSheet.detailLabel}>Remarks</Text></View>
        </View>

        {/* Add to Account Button */}
        <TouchableOpacity 
          style={MyStyleSheet.continuePrimaryBtn} 
          onPress={() => setModalVisible(true)} 
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
                navigation.navigate('petsadded'); 
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