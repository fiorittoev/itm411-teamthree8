import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { TextInput } from './TextInput';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  variant?: 'default' | 'rounded' | 'inline';
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormField({
  label,
  error,
  helperText,
  required = false,
  variant = 'default',
  containerStyle,
  ...textInputProps
}: FormFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <TextInput
        variant={variant}
        error={!!error}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  required: {
    color: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: 4,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    marginLeft: 4,
  },
});
