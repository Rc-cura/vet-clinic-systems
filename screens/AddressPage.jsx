import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown';
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddressPage() {
  const opx = useNavigation();
  const [addressInfo, setAddressInfo] = useState({
    street: '',
    line2: '',
    barangay: '',
    city: '',
    province: '',
    country: '',
    postalCode: ''
  });

  // Sample data for Philippine address dropdowns
  const countryData = [{ label: 'Philippines', value: 'PH' }];
  const provinceData = [{ label: 'Metro Manila', value: 'MM' }, { label: 'Cavite', value: 'CAV' }];

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      {/* Header */}
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Address</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        
        {/* --- FINAL STEP PROGRESS BAR --- */}
        <View style={MyStyleSheet.stepperMainContainer}>
          <View style={MyStyleSheet.stepperBackgroundLine} />
          <View style={MyStyleSheet.stepperContentRow}>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Add a profile{"\n"}picture</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>How can we{"\n"}reach you?</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Background</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>4</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Address</Text>
            </View>
          </View>
        </View>

        {/* Address Form Fields */}
        <View style={{ marginTop: 30 }}>
          <Text style={MyStyleSheet.fieldLabel}>Street Address</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Enter address" 
            placeholderTextColor="#BDBDBD" 
            onChangeText={(v) => setAddressInfo({...addressInfo, street: v})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Address Line 2</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Apartment, Suite, Unit, Building, Floor etc." 
            placeholderTextColor="#BDBDBD" 
            onChangeText={(v) => setAddressInfo({...addressInfo, line2: v})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Barangay</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            placeholder="Select a barangay" 
            placeholderStyle={{color: '#BDBDBD'}}
            labelField="label" valueField="value"
            data={[]} // Add your barangay list here
          />

          <Text style={MyStyleSheet.fieldLabel}>City / Municipality</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            placeholder="Select a city / municipality" 
            placeholderStyle={{color: '#BDBDBD'}}
            labelField="label" valueField="value"
            data={[]} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Province / State</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={provinceData} 
            labelField="label" valueField="value"
            placeholder="Select a province / state" 
            placeholderStyle={{color: '#BDBDBD'}}
          />

          <Text style={MyStyleSheet.fieldLabel}>Country</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={countryData} 
            labelField="label" valueField="value"
            placeholder="Select a country" 
            placeholderStyle={{color: '#BDBDBD'}}
            value="PH"
          />

          <Text style={MyStyleSheet.fieldLabel}>Postal Code</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Enter postal code" 
            placeholderTextColor="#BDBDBD" 
            keyboardType="numeric"
            onChangeText={(v) => setAddressInfo({...addressInfo, postalCode: v})}
          />
        </View>

        {/* Final Save Button */}
        <TouchableOpacity 
          style={[MyStyleSheet.primaryActionBtn, { marginTop: 50 }]}
          onPress={() => opx.replace('dashboard')} // Replace stack so user can't go back to registration
        >
          <Text style={MyStyleSheet.primaryActionBtnText}>Save</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}