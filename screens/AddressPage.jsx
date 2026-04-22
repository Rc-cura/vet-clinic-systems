import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown';
import MyStyleSheet from '../styles/MyStyleSheet'

// Import Supabase
import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';

export default function AddressPage() {
  const opx = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const { onboardingData } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [addressInfo, setAddressInfo] = useState({
    street: '', 
    line2: '', 
    barangay: '', 
    city: '', 
    province: '', 
    country: 'Philippines', 
    postalCode: ''
  });

  // Sample data para sa dropdowns
  const provinceData = [
    { label: 'Metro Manila', value: 'Metro Manila' },
    { label: 'Cavite', value: 'Cavite' },
    { label: 'Laguna', value: 'Laguna' }
  ];

  const handleFinalSave = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // 1. I-save sa customer_contact_methods
      const { error: contactError } = await supabase.from('customer_contact_methods').upsert({
        customer_id: user.id,
        channel: 'phone',
        usage: 'primary',
        value_primary: onboardingData?.contact_number || null
      });
      if (contactError) throw new Error(`Contact Error: ${contactError.message}`);

      // 2. I-save sa customer_profile_meta
      const { error: metaError } = await supabase.from('customer_profile_meta').upsert({
        customer_id: user.id,
        joined_date: onboardingData?.joinedDate || null,
        id_type: onboardingData?.idType || null,
        gender: onboardingData?.gender || null,
        occupation: onboardingData?.occupation || null,
        date_of_birth: onboardingData?.dob || null,
        race: onboardingData?.nationality || null,
        religion: onboardingData?.religion || null,
        marital_status: onboardingData?.maritalStatus || null,
        is_foreigner: onboardingData?.isInternational || false
      });
      if (metaError) throw new Error(`Profile Error: ${metaError.message}`);

      // 3. I-save sa customer_addresses 
      // 🔴 FIX: Pinagsama ang Street at Barangay dito para papasok sa iisang column
      const fullStreetAddress = addressInfo.barangay 
        ? `${addressInfo.street}, Brgy. ${addressInfo.barangay}` 
        : addressInfo.street;

      const { error: addressError } = await supabase.from('customer_addresses').upsert({
        customer_id: user.id,
        street_address: fullStreetAddress,
        additional_info: addressInfo.line2 || null, 
        city: addressInfo.city || null,
        state: addressInfo.province || null,
        postal_code: addressInfo.postalCode || null,
        country: addressInfo.country || 'Philippines'
      });
      if (addressError) throw new Error(`Address Error: ${addressError.message}`);

      Alert.alert("Success", "Welcome! Your profile is now complete.");
      opx.replace('dashboard'); 

    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error Saving Profile", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={[MyStyleSheet.formHeader, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity onPress={() => opx.goBack()} style={MyStyleSheet.backBtn}>
          <Text style={{ fontSize: 28, color: '#2E3A91' }}>←</Text>
        </TouchableOpacity>
        <Text style={[MyStyleSheet.petHeaderTitle, { marginLeft: 10 }]}>Address</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 40 }}>
        {/* PROGRESS BAR */}
        <View style={MyStyleSheet.stepperMainContainer}>
          <View style={MyStyleSheet.stepperBackgroundLine} />
          <View style={MyStyleSheet.stepperContentRow}>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View><Text style={MyStyleSheet.stepLabelActive}>Add a profile{"\n"}picture</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View><Text style={MyStyleSheet.stepLabelActive}>How can we{"\n"}reach you?</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>✓</Text></View><Text style={MyStyleSheet.stepLabelActive}>Background</Text></View>
            <View style={MyStyleSheet.stepWrapper}><View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>4</Text></View><Text style={MyStyleSheet.stepLabelActive}>Address</Text></View>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={MyStyleSheet.fieldLabel}>Street Address</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Street Address" 
            onChangeText={(v) => setAddressInfo({...addressInfo, street: v})} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Address Line 2</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Apartment, Suite, Unit, etc." 
            onChangeText={(v) => setAddressInfo({...addressInfo, line2: v})} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Barangay</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Barangay" 
            onChangeText={(v) => setAddressInfo({...addressInfo, barangay: v})} 
          />

          <Text style={MyStyleSheet.fieldLabel}>City / Municipality</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="City" 
            onChangeText={(v) => setAddressInfo({...addressInfo, city: v})} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Province / State</Text>
          <Dropdown 
            style={MyStyleSheet.styledInput} 
            data={provinceData} 
            labelField="label" 
            valueField="value" 
            placeholder="Select Province"
            onChange={item => setAddressInfo({...addressInfo, province: item.value})} 
          />

          <Text style={MyStyleSheet.fieldLabel}>Postal Code</Text>
          <TextInput 
            style={MyStyleSheet.styledInput} 
            placeholder="Postal Code" 
            keyboardType="numeric" 
            onChangeText={(v) => setAddressInfo({...addressInfo, postalCode: v})} 
          />
        </View>

        <TouchableOpacity 
          style={[MyStyleSheet.primaryActionBtn, { marginTop: 50 }]}
          onPress={handleFinalSave}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={MyStyleSheet.primaryActionBtnText}>Save</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}