/**
 * Profile screen – same style as marketplace/home: navbar + white content panel.
 * Loads profile from Supabase profiles table.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    username?: string;
    bio?: string;
    address?: string;
    community?: string;
  } | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/options');
        return;
      }
      setEmail(user.email ?? '');

      const { data } = await supabase
        .from('profiles')
        .select('username, bio, address, community')
        .eq('id', user.id)
        .single();

      setProfile(data ?? null);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.centered]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  const displayName = profile?.username?.trim() || email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={s.safe}>
      {/* NAV – same as marketplace/home */}
      <View style={s.navbar}>
        <Text style={s.logo}>MyMichiganLake</Text>
        <View style={s.navIcons}>
          <TouchableOpacity onPress={() => router.push('/main')}>
            <Ionicons name="home-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/marketplace')}>
            <Ionicons name="cart-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/settings')}>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View style={s.profileCircle}>
          <Ionicons name="person" size={20} color="white" />
        </View>
      </View>

      {/* BODY – white panel like marketplace */}
      <View style={s.profilePanel}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={s.profileHeader}>
            <View style={s.profileAvatar}>
              <Ionicons name="person" size={44} color="white" />
            </View>
            <Text style={s.profileName}>{displayName}</Text>
            {email ? <Text style={s.profileMeta}>{email}</Text> : null}
          </View>

          <View style={s.profileBody}>
            {profile?.bio ? (
              <View style={s.profileRow}>
                <View style={s.profileRowIcon}>
                  <Ionicons name="document-text-outline" size={22} color="#666" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.profileRowLabel}>Bio</Text>
                  <Text style={s.profileRowValue}>{profile.bio}</Text>
                </View>
              </View>
            ) : null}

            {profile?.address ? (
              <View style={s.profileRow}>
                <View style={s.profileRowIcon}>
                  <Ionicons name="location-outline" size={22} color="#666" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.profileRowLabel}>Address</Text>
                  <Text style={s.profileRowValue}>{profile.address}</Text>
                </View>
              </View>
            ) : null}

            {profile?.community ? (
              <View style={s.profileRow}>
                <View style={s.profileRowIcon}>
                  <Ionicons name="water-outline" size={22} color="#666" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.profileRowLabel}>Lake Community</Text>
                  <Text style={s.profileRowValue}>{profile.community}</Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={s.profileAction}
              onPress={() => router.push('/main/settings')}
            >
              <Text style={s.profileActionText}>Edit Profile & Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.profileAction, { backgroundColor: '#4F728C' }]}
              onPress={() => router.push('/main/marketplace')}
            >
              <Text style={s.profileActionText}>My Listings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
