import { StyleSheet } from "react-native"
import { COLORS, SPACING, TYPOGRAPHY } from "../theme"

export const formStyles = StyleSheet.create({
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark, 
    borderRadius: 8, 
    padding: SPACING.sm, 
    fontSize: TYPOGRAPHY.body.fontSize, 
    color: COLORS.text 
  },
  textarea: { 
    minHeight: 70, 
    textAlignVertical: 'top'
  },
  postInput: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark,
    borderRadius: 8,
    padding: SPACING.sm, 
    fontSize: TYPOGRAPHY.body.fontSize, 
    minHeight: 90, 
    textAlignVertical: 'top' 
  },
  imagePicker: { 
    borderWidth: 1, 
    borderColor: COLORS.borderDark, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  imagePlaceholder: { 
    height: 100, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: SPACING.sm, 
    backgroundColor: COLORS.backgroundLight
  },
  imagePlaceholderText: { 
    color: COLORS.textLight, 
    fontSize: TYPOGRAPHY.body.fontSize 
  },
  imagePreview: { 
    width: '100%', 
    height: 160 
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  imagePlaceholderError: {
    color: COLORS.error,
  },
})
