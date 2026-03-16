import {
    View, 
    Text, 
    TouchableOpacity, 
    Image,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api, PostOut, ItemOut, ConnectionStatus } from '../../services/api';
import React, { useState,useEffect} from 'react';
// ConnectButton.tsx — reusable button for profile screen + modal
// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric',
  });
}

export function Loading(){
    return(
        <SafeAreaView style={[s.safe, s.centered]}>
            <ActivityIndicator size="large" color="#4F728C" />
        </SafeAreaView>   
    )
}

export function Navbar({id}: {id: string|null}) {
  const router = useRouter();
  return(
    <View style={s.navbar}>
      <Text style={s.logo}>MyMichiganLake</Text>
      <View style={s.navIcons}>
        <TouchableOpacity onPress={() => router.push('/main')}>
          <Ionicons name="home-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/communities')}>
          <Ionicons name="water-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/marketplace')}>
          <Ionicons name="cart-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/main/search')}>
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => {
          if (id) router.push(`/main/profile/${id}`);
        }}>
        <View style={s.profileCircle}>
          <Ionicons name="person-outline" size={20} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export function PostCard({ post, currentAuthorId, onDelete }: {
  post: PostOut;
  currentAuthorId: string | null;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  return (
    <View style={s.postBox}>
      <View style={s.postHeader}>
        <TouchableOpacity onPress={() => router.push(`/main/profile/${post.author_id}`)}>
          <Text style={s.postAuthor}>{post.author_username}</Text>
        </TouchableOpacity>
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
export function ListingCard({ item, onPress }: { item: ItemOut; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.listingCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.previewImg} />
      <View style={s.previewPrice}>
        <Text style={s.previewPriceText}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── MarketCard ───────────────────────────────────────────────────────────────

export function MarketCard({ item, isFav, onPress, onToggleFav }: {
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

export function PostModal({visible, onClose, onPosted, communityId}:{
        visible: boolean
        onClose: () => void
        onPosted: () => void
        communityId?: string
      }){
        const [postContent, setContent] = useState('');
        const [posting, setPosting] = useState(false);
        const [currentAuthorId, setCurrentAuthorId] = useState<string | null>(null);
  
        const submitPost = async () => {
            const content = postContent.trim();
            if (!content) {
                return;
            }
            setPosting(true);
            try {
                const newPost = await api.post<PostOut>('/posts', {
                        title: content.slice(0, 80),
                        content,
                        post_type: 'general',
                        community_id: communityId,
                    }
                );
                if (!currentAuthorId) {
                    setCurrentAuthorId(newPost.author_id);
                }
                    setContent('');
                    onPosted();
                    onClose();
            } 
            catch (e: any) {
                Alert.alert('Error', e.message ?? 'Failed to post');
            } 
            finally {
                setPosting(false);
            }
      };
    
    return (
        <Modal visible={visible} transparent animationType="fade">
            <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={s.modalBox}>
                <Text style={s.modalTitle}>Create Post</Text>
                <TextInput style={s.postInput} placeholder="What's happening at the lake?"
                    multiline numberOfLines={4} value={postContent} onChangeText={setContent} autoFocus />
                <View style={s.modalActions}>
                    <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={()=>{setContent(''); onClose();}}>
                    <Text style={s.btnCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, s.btnBlue]} onPress={submitPost} disabled={posting}>
                        {posting ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Post</Text>}
                    </TouchableOpacity>
                </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
        );
    }

export function DeleteConfirmModal({visible,id,onClose,onDeleted}:{
    visible: boolean
    id: string
    onClose: () => void
    onDeleted: () => void
  }){
    const confirmDelete = async () => {
        if (!id) {
                return;
        }
        setDeleting(true);
        try {
            await api.delete(`/posts/${id}`);
        } 
        catch (e: any) {
            Alert.alert('Error', e.message ?? 'Failed to delete');
        } 
        finally {
            setDeleting(false);
            onDeleted();
            onClose();
        }
    };


    const [deleting, setDeleting] = useState(false);
    return (                
      <Modal visible={visible} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Delete this post?</Text>
            <View style={s.modalActions}>
              <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={onClose}>
                <Text style={s.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, s.btnRed]} onPress={confirmDelete} disabled={deleting}>
                {deleting ? <ActivityIndicator color="white" /> : <Text style={s.btnText}>Confirm</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
};

interface ProfileModalProps {
  visible: boolean
  user: any | null
  items: ItemOut[]
  loading?: boolean
  currentUserId?: string | null
  onClose: () => void
  onSelectItem?: (item: ItemOut) => void
  onViewProfile?: (id: string) => void
}

export function ProfileModal({
  visible,
  user,
  items,
  loading = false,
  currentUserId,
  onClose,
  onSelectItem,
  onViewProfile,
}: ProfileModalProps) {

  return (

    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.modalBox}>

          {user && (
            <ScrollView
              contentContainerStyle={s.contentGapMedium}
              showsVerticalScrollIndicator={false}
            >

              {/* Profile Header */}
              <View style={s.searchProfileContainer}>
                <View style={s.userResultAvatar}>
                  {user.profile_image_url ? (
                    <Image
                      source={{ uri: user.profile_image_url }}
                      style={{ width: '100%', height: '100%', borderRadius: 44 }}
                    />
                  ) : (
                    <Ionicons name="person" size={44} color="white" />
                  )}
                </View>

                <Text style={s.modalTitle}>{user.username}</Text>
              </View>


              {/* Bio */}
              {user.bio && (
                <View>
                  <Text style={s.userProfileLabel}>Bio</Text>
                  <Text style={s.userProfileText}>{user.bio}</Text>
                </View>
              )}


              {/* Address */}
              {user.address && (
                <View>
                  <Text style={s.userProfileLabel}>Location</Text>
                  <Text style={s.userProfileText}>{user.address}</Text>
                </View>
              )}


              {/* User Listings */}
              <View>

                <Text style={s.userListingLabel}>
                  Listings ({items.length})
                </Text>

                {loading ? (
                  <ActivityIndicator color="#4F728C" />

                ) : items.length === 0 ? (
                  <Text style={s.userListingEmpty}>No listings yet</Text>

                ) : (
                  items.map((item) => (

                    <TouchableOpacity
                      key={item.id}
                      style={s.searchItemsRow}
                      onPress={() => onSelectItem?.(item)}
                    >

                      <Image
                        source={{ uri: item.image }}
                        style={s.searchItemImage}
                      />

                      <View style={s.searchItemContainer}>
                        <Text style={s.searchItemName}>{item.name}</Text>
                        <Text style={s.searchItemPrice}>${item.price}</Text>
                      </View>

                    </TouchableOpacity>

                  ))
                )}

              </View>
              
              {/* View Full Profile & Connect */}
              <View style={{ gap: 10 }}>
                {onViewProfile && (
                  <TouchableOpacity
                    style={[s.btn, s.btnBlue]}
                    onPress={() => onViewProfile(user.id)}
                  >
                    <Text style={s.btnText}>View Profile</Text>
                  </TouchableOpacity>
                )}
                {user.id !== currentUserId && (
                  <ConnectButton userId={user.id} />
                )}
              </View>


              {/* Close */}
              <TouchableOpacity
                style={[s.btn, s.btnCancel]}
                onPress={onClose}
              >
                <Text style={s.btnCancelText}>Close</Text>
              </TouchableOpacity>

            </ScrollView>
          )}

        </View>
      </View>
    </Modal>
  )
}


export function ConnectButton({ userId }: { userId: string }) {
  const [status, setStatus] = useState<ConnectionStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.connections.status(userId)
      .then(r => setStatus(r.status))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handlePress = async () => {
    try {
      setLoading(true);
      if (status === 'none') {
        await api.connections.send(userId);
        setStatus('pending_sent');
      } else if (status === 'pending_sent') {
        await api.connections.remove(userId);
        setStatus('none');
      } else if (status === 'pending_received') {
        await api.connections.respond(userId, 'accept');
        setStatus('accepted');
      } else if (status === 'accepted') {
        await api.connections.remove(userId);
        setStatus('none');
      }
    } 
    catch (e: any) {
      Alert.alert('Connection Error', e.message ?? 'Something went wrong');} 
    finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator color="#4F728C" />;

  const label = {
    none:             'Connect',
    pending_sent:     'Cancel Request',
    pending_received: 'Accept Request',
    accepted:         'Connected ✓',
  }[status];

  const btnStyle = {
    none:             s.btnBlue,
    pending_sent:     s.btnCancel,
    pending_received: s.btnBlue,
    accepted:         s.btnCancel,
  }[status];

  const textStyle = {
    none:             s.btnText,
    pending_sent:     s.btnCancelText,
    pending_received: s.btnText,
    accepted:         s.btnCancelText,
  }[status];

  return (
    <TouchableOpacity style={[s.btn, btnStyle]} onPress={handlePress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}