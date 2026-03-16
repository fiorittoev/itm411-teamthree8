import { Dimensions } from "react-native"

export const { width, height } = Dimensions.get('window')

// ─── Responsive Breakpoints ──────────────────────────────────────────────────
export const isSmallPhone = width < 375
export const isPhone = width < 768
export const isTablet = width >= 768

// ─── Scaling Functions ───────────────────────────────────────────────────────
export const scale = (size: number) => {
  if (isSmallPhone) return size * 0.85
  if (isTablet) return size * 1.15
  return size
}

export const scaleHeight = (size: number) => {
  if (isSmallPhone) return size * 0.8
  if (isTablet) return size * 1.1
  return size
}

// ─── Unified Colors ──────────────────────────────────────────────────────────
export const COLORS = {
  primary: "#476E8D",
  primaryDark: "#3a5a73", 
  secondary: "#9CB2C3",
  background: "#f2f2f2",
  backgroundWhite: "#ffffff",
  offWhite: "#FFF6F6",
  
  white: "#ffffff",
  black: "#000000",
  
  text: "#222222",
  textMuted: "#666666",
  textLight: "#888888",
  
  border: "#dddddd",
  borderLight: "#eeeeee",
  
  success: "#2e7d32",
  error: "#e53935",
  warning: "#e65100",
  info: "#1976d2",

  // Legacy/Specific UI colors
  mutedText: "#6b7280",
  orange: "#e65100",
  darkOrange: "#bf360c",
  blue: "#187bcd",
  lightBlue: "#e3f2fd",
  lightGray: "#f5f5f5",
  gray: "#aaaaaa",
  darkGray: "#555555",
  darkerGray: "#333333",
  lightestGray: "#f0f0f0",
  danger: "#dc3545",
}
