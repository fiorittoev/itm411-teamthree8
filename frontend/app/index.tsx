/*import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { supabase } from '../services/supabase';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/auth');
        }
      } catch (err) {
        console.error('Error checking session:', err);
        router.replace('/auth');
      }
    };

    checkSession();
  }, [router]);

  return <View style={{ flex: 1 }} />;
}*/
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}

