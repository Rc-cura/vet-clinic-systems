import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { launchImageLibrary } from 'react-native-image-picker' // Import the picker
import MyStyleSheet from '../styles/MyStyleSheet'

export default function AddProfilePic() {
  const opx = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={MyStyleSheet.profilepic_container}>
      


      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Text style={MyStyleSheet.profilepic_title}>Add a profile picture</Text>
        
        <Text style={MyStyleSheet.profilepic_subtitle}>
          Add a photo to personalize your account. This will be visible to the veterinary staff during your appointments.
        </Text>

        {/* Profile Placeholder Circle */}
        <View style={MyStyleSheet.profilepic_circle}>
           <View style={[MyStyleSheet.profilepic_icon, { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }]}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text style={{ fontSize: 90, color: '#FFF', textAlign: 'center', marginTop: 15 }}>👤</Text>
              )}
           </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={MyStyleSheet.profilepic_addBtn} onPress={handleChoosePhoto}>
          <Text style={MyStyleSheet.profilepic_btnText}>Add picture</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={MyStyleSheet.profilepic_skipBtn}
          onPress={() => opx.navigate('details')}
        >
          <Text style={MyStyleSheet.profilepic_skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}