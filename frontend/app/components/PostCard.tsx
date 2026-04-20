import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mainStyles as s } from '../styles/main/mainStyles';
import { PostOut } from '../../services/api';

interface PostCardProps {
  post: PostOut;
  currentAuthorId: string | null;
  onDelete: (id: string) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric',
  });
}

export function PostCard({ post, currentAuthorId, onDelete }: PostCardProps) {
  const router = useRouter();
  return (
    <View style={s.postBox}>
      <View style={s.postHeader}>
        <TouchableOpacity 
          onPress={() => router.push(`/main/profile/${post.author_id}`)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}
        >
          <View style={[s.postAvatar, post.author_is_business && { backgroundColor: '#2c3e50' }]}>
            {post.author_profile_image_url ? (
              <Image 
                source={{ uri: post.author_profile_image_url }} 
                style={{ width: '100%', height: '100%', borderRadius: 18 }} 
              />
            ) : (
              <Ionicons 
                name={post.author_is_business ? "business" : "person"} 
                size={18} 
                color="white" 
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity 
              onPress={() => router.push(`/main/profile/${post.author_id}`)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}
            >
              <Text style={s.postAuthor}>
                { (post.author_is_business && post.author_business_name) ? post.author_business_name : post.author_username }
              </Text>
              {post.author_is_business && (
                <View style={[s.adCardBadge, { paddingHorizontal: 6, paddingVertical: 2 }]}>
                  <Text style={[s.adCardSponsored, { fontSize: 8 }]}>Business</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={s.postTime}>{formatTime(post.created_at)}</Text>
              {post.community_name && (
                <View style={[s.adCardBadge, { paddingHorizontal: 8, paddingVertical: 3 }]}>
                  <Text style={[s.adCardSponsored, { fontSize: 9 }]}>{post.community_name}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        {currentAuthorId === post.author_id && (
          <TouchableOpacity onPress={() => onDelete(post.id)}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.postText}>{post.content}</Text>
    </View>
  );
}
