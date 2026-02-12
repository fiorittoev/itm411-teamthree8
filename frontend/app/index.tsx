import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { supabase } from '../services/supabase';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication and redirect accordingly
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/(tabs)/home');
        } 
        else {
          router.replace('/options');
        }
      } 
      catch (err) {
        console.error('Error checking session:', err);
        router.replace('/options');
      }
    };
    checkSession();
  },[router]);
  return <View style={{ flex: 1 }} />;
}
