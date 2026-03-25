import { Stack } from 'expo-router';
import { Navbar } from '../components/main';
import { View, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { api } from '../../services/api';

export default function TabLayout() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isBusiness, setIsBusiness] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const profile = await api.get<{id: string, is_business: boolean, profile_image_url?: string}>('/profile/me');
        setUserId(profile.id);
        setIsBusiness(profile.is_business);
        setProfileImageUrl(profile.profile_image_url ?? null);
      } catch (e) {
        console.warn('Error fetching profile in layout', e);
      }
    }
  }

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={{ flex: 1 }}>
      {!isMobile && <Navbar id={userId} isBusiness={isBusiness} profileImageUrl={profileImageUrl}/>}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="marketplace" />
        <Stack.Screen name="search" />
        <Stack.Screen name="communities" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="submit-ad" />
      </Stack>
      {isMobile && <Navbar id={userId} isBusiness={isBusiness} profileImageUrl={profileImageUrl}/>}
    </View>
  );
}
