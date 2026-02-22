/**
 * Settings screen – same style as marketplace/home: navbar + white content panel.
 * Profile fields, privacy toggles, notifications; edit modal uses same modal styles.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Modal,
  SafeAreaView, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';

export default function SettingsScreen() {

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/options")  // or wherever your auth entry point is
  }
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [community, setCommunity] = useState('');

  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setUsername(profileData.username || '');
        setBio(profileData.bio || '');
        setAddress(profileData.address || '');
        setCommunity(profileData.community || '');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          address,
          community,
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
      setEditModalVisible(false);
      fetchProfile();
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.centered]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* NAV – same as marketplace/home/profile */}
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
            <Ionicons name="settings" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/main/profile')}>
          <View style={s.profileCircle}>
            <Ionicons name="person-outline" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* BODY – white panel like marketplace/profile */}
      <View style={s.settingsPanel}>
        <ScrollView contentContainerStyle={s.settingsContent} showsVerticalScrollIndicator={false}>
          <View style={s.settingsSection}>
            <Text style={s.settingsSectionTitle}>Profile</Text>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                setEditingField('username');
                setEditModalVisible(true);
              }}
            >
              <View style={s.settingsRowLeft}>
                <Ionicons name="person-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Display Name</Text>
                  <Text style={s.settingsRowValue}>{username || 'Not set'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                setEditingField('bio');
                setEditModalVisible(true);
              }}
            >
              <View style={s.settingsRowLeft}>
                <Ionicons name="document-text-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Bio</Text>
                  <Text style={s.settingsRowValue} numberOfLines={1}>
                    {bio || 'Tell others about yourself'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                setEditingField('address');
                setEditModalVisible(true);
              }}
            >
              <View style={s.settingsRowLeft}>
                <Ionicons name="location-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Address</Text>
                  <Text style={s.settingsRowValue} numberOfLines={1}>
                    {address || 'Not set'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.settingsRow}
              onPress={() => {
                setEditingField('community');
                setEditModalVisible(true);
              }}
            >
              <View style={s.settingsRowLeft}>
                <Ionicons name="water-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Lake Community</Text>
                  <Text style={s.settingsRowValue}>{community || 'Not set'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={s.settingsSection}>
            <Text style={s.settingsSectionTitle}>Privacy</Text>

            <View style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="mail-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Show Email</Text>
                  <Text style={s.settingsRowSubtext}>Allow others to see your email</Text>
                </View>
              </View>
              <Switch
                value={showEmail}
                onValueChange={setShowEmail}
                trackColor={{ false: '#ddd', true: '#4F728C' }}
              />
            </View>

            <View style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="call-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Show Phone</Text>
                  <Text style={s.settingsRowSubtext}>Allow others to see your phone</Text>
                </View>
              </View>
              <Switch
                value={showPhone}
                onValueChange={setShowPhone}
                trackColor={{ false: '#ddd', true: '#4F728C' }}
              />
            </View>
          </View>

          <View style={s.settingsSection}>
            <Text style={s.settingsSectionTitle}>Notifications</Text>

            <View style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="notifications-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Push Notifications</Text>
                  <Text style={s.settingsRowSubtext}>Receive notifications about activity</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ddd', true: '#4F728C' }}
              />
            </View>
          </View>

          <View style={s.settingsSection}>
            <TouchableOpacity style={s.settingsRow} onPress={() => router.push('/main/profile')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="person-circle-outline" size={22} color="#666" />
                <Text style={s.settingsRowLabel}>View Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#666" />
                <Text style={s.settingsRowLabel}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="information-circle-outline" size={22} color="#666" />
                <Text style={s.settingsRowLabel}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[s.btn, { backgroundColor: "#c0392b" }]} onPress={handleLogout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Edit Modal – same overlay/modalBox pattern as marketplace */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.settingsModal}>
            <Text style={s.settingsModalTitle}>
              Edit {editingField === 'username' ? 'Display Name' :
                editingField === 'bio' ? 'Bio' :
                  editingField === 'address' ? 'Address' : 'Lake Community'}
            </Text>

            {editingField === 'bio' ? (
              <TextInput
                style={[s.input, s.textarea]}
                placeholder="Tell others about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <TextInput
                style={s.input}
                placeholder={`Enter ${editingField}`}
                value={
                  editingField === 'username' ? username :
                    editingField === 'address' ? address : community
                }
                onChangeText={(text) => {
                  if (editingField === 'username') setUsername(text);
                  else if (editingField === 'address') setAddress(text);
                  else setCommunity(text);
                }}
              />
            )}
            

            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.btn, s.btnCancel]}
                onPress={() => {
                  setEditModalVisible(false);
                  fetchProfile();
                }}
              >
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, s.btnBlue]}
                onPress={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={s.btnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
            
          </View>
          
        </View>
        
        
      </Modal>
      
    </SafeAreaView>
  );
}
