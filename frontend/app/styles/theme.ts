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

// ─── Unified Colors (Single Source of Truth) ─────────────────────────────────
export const COLORS = {
  // Brand / Primary Colors
  primary: "#1A5F7A",          // Deep Lake Blue (use for primary buttons, links, headers)
  primaryDark: "#0B2B40",       // Dark Navy (use for navbar, dark accents)
  secondary: "#159895",         // Teal Water (use for secondary actions, highlights)
  secondaryDark: "#4F728C",     // Medium slate blue (use for secondary buttons, badges)
  secondaryLight: "#9fb7c8",    // Light slate blue (use for disabled/muted secondary elements)
  accent: "#54BAB9",            // Light Teal (use for interactive elements, accents)
  
  // Neutral / Surface
  background: "#F2F5F9",        // Very light blue-gray (use for app background)
  surface: "#FFFFFF",           // White (use for cards, panels, containers)
  white: "#FFFFFF",
  black: "#111827",             // Near Black
  
  // Text / Typography
  text: "#1F2937",              // Dark Gray (use for body text, primary content)
  textMuted: "#6B7280",         // Medium Gray (use for secondary text, descriptions)
  textLight: "#9CA3AF",         // Light Gray (use for captions, disabled text)
  
  // State / Status Indicators
  success: "#10B981",           // Modern Emerald (use for success messages, checkmarks)
  error: "#EF4444",             // Modern Red (use for errors, warnings, delete actions)
  errorDark: "#C0392B",         // Dark red (use for destructive actions, logout)
  warning: "#F59E0B",           // Modern Amber (use for warnings, caution)
  info: "#3B82F6",              // Modern Blue (use for info messages, hints)
  
  // Borders / Dividers
  border: "#E5E7EB",            // Default border (use for most borders, dividers)
  borderLight: "#F3F4F6",       // Light border (use for subtle dividers)
  borderDark: "#CCCCCC",        // Darker border (use for more prominent borders)
  borderFocused: "#1A5F7A",     // Focused border (use for input focus states)
  
  // Backgrounds
  backgroundMuted: "#FAFAFA",   // Off-white background (use for disabled/muted bg)
  backgroundLight: "#F9F9F9",   // Light background (use for subtle sections)
}

// ─── Typographic Scale (Consistent Font Hierarchy) ──────────────────────────
export const TYPOGRAPHY = {
  fontFamily: 'System', // Uses system fonts for iOS/Android
  
  // Display (largest, for hero sections)
  display: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  
  // H1 (page titles, major headings)
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  
  // H2 (section headers)
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  
  // H3 (subsection headers)
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // Body (default text, paragraphs)
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // BodyStrong (emphasized body text, labels)
  bodyStrong: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  
  // Caption (secondary text, captions, hints)
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  
  // Tiny (smallest text, badges, tags)
  tiny: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 12,
  },
}

// ─── Spacing Scale (Consistent Spacing System) ────────────────────────────────
export const SPACING = {
  xs: 4,      // Tiny gaps, micro-spacing
  sm: 8,      // Small gaps between elements
  md: 12,     // Default padding for panels, cards, containers
  lg: 16,     // Large padding for sections
  xl: 24,     // Extra large padding for major sections
  xxl: 32,    // Massive spacing for hero sections
}
