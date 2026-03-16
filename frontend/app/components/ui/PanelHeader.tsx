import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
}

export function PanelHeader({ title, onClose, onBack }: PanelHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
      
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <Ionicons name="close" size={onBack ? 24 : 20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  iconButton: {
    padding: 4,
  },
});
