import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

interface UserListItemProps {
  avatarUrl?: string | null;
  title: string;
  subtitle?: string | null;
  subtitleBold?: boolean;
  onPress?: () => void;
  actionSlot?: React.ReactNode;
}

export function UserListItem({ avatarUrl, title, subtitle, subtitleBold, onPress, actionSlot }: UserListItemProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.avatar}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
          />
        ) : (
          <Ionicons name="person" size={18} color="white" />
        )}
      </View>
      <View style={styles.textContent}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle ? (
          <Text 
            style={[styles.subtitleText, subtitleBold && styles.subtitleBold]} 
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionSlot && (
        <View style={styles.actionsContainer}>
          {actionSlot}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  textContent: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitleText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 1,
  },
  subtitleBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
