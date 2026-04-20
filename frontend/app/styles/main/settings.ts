import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const settingsStyles = StyleSheet.create({
  settingsPanel: {
    flex: 1,
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingsContent: {
    padding: SPACING.lg,
    paddingBottom: 30,
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingsRowText: {
    flex: 1,
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingsRowValue: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  settingsRowSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  settingsModal: {
    backgroundColor: COLORS.surface,
    width: '85%',
    maxWidth: 480,
    borderRadius: 12,
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  settingsModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
  },
  logoutBtn: {
    backgroundColor: COLORS.errorDark,
  },
})
