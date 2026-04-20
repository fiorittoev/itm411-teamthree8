import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mainStyles as s } from '../../styles/main/mainStyles';
import { ItemOut } from '../../../services/api';
import { ConnectButton } from '../ConnectButton';

interface ProfileModalProps {
  visible: boolean;
  user: any | null;
  items: ItemOut[];
  loading?: boolean;
  currentUserId?: string | null;
  onClose: () => void;
  onSelectItem?: (item: ItemOut) => void;
  onViewProfile?: (id: string) => void;
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
              <View style={s.searchProfileContainer}>
                <View
                  style={[
                    s.userResultAvatar,
                    user.is_business && { backgroundColor: '#2c3e50' },
                  ]}
                >
                  {user.profile_image_url ? (
                    <Image
                      source={{ uri: user.profile_image_url }}
                      style={{ width: '100%', height: '100%', borderRadius: 44 }}
                    />
                  ) : (
                    <Ionicons
                      name={user.is_business ? 'business' : 'person'}
                      size={44}
                      color="white"
                    />
                  )}
                </View>

                <View style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={s.modalTitle}>
                    {user.is_business && user.business_name
                      ? user.business_name
                      : user.username}
                  </Text>
                  <View
                    style={[
                      s.adCardBadge,
                      {
                        backgroundColor: user.is_business
                          ? 'rgba(79, 114, 140, 0.15)'
                          : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                    <Text style={[s.adCardSponsored, { fontSize: 9 }]}>
                      {user.is_business ? 'Business Account' : 'Personal Account'}
                    </Text>
                  </View>
                </View>
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
  );
}
