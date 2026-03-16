import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  SafeAreaView,
  Alert,RefreshControl,Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, PostOut, ItemOut } from '../../services/api';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';
import { PostCard, ListingCard, Loading, PostModal, DeleteConfirmModal } from '../components/main';
import { ConnectionsPanel } from '../components/ConnectionsPanel';
import { MessagesPanel } from '../components/MessagesPanel';

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostOut[]>([]);
  const [items, setItems] = useState<ItemOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [showConnections, setShowConnections] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [initialDMId, setInitialDMId] = useState<string | null>(null);
  const [initialDMName, setInitialDMName] = useState<string>('');
  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async (isRefresh = false) => {
    if (!isRefresh && !refreshing) setLoading(true);
    try {
      // API calls automatically include JWT now
      const [fetchedPosts, fetchedItems] = await Promise.all([
        api.get<PostOut[]>('/posts'),
        api.get<ItemOut[]>('/items'),
      ]);
      setPosts(fetchedPosts);
      setItems(fetchedItems);

      // Determine current user's author_id
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        try {
          const profile = await api.get<{id: string}>('/profile/me');
          setCurrentAuthorId(profile.id);
        } catch (e) {
          console.warn('Could not fetch profile', e);
        }
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll(true);
  }, []);

  const promptDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalVisible(true);
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Loading/>
    );
  }

  const preview = items.slice(0, 8);
  

  return (
    <SafeAreaView style={s.safe}>
      {/* BODY */}
      <View style={s.body}>
        {/* LEFT */}
        <View style={s.leftPanel}>
          <Text style={s.panelTitle}>Local Listings</Text>
          <View style={s.filterRow}>
            {['All', 'Yours', 'Faves'].map(label => (
              <TouchableOpacity key={label} style={s.filterBtn} onPress={() => router.push('/main/marketplace')}>
                <Text style={s.filterBtnText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.listingGrid}>
            {preview.map(item => (
              <ListingCard key={item.id} item={item}
                onPress={() => router.push({ pathname: '/main/marketplace', params: { openItemId: item.id } })} />
            ))}
            {preview.length === 0 && <Text style={s.emptyText}>No listings yet</Text>}
          </View>
          <TouchableOpacity style={s.shopBtn} onPress={() => router.push('/main/marketplace')}>
            <Text style={s.shopBtnText}>Shop Your Lake</Text>
          </TouchableOpacity>
        </View>

        {/* FEED */}
        <View style={s.feed}>
          <View style={s.feedHeader}>
            <Text style={s.feedTitle}>Posts</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setPostModalVisible(true)}>
              <Text style={s.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={posts}
            keyExtractor={p => p.id}
            contentContainerStyle={s.scrollContentPadding}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <PostCard post={item} currentAuthorId={currentAuthorId} onDelete={promptDelete} />
            )}
            ListEmptyComponent={<Text style={s.emptyText}>No posts yet. Be the first!</Text>}
          />
        </View>

        {/* RIGHT */}
        <View style={s.rightPanel}>
          <TouchableOpacity style={s.sideItem} onPress={() => setShowConnections(true)}>
            <Ionicons name="people-outline" size={34} color="#333" />
            <Text style={s.sideLabel}>Friends</Text>
          </TouchableOpacity>

          <Modal visible={showConnections} animationType="slide" transparent>
            <View style={s.connectionsOverlay}>
              <ConnectionsPanel 
                onClose={() => setShowConnections(false)} 
                onMessage={(userId, username) => {
                  setShowConnections(false);
                  setInitialDMId(userId);
                  setInitialDMName(username);
                  setShowMessages(true);
                }}
              />
            </View>
          </Modal>

          <TouchableOpacity style={s.sideItem} onPress={() => { setInitialDMId(null); setInitialDMName(''); setShowMessages(true); }}>
            <Ionicons name="mail-outline" size={34} color="#333" />
            <Text style={s.sideLabel}>Mail</Text>
          </TouchableOpacity>

          <Modal visible={showMessages} animationType="slide" transparent>
            <View style={s.connectionsOverlay}>
              <MessagesPanel 
                onClose={() => { setShowMessages(false); setInitialDMId(null); setInitialDMName(''); }} 
                currentUserId={currentAuthorId} 
                initialChatId={initialDMId}
                initialChatName={initialDMName}
              />
            </View>
          </Modal>
        </View>
      </View>

      <PostModal
        visible={postModalVisible}
        onClose={() => setPostModalVisible(false)}
        onPosted={fetchAll}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        id={deleteTargetId}
        onClose={() => setDeleteModalVisible(false)}
        onDeleted={fetchAll}
      />
    </SafeAreaView>
  );
}