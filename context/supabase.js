import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Dashboard -> Settings -> API
const supabaseUrl = 'https://bicrvquvjsyjttiskkjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY3J2cXV2anN5anR0aXNra2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDIwMTMsImV4cCI6MjA4NTQxODAxM30.y5Kh3l_5OunO40Du3wopKY706K6zTS33JEFBqasrji4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});