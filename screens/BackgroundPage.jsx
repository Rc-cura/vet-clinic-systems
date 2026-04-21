import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown';
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BackgroundPage() {
  const opx = useNavigation();
  const [background, setBackground] = useState({
    joinedDate: '', idType: '', gender: '', occupation: '',
    dob: '', nationality: '', religion: '', maritalStatus: '', isInternational: false
  });

  // --- Dropdown Data Arrays ---
  const idTypeData = [
    { label: 'Passport', value: 'Passport' },
    { label: 'Drivers License', value: 'Drivers License' },
    { label: 'National ID', value: 'National ID' },
    { label: 'SSS/GSIS', value: 'Social Security' }
  ];

  const genderData = [
    { label: 'Male', value: 'Male' }, 
    { label: 'Female', value: 'Female' },
    { label: 'Prefer not to say', value: 'Other' }
  ];

  const nationalityData = [
    { label: 'Filipino', value: 'Filipino' },
    { label: 'American', value: 'American' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Other', value: 'Other' }
  ];

  const religionData = [
    { label: 'Roman Catholic', value: 'Roman Catholic' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Islam', value: 'Islam' },
    { label: 'Iglesia ni Cristo', value: 'INC' },
    { label: 'None', value: 'None' }
  ];

  const maritalData = [
    { label: 'Single', value: 'Single' }, 
    { label: 'Married', value: 'Married' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Separated', value: 'Separated' }
  ];

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text> 
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Background</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        
        {/* --- SMOOTH STEPPER --- */}
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
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>3</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Background</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>4</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>Address</Text>
            </View>
          </View>
        </View>

        {/* Form Fields */}
        <View style={{ marginTop: 30 }}>
          <Text style={MyStyleSheet.fieldLabel}>Joined Date</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="00/01/0000" 
            placeholderTextColor="#BDBDBD" 
            onChangeText={(v) => setBackground({...background, joinedDate: v})}
          />

          <Text style={MyStyleSheet.fieldLabel}>ID Type</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={idTypeData} labelField="label" valueField="value"
            placeholder="Select ID Type" 
            placeholderStyle={{color: '#BDBDBD'}}
            selectedTextStyle={{color: '#333'}}
            value={background.idType}
            onChange={item => setBackground({...background, idType: item.value})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={genderData} labelField="label" valueField="value"
            placeholder="Select a gender" 
            placeholderStyle={{color: '#BDBDBD'}}
            selectedTextStyle={{color: '#333'}}
            value={background.gender}
            onChange={item => setBackground({...background, gender: item.value})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Occupation</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Enter your occupation" 
            placeholderTextColor="#BDBDBD" 
            onChangeText={(v) => setBackground({...background, occupation: v})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Date of Birth</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="00/01/0000" 
            placeholderTextColor="#BDBDBD" 
            onChangeText={(v) => setBackground({...background, dob: v})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Nationality</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={nationalityData} labelField="label" valueField="value"
            placeholder="Select a nationality" 
            placeholderStyle={{color: '#BDBDBD'}}
            selectedTextStyle={{color: '#333'}}
            value={background.nationality}
            onChange={item => setBackground({...background, nationality: item.value})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Religion</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={religionData} labelField="label" valueField="value"
            placeholder="Select a religion" 
            placeholderStyle={{color: '#BDBDBD'}}
            selectedTextStyle={{color: '#333'}}
            value={background.religion}
            onChange={item => setBackground({...background, religion: item.value})}
          />

          <Text style={MyStyleSheet.fieldLabel}>Marital Status</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={maritalData} labelField="label" valueField="value"
            placeholder="Select a marital status" 
            placeholderStyle={{color: '#BDBDBD'}}
            selectedTextStyle={{color: '#333'}}
            value={background.maritalStatus}
            onChange={item => setBackground({...background, maritalStatus: item.value})}
          />

          {/* International Client Checkbox */}
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }}
            onPress={() => setBackground({...background, isInternational: !background.isInternational})}
          >
            <View style={{ 
                width: 22, height: 22, 
                borderWidth: 1.5, borderColor: background.isInternational ? '#2E3A91' : '#A0A0A0', 
                borderRadius: 6, marginRight: 12, 
                justifyContent: 'center', alignItems: 'center',
                backgroundColor: background.isInternational ? '#2E3A91' : 'transparent'
            }}>
                {background.isInternational && <Text style={{ fontSize: 14, color: '#FFF' }}>✓</Text>}
            </View>
            <Text style={{ color: '#777', fontSize: 16 }}>International Client</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={[MyStyleSheet.primaryActionBtn, { flexDirection: 'row', marginTop: 50 }]}
          onPress={() => opx.navigate('address')}
        >
          <Text style={[MyStyleSheet.primaryActionBtnText, { marginRight: 10 }]}>Next</Text>
          <Text style={{ color: '#FFF', fontSize: 20 }}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}