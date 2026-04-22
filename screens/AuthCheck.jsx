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
        // Direktang kunin sa Supabase ang session para walang delay
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        console.log("2. Session fetched:", session ? "Active Session Found" : "No Session");

        if (!session || authError) {
          console.log("3. Walang session. Redirecting to login...");
          opx.replace('login'); // 🚨 CHECK SPELLING SA APP.JS
          return;
        }

        const userId = session.user.id;
        console.log("4. User ID:", userId);

        // Tignan sa database kung may profile na
        const { data, error } = await supabase
          .from('customer_profile_meta')
          .select('customer_id')
          .eq('customer_id', userId)
          .single();

        console.log("5. Database checked. Data:", data, "Error:", error?.code);

        if (!data || error?.code === 'PGRST116') {
          console.log("6. First time user! Going to AddProfilePic...");
          // 🚨 PAKI-CHECK ANG EXACT SPELLING NITO SA APP.JS MO:
          opx.replace('profilepic'); 
        } else {
          console.log("6. Returning user! Going to dashboard...");
          // 🚨 PAKI-CHECK ANG EXACT SPELLING NITO SA APP.JS MO:
          opx.replace('dashboard'); 
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
      <Text style={styles.text}>Setting things up...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  text: { marginTop: 15, color: '#2E3A91', fontSize: 16, fontWeight: '500' }
});