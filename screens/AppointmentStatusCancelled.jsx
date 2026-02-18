import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Image, BackHandler } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyStyleSheet from '../styles/MyStyleSheet';

export default function AppointmentStatusCancelled() {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointment } = route.params || {};

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Thursday, 05 February";
    const date = new Date(dateString);
    const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    return `${weekday}, ${day} ${month}`;
  };

  useEffect(() => {
    const backAction = () => { navigation.navigate('appointment'); return true; };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') { e.preventDefault(); navigation.navigate('appointment'); }
    });
    return () => { backHandler.remove(); unsubscribe(); };
  }, [navigation]);

  return (
    <SafeAreaView style={MyStyleSheet.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 40, paddingTop: 20 }}>
        <View style={MyStyleSheet.detailsMainCard}>
          <Text style={MyStyleSheet.detailsDateText}>{formatDisplayDate(appointment?.date)}</Text>
          <Text style={MyStyleSheet.detailsTimeText}>{appointment?.time}</Text>
          <View style={[MyStyleSheet.detailsStatusBadge, { backgroundColor: '#FFBDBD', width: '100%' }]}>
            <Text style={[MyStyleSheet.detailsStatusText, { color: '#000', alignSelf: "center" }]}>Cancelled Appointment</Text>
          </View>
        </View>

        <View style={MyStyleSheet.summaryCard}>
          <View style={MyStyleSheet.iconPlaceholderCircle}>
            <Image source={appointment?.petImage ? { uri: appointment.petImage } : require('../public/blackpaw.svg')} style={{ width: 35, height: 35, borderRadius: 17.5 }} />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={MyStyleSheet.cardTitleText}>{appointment?.pet}</Text>
              <Text style={{ color: '#AAA' }}>{appointment?.petWeight} kg</Text>
            </View>
            <Text style={MyStyleSheet.cardSubText}>{appointment?.petDetails}</Text>
          </View>
        </View>

        <TouchableOpacity style={MyStyleSheet.primaryBlueBtn} onPress={() => navigation.navigate('selectpet')}>
          <Text style={MyStyleSheet.primaryBlueBtnText}>Book an Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}