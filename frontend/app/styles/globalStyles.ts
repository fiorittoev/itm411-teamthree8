import { StyleSheet } from "react-native"
import { COLORS, TYPOGRAPHY, SPACING } from "./theme"

export const globalStyles = StyleSheet.create({
  // Common layout utilities
  flex1: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  // Spacing utilities
  paddingXS: { padding: SPACING.xs },
  paddingSM: { padding: SPACING.sm },
  paddingMD: { padding: SPACING.md },
  paddingLG: { padding: SPACING.lg },
  paddingXL: { padding: SPACING.xl },
  
  marginXS: { margin: SPACING.xs },
  marginSM: { margin: SPACING.sm },
  marginMD: { margin: SPACING.md },
  marginLG: { margin: SPACING.lg },
  marginXL: { margin: SPACING.xl },
  
  gapXS: { gap: SPACING.xs },
  gapSM: { gap: SPACING.sm },
  gapMD: { gap: SPACING.md },
  gapLG: { gap: SPACING.lg },
  gapXL: { gap: SPACING.xl },

  // Typography using new scale
  display: {
    ...TYPOGRAPHY.display,
    color: COLORS.text,
  },
  h1: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  h2: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  h3: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  body: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  bodyStrong: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
  },
  caption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  tiny: {
    ...TYPOGRAPHY.tiny,
    color: COLORS.textLight,
  },
  
  // Containers
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Forms
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  
  // Panels
  panel: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: "hidden",
  },
})
