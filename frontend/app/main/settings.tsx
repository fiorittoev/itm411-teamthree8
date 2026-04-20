/**
 * Settings screen – reads/writes profile via backend API.
 * Address + community changes use the same Maps autocomplete + nearby-lakes
 * flow as the registration LocationStep.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Modal,
  SafeAreaView, ActivityIndicator, Alert, Switch, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import * as ImagePicker from 'expo-image-picker';
import { mainStyles as s } from '../styles/main/mainStyles';
import { COLORS } from '../styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressComponents {
  street: string;
  apt: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface LakeOption {
  name: string;
  id: string | null;
}

interface Suggestion {
  place_id: string;
  description: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token ?? ''}`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();

  // ── loading / saving ──
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── simple text fields ──
  const [username, setUsername] = useState('');
  const [bio, setBio]           = useState('');

  // ── address / community (backend-sourced) ──
  const [address, setAddress]           = useState('');      // formatted string stored in profile
  const [community, setCommunity]       = useState('');
  const [communityId, setCommunityId]   = useState<string | null>(null);

  // ── modal control ──
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField]         = useState<
    'username' | 'bio' | 'address' | 'account' | 'picture' | null
  >(null);

  // -- business & picture state --
  const [isBusiness, setIsBusiness]     = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // ── address-flow state (mirrors LocationStep) ──
  const [addrComponents, setAddrComponents] = useState<AddressComponents>({
    street: '', apt: '', city: '', state: '', zipcode: '', country: 'US',
  });
  const [inputText, setInputText]             = useState('');
  const [suggestions, setSuggestions]         = useState<Suggestion[]>([]);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [addrLoading, setAddrLoading]           = useState(false);
  const [addrSearched, setAddrSearched]         = useState(false);
  const [lakeOptions, setLakeOptions]           = useState<LakeOption[]>([]);
  const [pendingCommunity, setPendingCommunity] = useState<LakeOption | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch profile from backend ───────────────────────────────────────────

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/profile/me`, { headers });
      if (res.status === 401) { router.replace('/options'); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setUsername(data.username  ?? '');
      setBio(data.bio            ?? '');
      setAddress(data.address    ?? '');
      setCommunity(data.community ?? '');
      setCommunityId(data.community_id ?? null);
      setIsBusiness(data.is_business ?? false);
      setBusinessName(data.business_name ?? '');
      setProfileImageUrl(data.profile_image_url ?? '');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  // ─── Save simple fields (username / bio) ──────────────────────────────────

  async function saveSimpleField() {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      let payload: any = {};
      
      if (editingField === 'username') payload.username = username;
      else if (editingField === 'bio') payload.bio = bio;
      else if (editingField === 'account') {
        payload.is_business = isBusiness;
        payload.business_name = businessName;
      }
      else if (editingField === 'picture') payload.profile_image_url = profileImageUrl;

      const res = await fetch(`${API_URL}/profile/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      Alert.alert('Success', 'Profile updated');
      setEditModalVisible(false);
      fetchProfile();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const base64Image = `data:image/jpeg;base64,${asset.base64}`;
      setProfileImageUrl(base64Image);
    }
  }

  // ─── Save address + community ─────────────────────────────────────────────

  async function saveAddressAndCommunity() {
    if (!addressConfirmed || !pendingCommunity) return;
    setSaving(true);
    try {
      const headers = await getAuthHeaders();

      const fullAddress = [
        addrComponents.street,
        addrComponents.apt,
        addrComponents.city,
        addrComponents.state && addrComponents.zipcode
          ? `${addrComponents.state} ${addrComponents.zipcode}`
          : addrComponents.state || addrComponents.zipcode,
        addrComponents.country,
      ].filter(Boolean).join(', ');

      const res = await fetch(`${API_URL}/profile/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          address:      fullAddress,
          community:    pendingCommunity.name,
          community_id: pendingCommunity.id ?? undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setAddress(fullAddress);
      setCommunity(pendingCommunity.name);
      setCommunityId(pendingCommunity.id);
      Alert.alert('Success', 'Address & community updated');
      setEditModalVisible(false);
      resetAddressFlow();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // ─── Address autocomplete helpers (mirrors LocationStep) ─────────────────

  function resetAddressFlow() {
    setInputText('');
    setSuggestions([]);
    setAddressConfirmed(false);
    setAddrComponents({ street: '', apt: '', city: '', state: '', zipcode: '', country: 'US' });
    setLakeOptions([]);
    setAddrSearched(false);
    setPendingCommunity(null);
  }

  function handleAddressInput(text: string) {
    setInputText(text);
    setAddressConfirmed(false);
    setSuggestions([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length < 3) return;
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 400);
  }

  async function fetchSuggestions(input: string) {
    try {
      const res = await fetch(`${API_URL}/maps/autocomplete?input=${encodeURIComponent(input)}`);
      const json = await res.json();
      setSuggestions(json.predictions?.slice(0, 5) ?? []);
    } catch (err) {
    }
  }

  async function selectSuggestion(suggestion: Suggestion) {
    setSuggestions([]);
    setInputText(suggestion.description);
    try {
      const res  = await fetch(`${API_URL}/maps/place-details?place_id=${suggestion.place_id}`);
      const json = await res.json();
      const components = json.result?.address_components ?? [];

      const get      = (type: string) => components.find((c: any) => c.types.includes(type))?.long_name  ?? '';
      const getShort = (type: string) => components.find((c: any) => c.types.includes(type))?.short_name ?? '';

      const parsed: AddressComponents = {
        street:  `${get('street_number')} ${get('route')}`.trim(),
        apt:     '',
        city:    get('locality') || get('sublocality') || get('neighborhood'),
        state:   getShort('administrative_area_level_1'),
        zipcode: get('postal_code'),
        country: getShort('country'),
      };

      setAddrComponents(parsed);
      setAddressConfirmed(true);
      setPendingCommunity(null);

      const { lat, lng } = json.result.geometry.location;
      findNearbyLakes(lat, lng);
    } catch (err) {
    }
  }

  async function findNearbyLakes(lat: number, lng: number) {
    setAddrLoading(true);
    setAddrSearched(false);
    setLakeOptions([]);
    try {
      const placesRes  = await fetch(`${API_URL}/maps/nearby-lakes?lat=${lat}&lng=${lng}`);
      const placesData = await placesRes.json();
      const rawResults = (placesData.results ?? []).slice(0, 5);
      const lakeNames: string[] = rawResults.map((l: any) => l.name);

      if (!lakeNames.length) { setAddrSearched(true); return; }

      const { data: existingCommunities } = await supabase
        .from('communities')
        .select('id, name')
        .in('name', lakeNames);

      const merged: LakeOption[] = rawResults.map((lake: any) => {
        const existing = existingCommunities?.find((c) => c.name === lake.name);
        return { name: lake.name, id: existing?.id ?? null };
      });

      setLakeOptions(merged);
    } catch (err) {
    } finally {
      setAddrLoading(false);
      setAddrSearched(true);
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/options');
  }

  // ─── Open modal ───────────────────────────────────────────────────────────

  function openEdit(field: 'username' | 'bio' | 'address' | 'account' | 'picture') {
    setEditingField(field);
    if (field === 'address') resetAddressFlow();
    setEditModalVisible(true);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.centered]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  const fullAddrPreview = [
    addrComponents.street,
    addrComponents.apt,
    addrComponents.city,
    addrComponents.state && addrComponents.zipcode
      ? `${addrComponents.state} ${addrComponents.zipcode}`
      : addrComponents.state || addrComponents.zipcode,
    addrComponents.country,
  ].filter(Boolean).join(', ');

  const canSaveAddress = addressConfirmed && !!pendingCommunity;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── BODY ── */}
      <View style={s.settingsPanel}>
        <ScrollView contentContainerStyle={s.settingsContent} showsVerticalScrollIndicator={false}>

          {/* Profile section */}
          <View style={s.settingsSection}>
            <Text style={s.settingsSectionTitle}>Profile</Text>

            <TouchableOpacity style={s.settingsRow} onPress={() => openEdit('username')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="person-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Display Name</Text>
                  <Text style={s.settingsRowValue}>{username || 'Not set'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={s.settingsRow} onPress={() => openEdit('picture')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="image-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Profile Picture</Text>
                  <Text style={s.settingsRowValue}>Change photo</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                 {profileImageUrl ? (
                   <Image 
                     source={{ uri: profileImageUrl }} 
                     style={{ width: 32, height: 32, borderRadius: 16 }} 
                   />
                 ) : (
                   <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                     <Ionicons name="camera" size={16} color="#999" />
                   </View>
                 )}
                 <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.settingsRow} onPress={() => openEdit('account')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="business-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Account Type</Text>
                  <Text style={s.settingsRowValue}>
                    {isBusiness ? `Business (${businessName})` : 'Personal Account'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={s.settingsRow} onPress={() => openEdit('bio')}>
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

            {/* Address + community combined row */}
            <TouchableOpacity style={s.settingsRow} onPress={() => openEdit('address')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="location-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Address & Lake Community</Text>
                  <Text style={s.settingsRowValue} numberOfLines={1}>
                    {address || 'Not set'}
                    {community ? `  ·  ${community}` : ''}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={s.settingsSection}>
            <TouchableOpacity style={s.settingsRow} onPress={() => router.push('/main/profile')}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="person-circle-outline" size={22} color="#666" />
                <Text style={s.settingsRowLabel}>View Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[s.btn, s.logoutBtn]} onPress={handleLogout}>
            <Text style={s.btnText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── EDIT MODAL ── */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.settingsModal}>

            {/* ── username / bio / account / picture modal ── */}
            {(editingField === 'username' || editingField === 'bio' || editingField === 'account' || editingField === 'picture') && (
              <>
                <Text style={s.settingsModalTitle}>
                  {editingField === 'username' ? 'Edit Display Name' : 
                   editingField === 'bio' ? 'Edit Bio' :
                   editingField === 'account' ? 'Account Preferences' : 'Profile Picture'}
                </Text>

                {editingField === 'bio' && (
                  <TextInput
                    style={[s.input, s.textarea]}
                    placeholder="Tell others about yourself"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
                
                {editingField === 'username' && (
                  <TextInput
                    style={s.input}
                    placeholder="Enter display name"
                    value={username}
                    onChangeText={setUsername}
                  />
                )}

                {editingField === 'account' && (
                  <View style={{ gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 16, color: '#333' }}>Business Account</Text>
                      <Switch 
                        value={isBusiness} 
                        onValueChange={setIsBusiness}
                        trackColor={{ false: '#ddd', true: '#4F728C' }}
                      />
                    </View>
                    {isBusiness && (
                      <View>
                        <Text style={s.settingsRowLabel}>Business Name</Text>
                        <TextInput
                          style={s.input}
                          placeholder="Enter your business name"
                          value={businessName}
                          onChangeText={setBusinessName}
                        />
                      </View>
                    )}
                  </View>
                )}

                {editingField === 'picture' && (
                  <View style={{ alignItems: 'center', gap: 24, paddingVertical: 10 }}>
                    <TouchableOpacity onPress={pickImage} style={{ 
                      width: 150, 
                      height: 150, 
                      borderRadius: 75, 
                      backgroundColor: '#f8f8f8',
                      borderWidth: 1,
                      borderColor: '#eee',
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      {profileImageUrl ? (
                        <Image source={{ uri: profileImageUrl }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Ionicons name="camera-outline" size={48} color="#4F728C" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={[s.btn, { backgroundColor: '#f0f4f7' }]}>
                      <Text style={{ color: '#4F728C', fontWeight: '600' }}>Choose New Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={s.modalActions}>
                  <TouchableOpacity
                    style={[s.btn, s.btnCancel]}
                    onPress={() => { setEditModalVisible(false); fetchProfile(); }}
                  >
                    <Text style={s.btnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.btn, s.btnBlue]}
                    onPress={saveSimpleField}
                    disabled={saving}
                  >
                    {saving
                      ? <ActivityIndicator color="white" />
                      : <Text style={s.btnText}>Save</Text>
                    }
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* ── address + community modal ── */}
            {editingField === 'address' && (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={s.settingsModalTitle}>Update Address & Community</Text>

                {/* Autocomplete input */}
                <Text style={s.settingsRowLabel}>Search your address</Text>
                <View style={s.addressInputContainer}>
                  <TextInput
                    style={[s.input, s.addressInputBase]}
                    placeholder="Start typing your address..."
                    value={inputText}
                    onChangeText={handleAddressInput}
                  />
                  {suggestions.length > 0 && (
                    <View style={s.addressSuggestions}>
                      {suggestions.map((suggestion, i) => (
                        <TouchableOpacity
                          key={suggestion.place_id}
                          onPress={() => selectSuggestion(suggestion)}
                          style={[s.addressSuggestionItem, {
                            borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                            borderBottomColor: '#eee',
                          }]}
                        >
                          <Text style={s.addressSuggestionText}>{suggestion.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Apt field */}
                <TextInput
                  style={[s.input, s.addressAptField]}
                  placeholder="Apt, Suite, Unit (optional)"
                  value={addrComponents.apt}
                  onChangeText={(v) => setAddrComponents((prev) => ({ ...prev, apt: v }))}
                />

                {/* Confirmed address preview */}
                {addressConfirmed && (
                  <View style={s.addressConfirmed}>
                    <Text style={s.addressConfirmedLabel}>
                      Address confirmed
                    </Text>
                    <Text style={s.addressConfirmedText}>{fullAddrPreview}</Text>
                    <TouchableOpacity onPress={resetAddressFlow} style={s.addressChangeLink}>
                      <Text style={s.addressChangeLink}>Change address</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Lake community picker */}
                {addressConfirmed && (
                  <View style={s.communitySelectorContainer}>
                    <Text style={s.settingsRowLabel}>Select Lake Community</Text>

                    {addrLoading && (
                      <View style={s.communityLoadingContainer}>
                        <ActivityIndicator color="#4F728C" />
                        <Text style={s.communityLoadingText}>Finding nearby lakes...</Text>
                      </View>
                    )}

                    {!addrLoading && addrSearched && lakeOptions.length === 0 && (
                      <View style={s.communityNotFound}>
                        <Text style={s.communityNotFoundText}>No lakes found near this address</Text>
                        <Text style={s.communityNotFoundSubtext}>
                          Double-check your address or try a nearby ZIP code.
                        </Text>
                      </View>
                    )}

                    {!addrLoading && lakeOptions.map((lake) => {
                      const selected = pendingCommunity?.name === lake.name;
                      return (
                        <TouchableOpacity
                          key={lake.name}
                          onPress={() => setPendingCommunity(lake)}
                          style={[
                            s.communityOption,
                            selected ? s.communityOptionSelected : s.communityOptionUnselected,
                          ]}
                        >
                          <View>
                            <Text style={[
                              s.communityOptionLabel,
                              selected ? s.communityOptionLabelSelected : s.communityOptionLabelUnselected,
                            ]}>
                              {lake.name}
                            </Text>
                            <Text style={[
                              s.communityOptionSubtext,
                              lake.id ? s.communityOptionSubtextExisting : s.communityOptionSubtextNew,
                            ]}>
                              {lake.id ? 'Existing community' : 'New — will be created'}
                            </Text>
                          </View>
                          {selected && <Ionicons name="checkmark" size={16} color={COLORS.primary} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Modal actions */}
                <View style={[s.modalActions, { marginTop: 16 }]}>
                  <TouchableOpacity
                    style={[s.btn, s.btnCancel]}
                    onPress={() => { setEditModalVisible(false); resetAddressFlow(); }}
                  >
                    <Text style={s.btnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.btn, s.btnBlue, !canSaveAddress && { opacity: 0.5 }]}
                    onPress={saveAddressAndCommunity}
                    disabled={!canSaveAddress || saving}
                  >
                    {saving
                      ? <ActivityIndicator color="white" />
                      : <Text style={s.btnText}>Save</Text>
                    }
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}