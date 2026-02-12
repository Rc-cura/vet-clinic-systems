import { View, Text, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddPetsCont() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false); 

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      {/* Header */}
      <View style={MyStyleSheet.formHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Back Arrow SVG */}
          <Image 
            source={require('../public/back_arrow.svg')} 
            style={{ width: 24, height: 24 }} 
          />
        </TouchableOpacity>
        <Text style={MyStyleSheet.formHeaderTitle}>Add Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ paddingHorizontal: 30, flex: 1 }}>
        {/* Profile Section */}
        <View style={MyStyleSheet.summaryProfileRow}>
          <View>
            <Text style={MyStyleSheet.summaryPetName}>Pet Name</Text>
            <Text style={MyStyleSheet.summaryPetType}>Type | Breed</Text>
          </View>
          {/* Summary Circle with SVG Pet Icon <Image 
                source={require('../public/bluepaw.svg')} 
                style={{ width: 45, height: 45 }} 
                resizeMode="contain"
             />*/}
          <View style={MyStyleSheet.summaryCircleGray}>
             
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

      {/* SUCCESS MODAL (Pop-up Message) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={MyStyleSheet.modalOverlay}>
          <View style={MyStyleSheet.modalContainer}>
            {/* Success Icon Placeholder  <Image 
              source={require('../public/check.svg')} 
              style={{ width: 50, height: 50, marginBottom: 15, alignSelf: 'center' }} 
            />
            */}
           
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
              <Text style={MyStyleSheet.modalViewText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}