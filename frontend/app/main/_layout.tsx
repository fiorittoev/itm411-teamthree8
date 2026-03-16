import { Stack } from 'expo-router';
import { Navbar } from '../components/main';
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { api } from '../../services/api';

export default function TabLayout() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const profile = await api.get<{id: string}>('/profile/me');
        setUserId(profile.id);
      } catch (e) {
        console.warn('Error fetching profile in layout', e);
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
    
      <Navbar id={userId}/>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="marketplace" />
        <Stack.Screen name="search" />
        <Stack.Screen name="communities" />
        <Stack.Screen name="profile/index" />
      </Stack>

    </View>
  );
}
