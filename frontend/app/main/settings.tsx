/**
 * Settings screen – reads/writes profile via backend API.
 * Address + community changes use the same Maps autocomplete + nearby-lakes
 * flow as the registration LocationStep.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput, Modal,
  SafeAreaView, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';

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

  // ── privacy / notifications (local state only – extend to backend as needed) ──
  const [showEmail, setShowEmail]         = useState(true);
  const [showPhone, setShowPhone]         = useState(true);
  const [notifications, setNotifications] = useState(true);

  // ── modal control ──
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField]         = useState<
    'username' | 'bio' | 'address' | null
  >(null);

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
      const payload =
        editingField === 'username' ? { username } :
        editingField === 'bio'      ? { bio }      : {};

      const res = await fetch(`${API_URL}/profile/me`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      Alert.alert('Success', 'Profile updated');
      setEditModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
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
      console.error('Autocomplete error:', err);
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
      console.error('Place details error:', err);
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
      console.error('Error finding lakes:', err);
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

  function openEdit(field: 'username' | 'bio' | 'address') {
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
      {/* ── NAV ── */}
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

          {/* Privacy section */}
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
              <Switch value={showEmail} onValueChange={setShowEmail} trackColor={{ false: '#ddd', true: '#4F728C' }} />
            </View>

            <View style={s.settingsRow}>
              <View style={s.settingsRowLeft}>
                <Ionicons name="call-outline" size={22} color="#666" />
                <View style={s.settingsRowText}>
                  <Text style={s.settingsRowLabel}>Show Phone</Text>
                  <Text style={s.settingsRowSubtext}>Allow others to see your phone</Text>
                </View>
              </View>
              <Switch value={showPhone} onValueChange={setShowPhone} trackColor={{ false: '#ddd', true: '#4F728C' }} />
            </View>
          </View>

          {/* Notifications section */}
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
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#ddd', true: '#4F728C' }} />
            </View>
          </View>

          {/* Other section */}
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

          <TouchableOpacity style={[s.btn, { backgroundColor: '#c0392b' }]} onPress={handleLogout}>
            <Text style={s.btnText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* ── EDIT MODAL ── */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.settingsModal}>

            {/* ── username / bio modal ── */}
            {(editingField === 'username' || editingField === 'bio') && (
              <>
                <Text style={s.settingsModalTitle}>
                  Edit {editingField === 'username' ? 'Display Name' : 'Bio'}
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
                    placeholder="Enter display name"
                    value={username}
                    onChangeText={setUsername}
                  />
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
                <View style={{ position: 'relative', zIndex: 10 }}>
                  <TextInput
                    style={[s.input, { marginBottom: 0 }]}
                    placeholder="Start typing your address..."
                    value={inputText}
                    onChangeText={handleAddressInput}
                  />
                  {suggestions.length > 0 && (
                    <View style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      backgroundColor: 'white', borderRadius: 8, zIndex: 20,
                      shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6,
                      elevation: 6,
                    }}>
                      {suggestions.map((suggestion, i) => (
                        <TouchableOpacity
                          key={suggestion.place_id}
                          onPress={() => selectSuggestion(suggestion)}
                          style={{
                            padding: 12,
                            borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                            borderBottomColor: '#eee',
                          }}
                        >
                          <Text style={{ fontSize: 14, color: '#333' }}>{suggestion.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Apt field */}
                <TextInput
                  style={[s.input, { marginTop: 10 }]}
                  placeholder="Apt, Suite, Unit (optional)"
                  value={addrComponents.apt}
                  onChangeText={(v) => setAddrComponents((prev) => ({ ...prev, apt: v }))}
                />

                {/* Confirmed address preview */}
                {addressConfirmed && (
                  <View style={{
                    padding: 12, borderRadius: 8, marginVertical: 8,
                    backgroundColor: '#f0f7ff', borderWidth: 1, borderColor: '#4F728C',
                  }}>
                    <Text style={{ fontSize: 13, color: '#4F728C', fontWeight: '600', marginBottom: 4 }}>
                      ✓ Address confirmed
                    </Text>
                    <Text style={{ fontSize: 13, color: '#333' }}>{fullAddrPreview}</Text>
                    <TouchableOpacity onPress={resetAddressFlow} style={{ marginTop: 6 }}>
                      <Text style={{ color: '#4F728C', fontSize: 13 }}>Change address</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Lake community picker */}
                {addressConfirmed && (
                  <View style={{ marginTop: 12 }}>
                    <Text style={s.settingsRowLabel}>Select Lake Community</Text>

                    {addrLoading && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}>
                        <ActivityIndicator color="#4F728C" />
                        <Text style={{ color: '#666', fontSize: 13 }}>Finding nearby lakes...</Text>
                      </View>
                    )}

                    {!addrLoading && addrSearched && lakeOptions.length === 0 && (
                      <View style={{ padding: 12, backgroundColor: '#fff8e1', borderRadius: 8 }}>
                        <Text style={{ color: '#b8860b', fontWeight: '600' }}>No lakes found near this address</Text>
                        <Text style={{ color: '#b8860b', fontSize: 12, marginTop: 4 }}>
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
                          style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', padding: 12, borderRadius: 8,
                            marginBottom: 6, borderWidth: 1.5,
                            borderColor: selected ? '#4F728C' : '#ddd',
                            backgroundColor: selected ? '#eaf2f8' : '#fafafa',
                          }}
                        >
                          <View>
                            <Text style={{ fontWeight: '600', color: selected ? '#4F728C' : '#333' }}>
                              {lake.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: lake.id ? '#888' : '#e67e22', marginTop: 2 }}>
                              {lake.id ? 'Existing community' : 'New — will be created'}
                            </Text>
                          </View>
                          {selected && <Text style={{ color: '#4F728C', fontWeight: '700' }}>✓</Text>}
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