import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker' // Mas recommended ang expo-image-picker para sa Expo
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddProfilePic() {
  const opx = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    // Ipapasa natin ang napiling image sa susunod na screen
    opx.navigate('details', { 
      onboardingData: { profile_image: selectedImage } 
    });
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      <View style={{ paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' }}>
        <Text style={MyStyleSheet.landingWelcomeText}>Add a profile picture</Text>
        <View style={{ width: '100%', marginTop: 30, position: 'relative' }}>
          <View style={{ position: 'absolute', top: 15, left: 40, right: 40, height: 2, backgroundColor: '#2E3A91', zIndex: -1 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleActive}><Text style={MyStyleSheet.stepTextActive}>1</Text></View>
              <Text style={MyStyleSheet.stepLabelActive}>Add a profile{"\n"}picture</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>2</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>How can we{"\n"}reach you?</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>3</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>Background</Text>
            </View>
            <View style={MyStyleSheet.stepWrapper}>
              <View style={MyStyleSheet.stepCircleInactive}><Text style={MyStyleSheet.stepTextInactive}>4</Text></View>
              <Text style={MyStyleSheet.stepLabelInactive}>Address</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleChoosePhoto} style={MyStyleSheet.largeProfileCircle}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', borderRadius: 150 }} />
          ) : (
            <Image source={require('../public/profilepic.png')} style={{ width: 280, height: 280, tintColor: '#2E3A91' }} resizeMode="contain" />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 40, paddingBottom: 60 }}>
        <TouchableOpacity style={MyStyleSheet.landingSignUpBtn} onPress={handleNext}>
          <Text style={MyStyleSheet.landingSignUpText}>{selectedImage ? "Next" : "Upload picture"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 25, alignItems: 'center' }} onPress={handleNext}>
          <Text style={{ color: '#2E3A91', fontWeight: 'bold', fontSize: 18 }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}