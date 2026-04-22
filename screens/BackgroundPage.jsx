import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown';
import MyStyleSheet from '../styles/MyStyleSheet'

export default function BackgroundPage() {
  const opx = useNavigation();
  const route = useRoute();
  const { onboardingData } = route.params || {};

  const [background, setBackground] = useState({
    joinedDate: '', idType: '', gender: '', occupation: '',
    dob: '', nationality: '', religion: '', maritalStatus: '', isInternational: false
  });

  const handleNext = () => {
    opx.navigate('address', {
      onboardingData: { ...onboardingData, ...background }
    });
  };

  // ... (Dropdown Data arrays stay the same) ...
  const idTypeData = [{ label: 'Passport', value: 'Passport' }, { label: 'Drivers License', value: 'Drivers License' }, { label: 'National ID', value: 'National ID' }];
  const genderData = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }];
  const nationalityData = [{ label: 'Filipino', value: 'Filipino' }, { label: 'Other', value: 'Other' }];
  const religionData = [{ label: 'Roman Catholic', value: 'Roman Catholic' }, { label: 'Christian', value: 'Christian' }];
  const maritalData = [{ label: 'Single', value: 'Single' }, { label: 'Married', value: 'Married' }];

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}><Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text></TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Background</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        <View style={MyStyleSheet.stepperMainContainer}>
          <View style={MyStyleSheet.stepperBackgroundLine} />
          <View style={MyStyleSheet.stepperContentRow}>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View><Text style={MyStyleSheet.stepLabelActive}>Add a profile{"\n"}picture</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View><Text style={MyStyleSheet.stepLabelActive}>How can we{"\n"}reach you?</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>3</Text></View><Text style={MyStyleSheet.stepLabelActive}>Background</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>4</Text></View><Text style={MyStyleSheet.stepLabelInactive}>Address</Text></View>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={MyStyleSheet.fieldLabel}>Joined Date</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="YYYY-MM-DD" value={background.joinedDate} onChangeText={(v) => setBackground({...background, joinedDate: v})} />

          <Text style={MyStyleSheet.fieldLabel}>ID Type</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={idTypeData} labelField="label" valueField="value" value={background.idType} onChange={item => setBackground({...background, idType: item.value})} />

          <Text style={MyStyleSheet.fieldLabel}>Gender</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={genderData} labelField="label" valueField="value" value={background.gender} onChange={item => setBackground({...background, gender: item.value})} />

          <Text style={MyStyleSheet.fieldLabel}>Occupation</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="Occupation" onChangeText={(v) => setBackground({...background, occupation: v})} />

          <Text style={MyStyleSheet.fieldLabel}>Date of Birth</Text>
          <TextInput style={MyStyleSheet.styledInput} placeholder="YYYY-MM-DD" onChangeText={(v) => setBackground({...background, dob: v})} />

          <Text style={MyStyleSheet.fieldLabel}>Nationality</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={nationalityData} labelField="label" valueField="value" value={background.nationality} onChange={item => setBackground({...background, nationality: item.value})} />

          <Text style={MyStyleSheet.fieldLabel}>Religion</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={religionData} labelField="label" valueField="value" value={background.religion} onChange={item => setBackground({...background, religion: item.value})} />

          <Text style={MyStyleSheet.fieldLabel}>Marital Status</Text>
          <Dropdown style={MyStyleSheet.styledInput} data={maritalData} labelField="label" valueField="value" value={background.maritalStatus} onChange={item => setBackground({...background, maritalStatus: item.value})} />
        </View>

        <TouchableOpacity style={[MyStyleSheet.primaryActionBtn, { flexDirection: 'row', marginTop: 50 }]} onPress={handleNext}>
          <Text style={[MyStyleSheet.primaryActionBtnText, { marginRight: 10 }]}>Next</Text>
          <Text style={{ color: '#FFF', fontSize: 20 }}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}