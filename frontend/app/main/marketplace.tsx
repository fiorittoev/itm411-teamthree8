/**
 * app/(tabs)/explore.tsx
 * Marketplace screen wired to FastAPI /items with Supabase JWT auth.
 * Accepts optional `openItemId` route param to auto-open a detail modal.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal, TextInput,
  Image, Dimensions, KeyboardAvoidingView, Platform,
  SafeAreaView, Alert, ActivityIndicator, RefreshControl, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api, ItemOut } from '../../services/api';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';

const { width } = Dimensions.get('window');

type Filter = 'all' | 'yours' | 'favorites';

// ─── MarketCard ───────────────────────────────────────────────────────────────

function MarketCard({ item, isFav, onPress, onToggleFav }: {
  item: ItemOut; isFav: boolean;
  onPress: () => void; onToggleFav: () => void;
}) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.cardImg} />
      <View style={s.cardInfo}>
        <View style={s.cardText}>
          <Text style={s.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={s.cardPrice}>${item.price}</Text>
        </View>
        <TouchableOpacity
          onPress={e => { e.stopPropagation?.(); onToggleFav(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.cardFav}>{isFav ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function MarketplaceScreen() {
  const router = useRouter();
  const { openItemId } = useLocalSearchParams<{ openItemId?: string }>();

  const [items, setItems]         = useState<ItemOut[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter]       = useState<Filter>('all');

  // Add modal
  const [addVisible, setAddVisible]   = useState(false);
  const [itemName, setItemName]       = useState('');
  const [itemPrice, setItemPrice]     = useState('');
  const [itemDesc, setItemDesc]       = useState('');
  const [itemImage, setItemImage]     = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);

  // Field-level validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    desc?: string;
    image?: string;
  }>({});

  // Detail modal
  const [detailItem, setDetailItem] = useState<ItemOut | null>(null);

  // Delete modal
  const [deleteVisible, setDeleteVisible]     = useState(false);
  const [deleteTargetId, setDeleteTargetId]   = useState<string | null>(null);
  const [deleting, setDeleting]               = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    if (openItemId && items.length > 0) {
      const found = items.find(i => i.id === openItemId);
      if (found) setDetailItem(found);
    }
  }, [openItemId, items]);

  async function fetchItems() {
    try {
      const fetched = await api.get<ItemOut[]>('/items');
      setItems(fetched);
      const { data } = await supabase.auth.getUser();
      if (data.user) setCurrentAuthorId(data.user.id);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => { setRefreshing(true); fetchItems(); }, []);

  // ── Image picker ──────────────────────────────────────────────────────────

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setItemImage(asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri);
      // clear image error once picked
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!itemName.trim())  newErrors.name  = 'Item name is required';
    if (!itemPrice.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(itemPrice))) newErrors.price = 'Price must be a number';
    if (!itemDesc.trim())  newErrors.desc  = 'Description is required';
    if (!itemImage)        newErrors.image = 'Please select a photo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Submit listing ────────────────────────────────────────────────────────

  async function submitItem() {
    if (!validate()) return;   // inline errors shown, no Alert needed

    setSubmitting(true);
    try {
      const newItem = await api.post<ItemOut>('/items', {
        name:        itemName.trim(),
        price:       itemPrice.trim(),
        description: itemDesc.trim(),
        category:    'other',
        image:       itemImage,
      });
      setItems(prev => [newItem, ...prev]);
      if (!currentAuthorId) setCurrentAuthorId(newItem.owner_id);
      resetForm();
      setAddVisible(false);
    } catch (e: any) {
      // Surface the actual server error so it's visible
      const msg = e.message ?? 'Failed to post listing';
      Alert.alert('Error posting listing', msg);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setItemName('');
    setItemPrice('');
    setItemDesc('');
    setItemImage(null);
    setErrors({});
  }

  // ── Favorites ─────────────────────────────────────────────────────────────

  function toggleFav(id: string) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function promptDelete(id: string) {
    setDeleteTargetId(id);
    setDeleteVisible(true);
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${deleteTargetId}`);
      setItems(prev => prev.filter(i => i.id !== deleteTargetId));
      setDetailItem(null);
      setDeleteVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  }

  // ── Filtered list ─────────────────────────────────────────────────────────

  const displayed = items.filter(item => {
    if (filter === 'favorites') return favorites.includes(item.id);
    if (filter === 'yours')     return item.owner_id === currentAuthorId;
    return true;
  });

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>

      {/* NAV */}
      <View style={s.navbar}>
        <Text style={s.logo}>MyMichiganLake</Text>
        <View style={s.navIcons}>
          <TouchableOpacity onPress={() => router.push('/main')}>
            <Ionicons name="home-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="cart" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/settings')}>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/main/profile')}>
          <View style={s.profileCircle}>
            <Ionicons name="person-outline" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* MARKETPLACE */}
      <View style={s.marketplace}>
        <View style={s.marketHeader}>
          <View style={s.headerLeft}>
            <Text style={s.marketTitle}>Marketplace</Text>
            <View style={s.filterRow}>
              {(['all', 'yours', 'favorites'] as Filter[]).map(f => (
                <TouchableOpacity key={f} onPress={() => setFilter(f)}
                  style={[s.filterBtn, filter === f && s.filterBtnActive]}>
                  <Text style={s.filterBtnText}>
                    {f === 'all' ? 'All Listings' : f === 'yours' ? 'Your Listings' : 'Favorites'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={s.addBtn} onPress={() => setAddVisible(true)}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayed}
          keyExtractor={i => i.id}
          numColumns={4}
          contentContainerStyle={s.gridContent}
          columnWrapperStyle={s.gridRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <MarketCard
              item={item}
              isFav={favorites.includes(item.id)}
              onPress={() => setDetailItem(item)}
              onToggleFav={() => toggleFav(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={s.emptyText}>No listings yet. Tap + to add one!</Text>}
        />
      </View>

      {/* ── ADD MODAL ── */}
      <Modal visible={addVisible} transparent animationType="fade">
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={s.overlayScroll}>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>Add New Listing</Text>

              {/* Name */}
              <TextInput
                style={[s.input, errors.name ? { borderColor: '#e74c3c', borderWidth: 1 } : null]}
                placeholder="Item Name"
                value={itemName}
                onChangeText={v => { setItemName(v); setErrors(prev => ({ ...prev, name: undefined })); }}
              />
              {errors.name ? <Text style={errStyle}>{errors.name}</Text> : null}

              {/* Price */}
              <TextInput
                style={[s.input, errors.price ? { borderColor: '#e74c3c', borderWidth: 1 } : null]}
                placeholder="Price"
                value={itemPrice}
                onChangeText={v => { setItemPrice(v); setErrors(prev => ({ ...prev, price: undefined })); }}
                keyboardType="decimal-pad"
              />
              {errors.price ? <Text style={errStyle}>{errors.price}</Text> : null}

              {/* Description */}
              <TextInput
                style={[s.input, s.textarea, errors.desc ? { borderColor: '#e74c3c', borderWidth: 1 } : null]}
                placeholder="Description"
                value={itemDesc}
                onChangeText={v => { setItemDesc(v); setErrors(prev => ({ ...prev, desc: undefined })); }}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.desc ? <Text style={errStyle}>{errors.desc}</Text> : null}

              {/* Image */}
              <TouchableOpacity
                style={[s.imagePicker, errors.image ? { borderColor: '#e74c3c', borderWidth: 1 } : null]}
                onPress={pickImage}
              >
                {itemImage
                  ? <Image source={{ uri: itemImage }} style={s.imagePreview} />
                  : <View style={s.imagePlaceholder}>
                      <Ionicons name="image-outline" size={32} color={errors.image ? '#e74c3c' : '#888'} />
                      <Text style={[s.imagePlaceholderText, errors.image ? { color: '#e74c3c' } : null]}>
                        Tap to select photo
                      </Text>
                    </View>
                }
              </TouchableOpacity>
              {errors.image ? <Text style={errStyle}>{errors.image}</Text> : null}

              <View style={s.modalActions}>
                <TouchableOpacity
                  style={[s.btn, s.btnCancel]}
                  onPress={() => { resetForm(); setAddVisible(false); }}
                >
                  <Text style={s.btnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btn, s.btnBlue]}
                  onPress={submitItem}
                  disabled={submitting}
                >
                  {submitting
                    ? <ActivityIndicator color="white" />
                    : <Text style={s.btnText}>Post</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── DETAIL MODAL ── */}
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
                  <TouchableOpacity style={s.favBtn} onPress={() => toggleFav(detailItem.id)}>
                    <Text style={s.favBtnText}>
                      {favorites.includes(detailItem.id) ? '♥ Favorited' : '♡ Favorite'}
                    </Text>
                  </TouchableOpacity>
                  {detailItem.owner_id === currentAuthorId && (
                    <TouchableOpacity
                      style={[s.btn, s.btnRed]}
                      onPress={() => promptDelete(detailItem.id)}
                    >
                      <Text style={s.btnText}>Delete Listing</Text>
                    </TouchableOpacity>
                  )}
                  <View style={s.contactBox}>
                    <Text style={s.contactTitle}>Contact Info</Text>
                    <Text style={s.contactText}>Email: Coming soon</Text>
                    <Text style={s.contactText}>Phone: Coming soon</Text>
                  </View>
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

// ─── Shared inline error style ────────────────────────────────────────────────
const errStyle = {
  color: '#e74c3c',
  fontSize: 12,
  marginTop: -6,
  marginBottom: 6,
  marginLeft: 2,
};