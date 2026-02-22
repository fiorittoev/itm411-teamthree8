import { StyleSheet } from "react-native"

/**
 * Global shared styles that can be used across all modules.
 * Module-specific styles should be in their respective stylesheets:
 * - styles/main/mainStyles.ts - for main app screens
 * - styles/register/registerStyles.ts - for registration flow
 * - styles/auth/authStyles.ts - for authentication screens
 * - styles/settings/settingsStyles.ts - for settings screens
 */
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
  
  // Common spacing
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
})
