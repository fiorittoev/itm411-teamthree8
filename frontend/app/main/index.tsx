import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal, TextInput,
  Image, KeyboardAvoidingView, Platform, SafeAreaView,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, PostOut, ItemOut } from '../../services/api';
import { supabase } from '../../services/supabase';
import { mainStyles as s } from '../styles/main/mainStyles';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric',
  });
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post, currentAuthorId, onDelete }: {
  post: PostOut;
  currentAuthorId: string | null;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={s.postBox}>
      <View style={s.postHeader}>
        <Text style={s.postAuthor}>{post.author_username}</Text>
        <Text style={s.postTime}>{formatTime(post.created_at)}</Text>
      </View>
      <Text style={s.postText}>{post.content}</Text>
      {currentAuthorId === post.author_id && (
        <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(post.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={18} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── ListingCard ──────────────────────────────────────────────────────────────
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

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostOut[]>([]);
  const [items, setItems] = useState<ItemOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);

  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Load ─────────────────────────────────────────────────────────────────────
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // ✅ API calls automatically include JWT now
      const [fetchedPosts, fetchedItems] = await Promise.all([
        api.get<PostOut[]>('/posts'),
        api.get<ItemOut[]>('/items'),
      ]);
      setPosts(fetchedPosts);
      setItems(fetchedItems);

      // Determine current user's author_id
      const { data } = await supabase.auth.getUser();
      if (data.user) 
        setCurrentAuthorId(data.user.id);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
  }, []);

  // ── Post CRUD ─────────────────────────────────────────────────────────────────
  const submitPost = async () => {
    const content = postContent.trim();
    if (!content) return;
    setPosting(true);
    try {
      const newPost = await api.post<PostOut>('/posts', {
        title: content.slice(0, 80),
        content,
        post_type: 'general',
      });
      setPosts(prev => [newPost, ...prev]);
      if (!currentAuthorId) setCurrentAuthorId(newPost.author_id);
      setPostContent('');
      setPostModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const promptDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteTargetId}`);
      setPosts(prev => prev.filter(p => p.id !== deleteTargetId));
      setDeleteModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.centered]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  const preview = items.slice(0, 8);

  return (
    <SafeAreaView style={s.safe}>
      {/* NAV */}
      <View style={s.navbar}>
        <Text style={s.logo}>MyMichiganLake</Text>
        <View style={s.navIcons}>
          <TouchableOpacity><Ionicons name="home" size={28} color="white" /></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/main/marketplace')}>
            <Ionicons name="cart-outline" size={28} color="white" />
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
            contentContainerStyle={{ padding: 14 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <PostCard post={item} currentAuthorId={currentAuthorId} onDelete={promptDelete} />
            )}
            ListEmptyComponent={<Text style={s.emptyText}>No posts yet. Be the first!</Text>}
          />
        </View>

        {/* RIGHT */}
        <View style={s.rightPanel}>
          <TouchableOpacity style={s.sideItem}>
            <Ionicons name="people-outline" size={34} color="#333" />
            <Text style={s.sideLabel}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.sideItem}>
            <Ionicons name="mail-outline" size={34} color="#333" />
            <Text style={s.sideLabel}>Mail</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CREATE POST MODAL */}
      <Modal visible={postModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Create Post</Text>
            <TextInput style={s.postInput} placeholder="What's happening at the lake?"
              multiline numberOfLines={4} value={postContent} onChangeText={setPostContent} autoFocus />
            <View style={s.modalActions}>
              <TouchableOpacity style={[s.btn, s.btnCancel]}
                onPress={() => { setPostModalVisible(false); setPostContent(''); }}>
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnBlue]} onPress={submitPost} disabled={posting}>
                {posting ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Post</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* DELETE CONFIRM */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Delete this post?</Text>
            <View style={s.modalActions}>
              <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={() => setDeleteModalVisible(false)}>
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnRed]} onPress={confirmDelete} disabled={deleting}>
                {deleting ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Confirm</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}