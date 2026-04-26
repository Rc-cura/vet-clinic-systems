import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../context/supabase'; 

export default function AuthCheck() {
  const opx = useNavigation();

  useEffect(() => {
    const routeUser = async () => {
      console.log("1. AuthCheck started...");

      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (!session || authError) {
          console.log("2. Walang session. Redirecting to login...");
          opx.replace('login'); 
          return;
        }

        const userId = session.user.id;
        console.log("3. User ID:", userId);

        // Check 1: Tignan kung may profile meta (background/pic)
        const { data: metaData } = await supabase
          .from('customer_profile_meta')
          .select('customer_id')
          .eq('customer_id', userId)
          .maybeSingle(); 

        // Check 2: Tignan kung may address na
        // Note: Kung ang column name mo sa address table ay 'user_id' imbes na 'customer_id', palitan mo lang yung nasa .eq()
        const { data: addressData } = await supabase
          .from('customer_addresses')
          .select('customer_id') 
          .eq('customer_id', userId)
          .maybeSingle();

        console.log("4. Meta Data:", metaData ? "Found" : "Missing");
        console.log("5. Address Data:", addressData ? "Found" : "Missing");

        // Kung parehong may laman, sa dashboard na
        if (metaData && addressData) {
          console.log("6. Kumpleto ang profile! Going to dashboard...");
          opx.replace('dashboard'); 
        } else {
          // Kung may kulang, ipadala sa setup screen
          console.log("6. May kulang sa profile/address! Going to AddProfilePic...");
          opx.replace('profilepic'); 
        }

      } catch (err) {
        console.error("7. Error sa Try-Catch block:", err);
        opx.replace('login');
      }
    };

    routeUser();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E3A91" />
      <Text style={styles.text}>Syncing your profile...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  text: { marginTop: 15, color: '#2E3A91', fontSize: 16, fontWeight: '500' }
});