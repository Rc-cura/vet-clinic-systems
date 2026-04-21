import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { launchImageLibrary } from 'react-native-image-picker' 
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddProfilePic() {
  const opx = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhoto = () => {
    const options = { mediaType: 'photo', quality: 1 };
    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={MyStyleSheet.whiteContainer}>
      
      <View style={{ paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' }}>
        <Text style={MyStyleSheet.landingWelcomeText}>Add a profile picture</Text>

        {/* --- UPDATED SMOOTH STEPPER --- */}
<View style={{ width: '100%', marginTop: 30, position: 'relative' }}>
  {/* Single Background Line */}
  <View style={{
    position: 'absolute',
    top: 15,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: '#2E3A91',
    zIndex: -1
  }} />

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
        {/* Profile Large Icon/Image */}
        <TouchableOpacity onPress={handleChoosePhoto} style={MyStyleSheet.largeProfileCircle}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', borderRadius: 150 }} />
          ) : (
            <Image 
                source={require('../public/profilepic.png')} 
                style={{ width: 280, height: 280, tintColor: '#2E3A91' }} 
                resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 40, paddingBottom: 60 }}>
        <TouchableOpacity style={MyStyleSheet.landingSignUpBtn} onPress={handleChoosePhoto}>
          <Text style={MyStyleSheet.landingSignUpText}>Upload picture</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: 25, alignItems: 'center' }}
          onPress={() => opx.navigate('details')}
        >
          <Text style={{ color: '#2E3A91', fontWeight: 'bold', fontSize: 18 }}>Skip</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}