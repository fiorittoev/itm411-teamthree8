import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  style, 
  textStyle, 
  disabled,
  loading 
}: ButtonProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getVariantTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmall;
      case 'large':
        return styles.sizeLarge;
      case 'medium':
      default:
        return styles.sizeMedium;
    }
  };

  const getSizeTextStyles = () => {
    switch (size) {
      case 'small':
        return styles.sizeSmallText;
      case 'large':
        return styles.sizeLargeText;
      case 'medium':
      default:
        return styles.sizeMediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getSizeStyles(),
        getVariantStyles(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={[styles.baseText, getSizeTextStyles(), getVariantTextStyles(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Size variants
  sizeSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  // Color variants
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Text styles
  baseText: {
    fontWeight: '600',
  },
  sizeSmallText: {
    ...TYPOGRAPHY.caption,
  },
  sizeMediumText: {
    ...TYPOGRAPHY.bodyStrong,
  },
  sizeLargeText: {
    ...TYPOGRAPHY.h3,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
});

