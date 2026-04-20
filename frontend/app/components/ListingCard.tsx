import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { mainStyles as s } from '../styles/main/mainStyles';
import { ItemOut } from '../../services/api';

interface ListingCardProps {
  item: ItemOut;
  onPress: () => void;
}

export function ListingCard({ item, onPress }: ListingCardProps) {
  return (
    <TouchableOpacity style={s.listingCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.previewImg} />
      <View style={s.previewPrice}>
        <Text style={s.previewPriceText}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
