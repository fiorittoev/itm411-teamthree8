import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mainStyles as s } from '../styles/main/mainStyles';
import { ItemOut } from '../../services/api';

interface MarketCardProps {
  item: ItemOut;
  isFav: boolean;
  onPress: () => void;
  onToggleFav: () => void;
}

export function MarketCard({ item, isFav, onPress, onToggleFav }: MarketCardProps) {
  const router = useRouter();
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.cardImg} />
      <View style={s.cardInfo}>
        <View style={s.cardText}>
          <Text style={s.cardName} numberOfLines={2}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Text style={[s.cardPrice, { marginBottom: 0 }]}>${item.price}</Text>
            {item.owner_is_business && (
              <View style={[s.adCardBadge, { paddingHorizontal: 4, paddingVertical: 1 }]}>
                <Text style={[s.adCardSponsored, { fontSize: 7 }]}>Business</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            onPress={e => { e.stopPropagation?.(); router.push(`/main/profile/${item.owner_id}`); }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 10, color: '#0066cc' }} numberOfLines={1}>
              Seller: { (item.owner_is_business && item.owner_business_name) ? item.owner_business_name : item.owner_username }
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={e => { e.stopPropagation?.(); onToggleFav(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={s.cardFav.color} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
