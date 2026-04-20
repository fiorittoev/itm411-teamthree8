/**
 * Profile screen – works for BOTH:
 * /main/profile (self)
 * /main/profile/[userId] (other user)
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Image, Modal, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../../../services/supabase';
import { api, ItemOut, PostOut } from '../../../services/api';
import { ConnectButton } from '../../components/main';
import { MessagesPanel } from '../../components/MessagesPanel';
import { mainStyles as s } from '../../styles/main/mainStyles';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token ?? ''}`,
  };
}

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

export default function ProfileScreen() {

  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const [email, setEmail] = useState('');

  const [profile, setProfile] = useState<{
    username?: string;
    bio?: string;
    address?: string;
    community?: string;
    profile_image_url?: string;
    is_business?: boolean;
    business_name?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'listings' | 'posts'>('listings');
  const [items, setItems] = useState<ItemOut[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [posts, setPosts] = useState<PostOut[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const [detailItem, setDetailItem] = useState<ItemOut | null>(null);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [profileDbId, setProfileDbId] = useState<string | null>(null);
  const [myProfileIdState, setMyProfileIdState] = useState<string | null>(null);
  const [showDMModal, setShowDMModal] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [userId]);

  async function fetchAll() {

    try {

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/options');
        return;
      }

      const headers = await getAuthHeaders();

      let myProfileId = null;
      try {
          const meRes = await fetch(`${API_URL}/profile/me`, { headers });
          if (meRes.ok) {
              const meData = await meRes.json();
              myProfileId = meData.id;
              setMyProfileIdState(meData.id);
          }
      } catch (e) {
      }

      const isMe = !userId || userId === myProfileId;
      setIsOwnProfile(isMe);
      const targetUserId = isMe ? myProfileId : userId;

      const endpoint = isMe
        ? `${API_URL}/profile/me`
        : `${API_URL}/profile/${targetUserId}`;

      const res = await fetch(endpoint, { headers });

      if (!res.ok) {
        Alert.alert('Error', 'User not found');
        router.back();
        return;
      }

      const data = await res.json();

      setProfile({
        username: data.username,
        bio: data.bio,
        address: data.address,
        community: data.community,
        is_business: data.is_business,
        business_name: data.business_name,
        profile_image_url: data.profile_image_url,
      });

      if (isMe) {
        setEmail(user.email ?? '');
      }
      setProfileDbId(data.id); 

      const allItems = await api.get<ItemOut[]>('/items');
      setItems(allItems.filter(i => i.owner_id === targetUserId));

      const userPosts = await api.get<PostOut[]>(`/posts?user_id=${targetUserId}`);
      setPosts(userPosts);

    }
    catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to load profile');
    }
    finally {
      setLoading(false);
      setItemsLoading(false);
      setPostsLoading(false);
    }
  }

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
    }
    finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[s.safe, s.centered]}>
        <ActivityIndicator size="large" color="#4F728C" />
      </SafeAreaView>
    );
  }

  const displayName = 
    (profile?.is_business && profile?.business_name) 
      ? profile.business_name 
      : profile?.username?.trim() || email?.split('@')[0] || 'User';

  return (

    <SafeAreaView style={s.safe}>

      <View style={s.profilePanel}>

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={s.profileHeader}>

            <View style={[s.profileAvatar, profile?.is_business && { backgroundColor: '#2c3e50' }]}>
              {profile?.profile_image_url ? (
                <Image 
                  source={{ uri: profile.profile_image_url }} 
                  style={{ width: '100%', height: '100%', borderRadius: 44 }} 
                />
              ) : (
                <Ionicons 
                  name={profile?.is_business ? "business" : "person"} 
                  size={profile?.is_business ? 40 : 44} 
                  color="white" 
                />
              )}
            </View>

            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={s.profileName}>{displayName}</Text>
              <View style={[
                s.adCardBadge, 
                { backgroundColor: profile?.is_business ? 'rgba(79, 114, 140, 0.15)' : 'rgba(0,0,0,0.05)' }
              ]}>
                <Text style={[s.adCardSponsored, { fontSize: 9 }]}>
                  {profile?.is_business ? 'Business Account' : 'Personal Account'}
                </Text>
              </View>
            </View>

            {isOwnProfile && email && (
              <Text style={s.profileMeta}>{email}</Text>
            )}

          </View>

          <View style={s.profileBody}>

            {profile?.bio && (
              <View style={s.profileRow}>
                <Ionicons name="document-text-outline" size={20} />
                <Text style={s.profileRowValue}>{profile.bio}</Text>
              </View>
            )}

            {profile?.address && (
              <View style={s.profileRow}>
                <Ionicons name="location-outline" size={20} />
                <Text style={s.profileRowValue}>{profile.address}</Text>
              </View>
            )}

            {profile?.community && (
              <View style={s.profileRow}>
                <Ionicons name="water-outline" size={20} />
                <Text style={s.profileRowValue}>{profile.community}</Text>
              </View>
            )}

            {!isOwnProfile && profileDbId && (
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <ConnectButton userId={profileDbId} />
                <TouchableOpacity 
                  style={[s.btn, { flex: 1, backgroundColor: '#4F728C' }]} 
                  onPress={() => setShowDMModal(true)}
                >
                  <Text style={s.btnText}>Message</Text>
                </TouchableOpacity>
              </View>
            )}

            {isOwnProfile && (
              <TouchableOpacity
                style={s.profileAction}
                onPress={() => router.push('/main/settings')}
              >
                <Text style={s.profileActionText}>
                  Edit Profile & Settings
                </Text>
              </TouchableOpacity>
            )}

          </View>

          <View style={s.profileContentPadding}>
            
            {/* Tab Switcher */}
            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <TouchableOpacity 
                onPress={() => setActiveTab('listings')}
                style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: activeTab === 'listings' ? '#4F728C' : 'transparent' }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: activeTab === 'listings' ? '#4F728C' : '#999' }}>
                  Listings ({items.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setActiveTab('posts')}
                style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: activeTab === 'posts' ? '#4F728C' : 'transparent' }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: activeTab === 'posts' ? '#4F728C' : '#999' }}>
                  Posts ({posts.length})
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'listings' ? (
              <>
                {itemsLoading ? (
                  <ActivityIndicator color="#4F728C" />
                ) : items.length === 0 ? (
                  <Text style={s.emptyText}>No listings</Text>
                ) : (
                  <View style={s.listingGrid}>
                    {items.map(item => (
                      <ListingCard
                        key={item.id}
                        item={item}
                        onPress={() => setDetailItem(item)}
                      />
                    ))}
                  </View>
                )}
              </>
            ) : (
              <>
                {postsLoading ? (
                  <ActivityIndicator color="#4F728C" />
                ) : posts.length === 0 ? (
                  <Text style={s.emptyText}>No posts yet</Text>
                ) : (
                  <View style={{ gap: 12 }}>
                    {posts.map(post => (
                      <View key={post.id} style={{ padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#eee' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 4 }}>{post.title}</Text>
                        <Text style={{ fontSize: 14, color: '#666' }}>{post.content}</Text>
                        <Text style={{ fontSize: 10, color: '#999', marginTop: 8 }}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

          </View>

        </ScrollView>

      </View>

      <Modal visible={detailItem != null} transparent animationType="fade">

        <View style={s.overlay}>
          <View style={s.detailBox}>

            {detailItem && (
              <>
                <Image source={{ uri: detailItem.image }} style={s.detailImg} />

                <ScrollView style={s.detailInfo}>

                  <Text style={s.detailName}>{detailItem.name}</Text>
                  <Text style={s.detailPrice}>${detailItem.price}</Text>
                  <Text style={s.detailDesc}>{detailItem.description}</Text>

                  {isOwnProfile && (
                    <TouchableOpacity
                      style={[s.btn, s.btnRed]}
                      onPress={() => promptDelete(detailItem.id)}
                    >
                      <Text style={s.btnText}>Delete Listing</Text>
                    </TouchableOpacity>
                  )}

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

      <Modal visible={showDMModal} transparent animationType="slide">
        <View style={s.connectionsOverlay}>
          <MessagesPanel 
            onClose={() => setShowDMModal(false)}
            currentUserId={myProfileIdState}
            initialChatId={profileDbId}
            initialChatName={displayName}
          />
        </View>
      </Modal>

    </SafeAreaView>
  );
}