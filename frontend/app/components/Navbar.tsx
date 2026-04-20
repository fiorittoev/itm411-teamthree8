import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mainStyles as s, responsiveStyles as rs } from '../styles/main/mainStyles';

interface NavbarProps {
  id: string | null;
  isBusiness?: boolean;
  profileImageUrl?: string | null;
}

export function Navbar({ id, isBusiness, profileImageUrl }: NavbarProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={[s.navbar, isMobile && rs.navbarMobile]}>
      {!isMobile && <Text style={s.logo}>MyMichiganLake</Text>}
      <View style={s.navIcons}>
        <TouchableOpacity onPress={() => router.push('/main')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/communities')}>
          <Ionicons name="water-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/marketplace')}>
          <Ionicons name="cart-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/search')}>
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
        {isBusiness && (
          <TouchableOpacity onPress={() => router.push('/main/submit-ad')}>
            <Ionicons name="megaphone-outline" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => {
          if (id) router.push(`/main/profile/${id}`);
        }}>
        <View style={s.profileCircle}>
          {profileImageUrl ? (
            <Image 
              source={{ uri: profileImageUrl }} 
              style={{ width: '100%', height: '100%', borderRadius: 15 }} 
            />
          ) : (
            <Ionicons name="person-outline" size={20} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
