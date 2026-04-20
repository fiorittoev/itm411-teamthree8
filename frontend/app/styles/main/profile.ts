import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const profileStyles = StyleSheet.create({
  profilePanel: {
    flex: 1,
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  profileAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  profileBody: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  profileRowIcon: {
    width: 36,
    alignItems: 'center',
  },
  profileRowLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  profileRowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  profileAction: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  profileActionText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  profileActionSmall: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  profileScrollGrow: {
    flexGrow: 1,
  },
  profileContentPadding: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  profileContentMargin: {
    marginBottom: 12,
  },
})
