import {
  View, Text, TouchableOpacity, ScrollView, FlatList,
  Image, Modal, SafeAreaView, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { mainStyles as s } from '../styles/main/mainStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, SearchItemResult, SearchUserResult, SearchCommunityResult } from '../../services/api';
import { ProfileModal } from 'app/components/main';

// ─── Types ────────────────────────────────────────────────────────────────────

type SearchCategory = 'items' | 'users' | 'communities';
type CommunityFilter = 'all' | 'my-community';

interface SearchResults {
  items: SearchItemResult[];
  users: SearchUserResult[];
  communities: SearchCommunityResult[];
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ items: [], users: [], communities: [] });
  const [selectedCategories, setSelectedCategories] = useState<SearchCategory[]>(['items', 'users', 'communities']);
  const [communityFilter, setCommunityFilter] = useState<CommunityFilter>('all');
  const [userCommunityId, setUserCommunityId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<SearchItemResult | null>(null);
  const [selectedUser, setSelectedUser] = useState<SearchUserResult | null>(null);
  const [selectedUserItems, setSelectedUserItems] = useState<SearchItemResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // Get user's community on mount
  useEffect(() => {
    const getUserCommunity = async () => {
      try {
        const profile = await api.get<{id: string, community_id: string}>('/profile/me');
        if (profile?.community_id) {
          setUserCommunityId(profile.community_id);
        }
        if (profile?.id) {
          setCurrentUserId(profile.id);
        }
      } catch (error) {
        console.log('Could not fetch user profile');
      }
    };
    getUserCommunity();
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setResults({ items: [], users: [], communities: [] });
      return;
    }

    setLoading(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedCategories, communityFilter]);

  const performSearch = async () => {
    try {
      const newResults: SearchResults = { items: [], users: [], communities: [] };
      const communityId = (communityFilter === 'my-community' && userCommunityId) ? userCommunityId : undefined;

      // Search items
      if (selectedCategories.includes('items')) {
        try {
          const itemResults = await api.search.items(searchQuery, communityId, 50);
          newResults.items = itemResults || [];
        } catch (error) {
          console.log('Items search failed');
        }
      }

      // Search users
      if (selectedCategories.includes('users')) {
        try {
          const userResults = await api.search.users(searchQuery, communityId, 50);
          newResults.users = userResults || [];
        } catch (error) {
          console.log('Users search failed');
        }
      }

      // Search communities
      if (selectedCategories.includes('communities')) {
        try {
          const communityResults = await api.search.communities(searchQuery, 50);
          newResults.communities = communityResults || [];
        } catch (error) {
          console.log('Communities search failed');
        }
      }

      setResults(newResults);
    } catch (error) {
      console.log('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: SearchCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const hasAnyResults = results.items.length > 0 || results.users.length > 0 || results.communities.length > 0;

  // Open and load user profile with items
  const openUserProfile = async (user: SearchUserResult) => {
    try {
      setUserLoading(true);
      setSelectedUser(user);
      
      // Fetch all items and filter by this user
      const allItems = await api.get<SearchItemResult[]>('/items');
      const userItems = allItems.filter((i) => i.owner_id === user.id);
      setSelectedUserItems(userItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.searchPanel}>
        {/* Header with search input and filters */}
        <View style={s.searchHeader}>
          {/* Search Input */}
          <View style={s.searchInputContainer}>
            <Ionicons name="search" size={16} color="#999" />
            <TextInput
              style={s.searchInput}
              placeholder="Search items, users, communities..."
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

          {/* Community Filter */}
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Search Scope</Text>
            <View style={s.filterOptions}>
              <TouchableOpacity
                style={[s.filterOption, communityFilter === 'all' && s.filterOptionActive]}
                onPress={() => setCommunityFilter('all')}
              >
                <Text style={[s.filterOptionText, communityFilter === 'all' && s.filterOptionTextActive]}>
                  All Communities
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.filterOption, communityFilter === 'my-community' && s.filterOptionActive]}
                onPress={() => setCommunityFilter('my-community')}
              >
                <Text style={[s.filterOptionText, communityFilter === 'my-community' && s.filterOptionTextActive]}>
                  My Community
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filter */}
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Result Types</Text>
            <View style={s.filterOptions}>
              <TouchableOpacity
                style={[s.filterOption, selectedCategories.includes('items') && s.filterOptionActive]}
                onPress={() => toggleCategory('items')}
              >
                <Text style={[s.filterOptionText, selectedCategories.includes('items') && s.filterOptionTextActive]}>
                  Items
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.filterOption, selectedCategories.includes('users') && s.filterOptionActive]}
                onPress={() => toggleCategory('users')}
              >
                <Text style={[s.filterOptionText, selectedCategories.includes('users') && s.filterOptionTextActive]}>
                  Users
                </Text>
              </TouchableOpacity>
              
              {communityFilter === 'all' && (
                <TouchableOpacity
                  style={[s.filterOption, selectedCategories.includes('communities') && s.filterOptionActive]}
                  onPress={() => toggleCategory('communities')}
                >
                  <Text style={[s.filterOptionText, selectedCategories.includes('communities') && s.filterOptionTextActive]}>
                    Communities
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Results Content */}
        <View style={s.searchContent}>
          {loading && (
            <View style={s.searchEmpty}>
              <ActivityIndicator size="large" color="#4F728C" />
            </View>
          )}

          {!loading && !searchQuery.trim() && (
            <View style={s.searchEmpty}>
              <Ionicons name="search" size={48} color="#ddd" />
              <Text style={s.searchEmptyText}>Start typing to search...</Text>
            </View>
          )}

          {!loading && searchQuery.trim() && !hasAnyResults && (
            <View style={s.searchEmpty}>
              <Ionicons name="sad-outline" size={48} color="#ddd" />
              <Text style={s.searchEmptyText}>No results found</Text>
            </View>
          )}

          {!loading && hasAnyResults && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Items Section */}
              {selectedCategories.includes('items') && results.items.length > 0 && (
                <View style={s.categorySection}>
                  <Text style={s.categoryTitle}>Items ({results.items.length})</Text>
                  {results.items.map((item) => (
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
                          <Text
                            style={s.itemResultDesc}
                            numberOfLines={2}
                          >
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
                </View>
              )}

              {/* Users Section */}
              {selectedCategories.includes('users') && results.users.length > 0 && (
                <View style={s.categorySection}>
                  <Text style={s.categoryTitle}>Users ({results.users.length})</Text>
                  {results.users.map((user) => (
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
                          <Text
                            style={s.userResultBio}
                            numberOfLines={2}
                          >
                            {user.bio}
                          </Text>
                        )}
                        {user.address && (
                          <Text style={s.userResultAddress}>{user.address}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Communities Section */}
              {selectedCategories.includes('communities') && results.communities.length > 0 && (
                <View style={s.categorySection}>
                  <Text style={s.categoryTitle}>Communities ({results.communities.length})</Text>
                  {results.communities.map((community) => (
                    <TouchableOpacity
                      key={community.id}
                      style={s.communityResult}
                      onPress={() =>
                        router.push({
                          pathname: '/main/communities',
                          params: {
                            communityId: community.id,
                            communityName: community.name,
                          },
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text style={s.communityResultName}>{community.name}</Text>
                      {community.description && (
                        <Text style={s.communityResultDesc} numberOfLines={2}>
                          {community.description}
                        </Text>
                      )}
                      <View style={s.communityResultFooter}>
                        {community.lake_name && (
                          <Text style={s.communityResultLake}>📍 {community.lake_name}</Text>
                        )}
                        <Text style={s.communityResultMembers}>{community.member_count} members</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={s.spacerSmall} />
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
                  contentContainerStyle={s.detailScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={s.detailName}>{selectedItem.name}</Text>
                  <Text style={s.detailPrice}>${selectedItem.price}</Text>
                  <Text style={s.detailSeller}>Posted by: {selectedItem.owner_username}</Text>
                  
                  {selectedItem.owner_id !== currentUserId && (
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
                    <Text style={s.contactText}>Posted: {new Date(selectedItem.created_at).toLocaleDateString()}</Text>
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

      <ProfileModal
        visible={selectedUser != null}
        user={selectedUser}
        items={selectedUserItems}
        loading={userLoading}
        currentUserId={currentUserId}
        onClose={() => setSelectedUser(null)}
        onSelectItem={(item) => {
          setSelectedItem(item)
          setSelectedUser(null)
        }}
        onViewProfile={(id) => {
          setSelectedUser(null)
          router.push(`/main/profile/${id}`)
        }}
      />
    </SafeAreaView>
  );
}
