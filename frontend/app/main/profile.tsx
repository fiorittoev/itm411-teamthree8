/**
 * Profile screen – pulls from backend API.
 * Shows user's marketplace listings in the same grid style as marketplace/home.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, FlatList,
  Image, Modal, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { api, ItemOut } from '../../services/api';
import { mainStyles as s } from '../styles/main/mainStyles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token ?? ''}`,
  };
}

// ─── ListingCard (mirrors home screen ListingCard) ────────────────────────────

function ListingCard({ item, onPress }: { item: ItemOut; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.listingCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.previewImg} />
      <View style={s.previewPrice}>
        <Text style={s.previewPriceText}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading]   = useState(true);
  const [email, setEmail]       = useState('');
  const [profile, setProfile]   = useState<{
    username?: string;
    bio?: string;
    address?: string;
    community?: string;
  } | null>(null);

  const [items, setItems]           = useState<ItemOut[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // Detail modal (same as marketplace)
  const [detailItem, setDetailItem] = useState<ItemOut | null>(null);

  // Delete modal
  const [deleteVisible, setDeleteVisible]   = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting]             = useState(false);

  useEffect(() => { fetchAll(); }, []);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  async function fetchAll() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/options'); return; }
      setEmail(user.email ?? '');

      const headers = await getAuthHeaders();

      // Profile + items in parallel
      const [profileRes] = await Promise.all([
        fetch(`${API_URL}/profile/me`, { headers }),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile({
          username:  data.username,
          bio:       data.bio,
          address:   data.address,
          community: data.community,
        });
      }

      // Fetch only this user's items
      const allItems = await api.get<ItemOut[]>('/items');
      setItems(allItems.filter((i) => i.owner_id === user.id));
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
      setItemsLoading(false);
    }
  }

  // ─── Delete listing ────────────────────────────────────────────────────────

  function promptDelete(id: string) {
    setDeleteTargetId(id);
    setDeleteVisible(true);
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${deleteTargetId}`);
      setItems((prev) => prev.filter((i) => i.id !== deleteTargetId));
      setDetailItem(null);
      setDeleteVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

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
      {/* NAV */}
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

      {/* BODY */}
      <View style={s.profilePanel}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={s.profileHeader}>
            <View style={s.profileAvatar}>
              <Ionicons name="person" size={44} color="white" />
            </View>
            <Text style={s.profileName}>{displayName}</Text>
            {email ? <Text style={s.profileMeta}>{email}</Text> : null}
          </View>

          {/* ── Info rows ── */}
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
          </View>

          {/* ── My Listings section ── */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
            <View style={[s.feedHeader, { marginBottom: 12 }]}>
              <Text style={s.panelTitle}>My Listings</Text>
              <TouchableOpacity
                style={s.addBtn}
                onPress={() => router.push('/main/marketplace')}
              >
                <Text style={s.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {itemsLoading ? (
              <ActivityIndicator color="#4F728C" style={{ marginTop: 16 }} />
            ) : items.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Ionicons name="cart-outline" size={40} color="#ccc" />
                <Text style={[s.emptyText, { marginTop: 8 }]}>No listings yet</Text>
                <TouchableOpacity
                  style={[s.profileAction, { marginTop: 16, alignSelf: 'center', paddingHorizontal: 24 }]}
                  onPress={() => router.push('/main/marketplace')}
                >
                  <Text style={s.profileActionText}>Post a Listing</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.listingGrid}>
                {items.map((item) => (
                  <ListingCard
                    key={item.id}
                    item={item}
                    onPress={() => setDetailItem(item)}
                  />
                ))}
              </View>
            )}
          </View>

        </ScrollView>
      </View>

      {/* ── DETAIL MODAL (mirrors marketplace) ── */}
      <Modal visible={detailItem != null} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.detailBox}>
            {detailItem && (
              <>
                <Image source={{ uri: detailItem.image }} style={s.detailImg} />
                <ScrollView
                  style={s.detailInfo}
                  contentContainerStyle={{ gap: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={s.detailName}>{detailItem.name}</Text>
                  <Text style={s.detailPrice}>${detailItem.price}</Text>
                  <Text style={s.detailSeller}>Posted by: {detailItem.owner_username}</Text>
                  <Text style={s.detailDesc}>{detailItem.description}</Text>

                  {/* Owner actions */}
                  <TouchableOpacity
                    style={[s.btn, s.btnRed]}
                    onPress={() => promptDelete(detailItem.id)}
                  >
                    <Text style={s.btnText}>Delete Listing</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[s.btn, s.btnCancel]}
                    onPress={() => setDetailItem(null)}
                  >
                    <Text style={s.btnCancelText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal visible={deleteVisible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Delete this listing?</Text>
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.btn, s.btnCancel]}
                onPress={() => setDeleteVisible(false)}
              >
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, s.btnRed]}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? <ActivityIndicator color="white" />
                  : <Text style={s.btnText}>Confirm</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}