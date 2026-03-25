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
  // Brand / Main Colors
  primary: "#1A5F7A",       // Deep Lake Blue
  primaryDark: "#0B2B40",   // Near Black Navy
  secondary: "#159895",     // Teal Water
  accent: "#54BAB9",        // Light Teal
  background: "#F2F5F9",    // Very light blue-gray
  surface: "#FFFFFF",
  
  // Typography
  white: "#FFFFFF",
  black: "#111827",         // Near Black
  text: "#1F2937",          // Dark Gray
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  
  // States / Indicators
  success: "#10B981",       // Modern Emerald
  error: "#EF4444",         // Modern Red
  warning: "#F59E0B",       // Modern Amber
  info: "#3B82F6",          // Modern Blue
  
  // Borders / Dividers
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  borderFocused: "#1A5F7A",

  // Legacy mappings for backward compatibility
  mutedText: "#6B7280",
  orange: "#F59E0B",
  darkOrange: "#B45309",
  blue: "#1A5F7A",
  lightBlue: "#E0F2FE",
  lightGray: "#F9FAFB",
  gray: "#9CA3AF",
  darkGray: "#4B5563",
  darkerGray: "#1F2937",
  lightestGray: "#F3F4F6",
  danger: "#EF4444",
  offWhite: "#F8FAFC",
  backgroundWhite: "#FFFFFF",
}
