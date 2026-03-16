/**
 * Communities screen - community-scoped feed + search
 * Posts tab mirrors HomeScreen's feed. Items/Users tabs use the same
 * search pattern as SearchScreen but auto-filtered to this community.
 */

import {
  View, Text, TouchableOpacity, ScrollView, FlatList,
  Image, Modal, SafeAreaView, ActivityIndicator, Alert, TextInput, RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mainStyles as s } from '../styles/main/mainStyles';
import { Ionicons } from '@expo/vector-icons';
import { api, SearchItemResult, SearchUserResult, PostOut } from '../../services/api';
import { supabase } from '../../services/supabase';
import { PostCard, PostModal, DeleteConfirmModal, ProfileModal } from '../components/main';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityData {
  id: string;
  name: string;
  description: string;
  lake_name: string;
  member_count: number;
}

type ActiveTab = 'posts' | 'items' | 'users';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommunitiesScreen() {
  const router = useRouter();
  const { communityId, communityName } = useLocalSearchParams<{
    communityId?: string;
    communityName?: string;
  }>();

  // ── Core state ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [activeCommunityId, setActiveCommunityId] = useState<string | undefined>(communityId);

  // ── Feed (posts tab) ────────────────────────────────────────────────────────
  const [posts, setPosts] = useState<PostOut[]>([]);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');

  // ── Search (items + users tabs) ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [items, setItems] = useState<SearchItemResult[]>([]);
  const [users, setUsers] = useState<SearchUserResult[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [selectedItem, setSelectedItem] = useState<SearchItemResult | null>(null);
  const [selectedUser, setSelectedUser] = useState<SearchUserResult | null>(null);
  const [selectedUserItems, setSelectedUserItems] = useState<SearchItemResult[]>([]);

  // ── Initial load ─────────────────────────────────────────────────────────────

  useEffect(() => {
    initialLoad();
  }, []);

  // Re-run search when query or tab changes
  useEffect(() => {
    if (activeTab === 'posts') return; // posts don't use search endpoint
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 400);

    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery, activeTab]);

  const initialLoad = async () => {
    try {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      // Fetch user profile to get community_id and username
      const userProfile = await api.get<{ id: string, username: string, community_id?: string }>('/profile/me');
      setCurrentUser({ id: userProfile.id, username: userProfile.username });
      setCurrentAuthorId(userProfile.id);

      let targetCommunityId = communityId;
      let targetCommunityName = communityName;

      // If no community provided, use user's own community
      if (!targetCommunityId && userProfile.community_id) {
        targetCommunityId = userProfile.community_id;
        setActiveCommunityId(targetCommunityId);
      }

      // Show name immediately from params while API call is in flight
      if (targetCommunityId && targetCommunityName) {
        setCommunity({
          id: targetCommunityId,
          name: decodeURIComponent(targetCommunityName),
          description: '',
          lake_name: '',
          member_count: 0,
        });
      }

      if (targetCommunityId) {
        // Fetch real community details + posts in parallel
        await Promise.all([
          fetchCommunityDetails(targetCommunityId),
          fetchPosts(targetCommunityId),
          // Pre-load items and users with empty query
          performSearch('', targetCommunityId)
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load community');
      console.error('initialLoad:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityDetails = async (id?: string) => {
    const cid = id || activeCommunityId;
    if (!cid) return;
    try {
      const data = await api.get<CommunityData>(`/communities/${cid}`);
      setCommunity(data);
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status;
      if (status === 403) {
        Alert.alert('Access denied', 'You are not a member of this community.');
        router.back();
      }
      // Non-403: keep the param-based fallback already set
    }
  };

  const fetchPosts = async (id?: string) => {
    const cid = id || activeCommunityId;
    try {
      const data = await api.get<PostOut[]>(
        cid ? `/posts?community_id=${cid}` : '/posts'
      );
      setPosts(data);
    } catch {
      setPosts([]);
    }
  };

  // Mirrors SearchScreen.performSearch but communityId is always injected
  const performSearch = async (query: string, id?: string) => {
    const cid = id || activeCommunityId;
    try {
      setSearchLoading(true);
      const [itemResults, userResults] = await Promise.all([
        api.search.items(query, cid, 50).catch(() => []),
        api.search.users(query, cid, 50).catch(() => []),
      ]);
      setItems(itemResults);
      setUsers(userResults);
    } finally {
      setSearchLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPosts(), performSearch(searchQuery)]);
    setRefreshing(false);
  }, [searchQuery]);

  const openUserProfile = (user: SearchUserResult) => {
    setSelectedUser(user);
    // Derive from already-fetched community items — no unscoped API call
    setSelectedUserItems(items.filter((i) => i.owner_id === user.id));
  };

  // ── Loading screen ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const showSearchEmpty = !searchLoading && searchQuery.trim() && items.length === 0 && users.length === 0;
  const showSearchPrompt = !searchLoading && !searchQuery.trim() && items.length === 0 && users.length === 0;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.searchPanel}>

        {/* ── Header ── */}
        <View style={s.searchHeader}>

          {/* Community info */}
          <View style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={s.communityHeaderTitle}>
                {community?.name ?? (communityName ? decodeURIComponent(communityName) : 'Loading...')}
              </Text>
              {community?.lake_name ? (
                <Text style={s.communityLakeInfo}> {community.lake_name}</Text>
              ) : null}
              {community?.description ? (
                <Text style={s.communityDescription}>{community.description}</Text>
              ) : null}
              {(community?.member_count ?? 0) > 0 ? (
                <Text style={s.communityMemberCount}> {community!.member_count} members</Text>
              ) : null}
            </View>
          </View>

          {/* Search bar — hidden on posts tab, same UI as SearchScreen */}
          {activeTab !== 'posts' && (
            <View style={s.searchInputContainer}>
              <Ionicons name="search" size={16} color="#999" />
              <TextInput
                style={s.searchInput}
                placeholder={`Search ${activeTab} in community...`}
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={s.searchClearBtn} onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Tabs */}
          <View style={s.filterOptions}>
            {(['posts', 'items', 'users'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[s.filterOption, activeTab === tab && s.filterOptionActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[s.filterOptionText, activeTab === tab && s.filterOptionTextActive]}>
                  {tab === 'posts'
                    ? `Posts (${posts.length})`
                    : tab === 'items'
                      ? `Items (${items.length})`
                      : `Users (${users.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Content ── */}
        <View style={s.searchContent}>

          {/* ── POSTS TAB — mirrors HomeScreen feed ── */}
          {activeTab === 'posts' && (
            <View style={{ flex: 1 }}>
              <View style={s.communityFeedHeader}>
                <Text style={s.communityFeedLabel}>Community Feed</Text>
                <TouchableOpacity
                  style={[s.filterOption, s.communityFilterOption]}
                  onPress={() => setPostModalVisible(true)}
                >
                  <Ionicons name="add" size={16} color="#4F728C" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={posts}
                keyExtractor={(p) => p.id}
                contentContainerStyle={s.communityFeedContent}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => (
                  <PostCard
                    post={item}
                    currentAuthorId={currentAuthorId}
                    onDelete={(id) => { setDeleteTargetId(id); setDeleteModalVisible(true); }}
                  />
                )}
                ListEmptyComponent={
                  <View style={s.searchEmpty}>
                    <Ionicons name="create-outline" size={48} color="#ddd" />
                    <Text style={s.searchEmptyText}>No posts yet. Be the first!</Text>
                  </View>
                }
              />
            </View>
          )}

          {/* ── ITEMS TAB — same pattern as SearchScreen ── */}
          {activeTab === 'items' && (
            <>
              {searchLoading && (
                <View style={s.searchEmpty}>
                  <ActivityIndicator size="large" color="#4F728C" />
                </View>
              )}
              {!searchLoading && items.length === 0 && (
                <View style={s.searchEmpty}>
                  <Ionicons
                    name={searchQuery.trim() ? 'sad-outline' : 'cube-outline'}
                    size={48} color="#ddd"
                  />
                  <Text style={s.searchEmptyText}>
                    {searchQuery.trim() ? 'No items match your search' : 'No items in this community'}
                  </Text>
                </View>
              )}
              {!searchLoading && items.length > 0 && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={s.categorySection}>
                    <Text style={s.categoryTitle}>Items ({items.length})</Text>
                    {items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={s.itemResult}
                        onPress={() => setSelectedItem(item)}
                        activeOpacity={0.7}
                      >
                        {item.image ? (
                          <Image source={{ uri: item.image }} style={s.itemResultImage} />
                        ) : (
                          <View style={[s.itemResultImage, s.centered]}>
                            <Ionicons name="cube-outline" size={32} color="#bbb" />
                          </View>
                        )}
                        <View style={s.itemResultContent}>
                          <View style={s.itemResultTop}>
                            <Text style={s.itemResultName}>{item.name}</Text>
                            <Text style={s.itemResultDesc} numberOfLines={2}>
                              {item.description || 'No description'}
                            </Text>
                          </View>
                          <View style={s.itemResultFooter}>
                            <Text style={s.itemResultPrice}>${item.price}</Text>
                            <Text style={s.itemResultSeller}>{item.owner_username}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <View style={s.spacerSmall} />
                  </View>
                </ScrollView>
              )}
            </>
          )}

          {/* ── USERS TAB — same pattern as SearchScreen ── */}
          {activeTab === 'users' && (
            <>
              {searchLoading && (
                <View style={s.searchEmpty}>
                  <ActivityIndicator size="large" color="#4F728C" />
                </View>
              )}
              {!searchLoading && users.length === 0 && (
                <View style={s.searchEmpty}>
                  <Ionicons
                    name={searchQuery.trim() ? 'sad-outline' : 'people-outline'}
                    size={48} color="#ddd"
                  />
                  <Text style={s.searchEmptyText}>
                    {searchQuery.trim() ? 'No users match your search' : 'No users in this community'}
                  </Text>
                </View>
              )}
              {!searchLoading && users.length > 0 && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={s.categorySection}>
                    <Text style={s.categoryTitle}>Members ({users.length})</Text>
                    {users.map((user) => (
                      <TouchableOpacity
                        key={user.id}
                        style={s.userResult}
                        onPress={() => openUserProfile(user)}
                        activeOpacity={0.7}
                      >
                        {user.profile_image_url ? (
                          <Image source={{ uri: user.profile_image_url }} style={s.userResultAvatar} />
                        ) : (
                          <View style={s.userResultAvatar}>
                            <Ionicons name="person" size={28} color="white" />
                          </View>
                        )}
                        <View style={s.userResultContent}>
                          <Text style={s.userResultName}>{user.username}</Text>
                          {user.bio && (
                            <Text style={s.userResultBio} numberOfLines={2}>{user.bio}</Text>
                          )}
                          {user.address && (
                            <Text style={s.userResultAddress}>{user.address}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                    <View style={{ height: 20 }} />
                  </View>
                </ScrollView>
              )}
            </>
          )}
        </View>
      </View>

      {/* ── ITEM DETAIL MODAL ── */}
      <Modal visible={selectedItem != null} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.detailBox}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.image }} style={s.detailImg} />
                <ScrollView
                  style={s.detailInfo}
                  contentContainerStyle={{ gap: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={s.detailName}>{selectedItem.name}</Text>
                  <Text style={s.detailPrice}>${selectedItem.price}</Text>
                  <Text style={s.detailSeller}>Posted by: {selectedItem.owner_username}</Text>

                  {selectedItem.owner_id !== currentAuthorId && (
                    <TouchableOpacity
                      style={[s.btn, s.btnBlue]}
                      onPress={() => {
                        setSelectedItem(null);
                        router.push(`/main/profile/${selectedItem.owner_id}`);
                      }}
                    >
                      <Text style={s.btnText}>View Seller Profile</Text>
                    </TouchableOpacity>
                  )}

                  <Text style={s.detailDesc}>{selectedItem.description}</Text>
                  <View style={s.contactBox}>
                    <Text style={s.contactTitle}>Item Details</Text>
                    <Text style={s.contactText}>Category: {selectedItem.category}</Text>
                    <Text style={s.contactText}>
                      Posted: {new Date(selectedItem.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={() => setSelectedItem(null)}>
                    <Text style={s.btnCancelText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── USER PROFILE MODAL — reuses shared ProfileModal ── */}
      <ProfileModal
        visible={selectedUser != null}
        user={selectedUser}
        items={selectedUserItems}
        loading={false}
        currentUserId={currentAuthorId}
        onClose={() => setSelectedUser(null)}
        onSelectItem={(item) => { setSelectedItem(item); setSelectedUser(null); }}
        onViewProfile={(id) => { setSelectedUser(null); router.push(`/main/profile/${id}`); }}
      />

      {/* ── POST MODALS — reuse shared components like HomeScreen ── */}
      <PostModal
        visible={postModalVisible}
        onClose={() => setPostModalVisible(false)}
        onPosted={() => fetchPosts(activeCommunityId)}
        communityId={activeCommunityId}  // pass this down so posts are scoped
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        id={deleteTargetId}
        onClose={() => setDeleteModalVisible(false)}
        onDeleted={() => fetchPosts(activeCommunityId)}
      />
    </SafeAreaView>
  );
}