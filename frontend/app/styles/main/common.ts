import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const commonStyles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  safeMobile: {
    maxWidth: '100%',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbar: { 
    height: 56,
    backgroundColor: COLORS.secondaryDark, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: SPACING.lg
  },
  communityDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  communityMemberCount: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  logo: { 
    color: COLORS.white, 
    fontSize: 17, 
    fontWeight: '700',
    marginRight: SPACING.md
  },
  navIcons: { 
    flex: 1,
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center' 
  },
  profileCircle: { 
    width: 36, 
    height: 36,
    borderRadius: 18, 
    borderWidth: 2, 
    borderColor: COLORS.white, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: { 
    flex: 1, 
    flexDirection: 'row', 
    gap: SPACING.sm, 
    padding: SPACING.sm 
  },
})
