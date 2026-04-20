import React from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  StyleProp,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';

interface CustomTextInputProps extends TextInputProps {
  variant?: 'default' | 'rounded' | 'inline';
  error?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function TextInput({
  variant = 'default',
  error = false,
  disabled = false,
  style,
  ...props
}: CustomTextInputProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rounded':
        return styles.roundedInput;
      case 'inline':
        return styles.inlineInput;
      case 'default':
      default:
        return styles.defaultInput;
    }
  };

  return (
    <RNTextInput
      style={[
        styles.baseInput,
        getVariantStyles(),
        error && styles.errorInput,
        disabled && styles.disabledInput,
        style,
      ]}
      editable={!disabled}
      placeholderTextColor={COLORS.textLight}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  baseInput: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: TYPOGRAPHY.body.fontWeight,
    color: COLORS.text,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  defaultInput: {
    // Standard input styling
  },
  roundedInput: {
    borderRadius: 24,
  },
  inlineInput: {
    borderWidth: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  errorInput: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: COLORS.borderLight,
  },
});
