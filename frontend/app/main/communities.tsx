/**
 * Communities screen - displays a community feed with posts, items and users
 * Similar to search results but focused on a specific community
 */

import {
  View, Text, TouchableOpacity, ScrollView, FlatList,
  Image, Modal, SafeAreaView, ActivityIndicator, Alert, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mainStyles as s } from '../styles/main/mainStyles';
import { Ionicons } from '@expo/vector-icons';
import { api, SearchItemResult, SearchUserResult, ItemOut, PostOut } from '../../services/api';
import { supabase } from '../../services/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityData {
  id: string;
  name: string;
  description: string;
  lake_name: string;
  member_count: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric',
  });
}

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

// ─── Filtering Helpers ────────────────────────────────────────────────────────

function filterPosts(posts: PostOut[], query: string): PostOut[] {
  if (!query.trim()) return posts;
  const q = query.toLowerCase();
  return posts.filter(p => 
    p.content.toLowerCase().includes(q) || 
    p.author_username.toLowerCase().includes(q)
  );
}

function filterItems(items: SearchItemResult[], query: string): SearchItemResult[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.owner_username.toLowerCase().includes(q)
  );
}

function filterUsers(users: SearchUserResult[], query: string): SearchUserResult[] {
  if (!query.trim()) return users;
  const q = query.toLowerCase();
  return users.filter(user =>
    user.username.toLowerCase().includes(q) ||
    user.bio.toLowerCase().includes(q) ||
    user.address.toLowerCase().includes(q)
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CommunitiesScreen() {
  const router = useRouter();
  const { communityId, communityName } = useLocalSearchParams<{
    communityId?: string;
    communityName?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [posts, setPosts] = useState<PostOut[]>([]);
  const [items, setItems] = useState<SearchItemResult[]>([]);
  const [users, setUsers] = useState<SearchUserResult[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'items' | 'users'>('posts');
  const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<SearchItemResult | null>(null);
  const [selectedUser, setSelectedUser] = useState<SearchUserResult | null>(null);
  const [selectedUserItems, setSelectedUserItems] = useState<SearchItemResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  
  // Post modal states
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCommunityFeed();
  }, []);

  // Apply search filter debounced
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Results will be filtered when rendering based on searchQuery
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const loadCommunityFeed = async () => {
    try {
      setLoading(true);

      // Set community info from params
      if (communityName) {
        setCommunity({
          id: communityId || '',
          name: communityName,
          description: '',
          lake_name: '',
          member_count: 0,
        });
      }

      // Get current user
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentAuthorId(data.user.id);
      }

      // Load posts filtered by community (only if communityId exists)
      let allPosts: PostOut[] = [];
      if (communityId) {
        allPosts = await api.get<PostOut[]>(`/posts?community_id=${communityId}`);
      } else {
        allPosts = await api.get<PostOut[]>('/posts');
      }
      setPosts(allPosts);

      // Load items filtered by community
      try {
        const searchItems = await api.search.items('', communityId || '', 100);
        setItems(searchItems);
      } catch {
        setItems([]);
      }

      // Load users filtered by community
      try {
        const searchUsers = await api.search.users('', communityId || '', 50);
        setUsers(searchUsers);
      } catch {
        setUsers([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load community feed');
      console.log('Error loading community:', error);
    } finally {
      setLoading(false);
    }
  };

  const openUserProfile = async (user: SearchUserResult) => {
    try {
      setUserLoading(true);
      setSelectedUser(user);

      const allItems = await api.get<SearchItemResult[]>('/items');
      const userItems = allItems.filter((i) => i.owner_id === user.id);
      setSelectedUserItems(userItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setUserLoading(false);
    }
  };

  const submitPost = async () => {
    const content = postContent.trim();
    if (!content) return;
    setPosting(true);
    try {
      const newPost = await api.post<PostOut>('/posts', {
        title: content.slice(0, 80),
        content,
        post_type: 'general',
        community_id: communityId,
      });
      setPosts((prev) => [newPost, ...prev]);
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
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setDeleteModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.searchPanel}>
        {/* Header with community name and search */}
        <View style={s.searchHeader}>
          {/* Community Title */}
          <View style={{ marginBottom: 12 }}>
            <Text style={s.communityHeaderTitle}>
              {community?.name}
            </Text>
            {community?.lake_name && (
              <Text style={s.communityLakeInfo}>📍 {community.lake_name}</Text>
            )}
          </View>

          {/* Search Input */}
          <View style={s.searchInputContainer}>
            <Ionicons name="search" size={16} color="#999" />
            <TextInput
              style={s.searchInput}
              placeholder="Search in community..."
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

          {/* Tabs */}
          <View style={s.filterOptions}>
            <TouchableOpacity
              style={[s.filterOption, activeTab === 'posts' && s.filterOptionActive]}
              onPress={() => setActiveTab('posts')}
            >
              <Text style={[s.filterOptionText, activeTab === 'posts' && s.filterOptionTextActive]}>
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.filterOption, activeTab === 'items' && s.filterOptionActive]}
              onPress={() => setActiveTab('items')}
            >
              <Text style={[s.filterOptionText, activeTab === 'items' && s.filterOptionTextActive]}>
                Items ({items.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.filterOption, activeTab === 'users' && s.filterOptionActive]}
              onPress={() => setActiveTab('users')}
            >
              <Text style={[s.filterOptionText, activeTab === 'users' && s.filterOptionTextActive]}>
                Users ({users.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={s.searchContent}>
          {/* Posts Tab */}
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
                data={filterPosts(posts, searchQuery)}
                keyExtractor={(p) => p.id}
                contentContainerStyle={s.communityFeedContent}
                renderItem={({ item }) => (
                  <PostCard post={item} currentAuthorId={currentAuthorId} onDelete={promptDelete} />
                )}
                ListEmptyComponent={
                  <View style={s.searchEmpty}>
                    <Ionicons name={searchQuery.trim() ? "sad-outline" : "create-outline"} size={48} color="#ddd" />
                    <Text style={s.searchEmptyText}>{searchQuery.trim() ? 'No posts match your search' : 'No posts yet. Be the first!'}</Text>
                  </View>
                }
              />
            </View>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterItems(items, searchQuery).length === 0 ? (
                <View style={s.searchEmpty}>
                  <Ionicons name={searchQuery.trim() ? "sad-outline" : "cube-outline"} size={48} color="#ddd" />
                  <Text style={s.searchEmptyText}>{searchQuery.trim() ? 'No items match your search' : 'No items in this community'}</Text>
                </View>
              ) : (
                <>
                  {filterItems(items, searchQuery).map((item) => (
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
                </>
              )}
            </ScrollView>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {filterUsers(users, searchQuery).length === 0 ? (
                <View style={s.searchEmpty}>
                  <Ionicons name={searchQuery.trim() ? "sad-outline" : "people-outline"} size={48} color="#ddd" />
                  <Text style={s.searchEmptyText}>{searchQuery.trim() ? 'No users match your search' : 'No users in this community'}</Text>
                </View>
              ) : (
                <>
                  {filterUsers(users, searchQuery).map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      style={s.userResult}
                      onPress={() => openUserProfile(user)}
                      activeOpacity={0.7}
                    >
                      {user.profile_image_url ? (
                        <Image
                          source={{ uri: user.profile_image_url }}
                          style={s.userResultAvatar}
                        />
                      ) : (
                        <View style={s.userResultAvatar}>
                          <Ionicons name="person" size={28} color="white" />
                        </View>
                      )}
                      <View style={s.userResultContent}>
                        <Text style={s.userResultName}>{user.username}</Text>
                        {user.bio && (
                          <Text style={s.userResultBio} numberOfLines={2}>
                            {user.bio}
                          </Text>
                        )}
                        {user.address && (
                          <Text style={s.userResultAddress}>{user.address}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                  <View style={{ height: 20 }} />
                </>
              )}
            </ScrollView>
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
                  <Text style={s.detailDesc}>{selectedItem.description}</Text>
                  <View style={s.contactBox}>
                    <Text style={s.contactTitle}>Item Details</Text>
                    <Text style={s.contactText}>Category: {selectedItem.category}</Text>
                    <Text style={s.contactText}>
                      Posted: {new Date(selectedItem.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[s.btn, s.btnCancel]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={s.btnCancelText}>Close</Text>
                  </TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── USER PROFILE MODAL ── */}
      <Modal visible={selectedUser != null} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            {selectedUser && (
              <ScrollView contentContainerStyle={{ gap: 12 }} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <View style={s.userResultAvatar}>
                    {selectedUser.profile_image_url ? (
                      <Image
                        source={{ uri: selectedUser.profile_image_url }}
                        style={{ width: '100%', height: '100%', borderRadius: 44 }}
                      />
                    ) : (
                      <Ionicons name="person" size={44} color="white" />
                    )}
                  </View>
                  <Text style={s.modalTitle}>{selectedUser.username}</Text>
                </View>

                {/* Bio */}
                {selectedUser.bio && (
                  <View>
                    <Text style={s.userProfileLabel}>
                      Bio
                    </Text>
                    <Text style={s.userProfileText}>{selectedUser.bio}</Text>
                  </View>
                )}

                {/* Address */}
                {selectedUser.address && (
                  <View>
                    <Text style={s.userProfileLabel}>
                      Location
                    </Text>
                    <Text style={s.userProfileText}>{selectedUser.address}</Text>
                  </View>
                )}

                {/* User's Items */}
                <View>
                  <Text style={s.userListingLabel}>
                    Listings ({selectedUserItems.length})
                  </Text>
                  {userLoading ? (
                    <ActivityIndicator color="#4F728C" />
                  ) : selectedUserItems.length === 0 ? (
                    <Text style={s.userListingEmpty}>No listings yet</Text>
                  ) : (
                    selectedUserItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={s.searchItemsRow}
                        onPress={() => {
                          setSelectedItem(item);
                          setSelectedUser(null);
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={s.searchItemImage}
                        />
                        <View style={s.searchItemContainer}>
                          <Text style={s.searchItemName}>
                            {item.name}
                          </Text>
                          <Text style={s.searchItemPrice}>
                            ${item.price}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  style={[s.btn, s.btnCancel]}
                  onPress={() => setSelectedUser(null)}
                >
                  <Text style={s.btnCancelText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Post Creation Modal */}
      <Modal visible={postModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[s.safe, { justifyContent: 'flex-start' }]}>
          <View style={s.searchPanel}>
            <View style={[s.searchHeader, { marginBottom: 16 }]}>
              <View style={s.communityPostModalHeader}>
                <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                  <Text style={s.postModalCloseText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={s.postModalTitle}>New Post</Text>
                <TouchableOpacity
                  onPress={submitPost}
                  disabled={!postContent.trim() || posting}
                >
                  <Text style={[
                    s.postModalSubmitText,
                    postContent.trim() && !posting ? s.postModalSubmitEnabled : s.postModalSubmitDisabled,
                  ]}>
                    {posting ? 'Posting...' : 'Post'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              placeholder="What's on your mind?"
              placeholderTextColor="#999"
              value={postContent}
              onChangeText={setPostContent}
              multiline
              numberOfLines={8}
              style={s.postInput}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Post Deletion Confirmation Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={s.deleteModalOverlay}>
          <View style={s.deleteConfirmBox}>
            <Text style={s.deleteModalTitle}>Delete Post?</Text>
            <Text style={s.deleteModalText}>This action cannot be undone.</Text>
            <View style={s.deleteModalButtonRow}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={[s.deleteConfirmButton, s.deleteConfirmButtonCancel]}
              >
                <Text style={s.deleteModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                disabled={deleting}
                style={[s.deleteConfirmButton, s.deleteConfirmButtonDelete]}
              >
                <Text style={s.deleteModalButtonTextDanger}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
