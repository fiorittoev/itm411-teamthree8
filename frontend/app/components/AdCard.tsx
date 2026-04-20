import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mainStyles as s } from '../styles/main/mainStyles';
import { AdOut } from '../../services/api';

interface AdCardProps {
  ad: AdOut;
}

export function AdCard({ ad }: AdCardProps) {
  const isMarketplace = ad.ad_type === 'marketplace';
  const router = useRouter();

  return (
    <View style={[s.adCard, isMarketplace && s.adCardMarketplace]}>
      <View style={s.adCardHeader}>
        <View style={s.adCardBadge}>
          <Ionicons name="megaphone" size={12} color="#4F728C" />
          <Text style={s.adCardSponsored}>Sponsored</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push(`/main/profile/${ad.owner_id}`)}
          activeOpacity={0.7}
        >
          <Text style={[s.adCardOwner, { color: '#0066cc' }]}>{ad.business_name || ad.owner_username}</Text>
        </TouchableOpacity>
      </View>

      <View style={isMarketplace ? s.adMarketplaceContent : s.adPostContent}>
        {isMarketplace && ad.image ? (
          <Image source={{ uri: ad.image }} style={s.adMarketplaceImage} />
        ) : null}

        <View style={s.adTextContainer}>
          <Text style={s.adCardTitle}>{ad.title}</Text>
          <Text style={s.adCardBody} numberOfLines={isMarketplace ? 2 : 4}>{ad.body}</Text>
          
          {ad.link_url && (
            <TouchableOpacity style={[s.btn, s.btnBlue, { paddingVertical: 8, marginTop: 12, borderRadius: 8 }]} onPress={() => {}}>
              <Text style={[s.btnText, { fontSize: 13 }]}>{isMarketplace ? 'View Deal' : 'Learn More'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
