import { StyleSheet } from "react-native"
import { COLORS } from "./theme"

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
  
  // Common spacing
  paddingSmall: { padding: 8 },
  paddingMedium: { padding: 16 },
  paddingLarge: { padding: 24 },
  
  marginSmall: { margin: 8 },
  marginMedium: { margin: 16 },
  marginLarge: { margin: 24 },

  gapSmall: { gap: 8 },
  gapMedium: { gap: 12 },
  gapLarge: { gap: 16 },

  // Typography
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  text: {
    fontSize: 14,
    color: COLORS.text,
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
    padding: 12,
    fontSize: 15,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  
  // Panels
  panel: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: "hidden",
  },
})
