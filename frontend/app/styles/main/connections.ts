import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const connectionStyles = StyleSheet.create({
  connectionsPanel: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    paddingTop: 12,
    maxHeight: '85%',
  },
  connectionsOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  connectionsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionsPanelTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundLight,
  },
  connectionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  connectionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  connectionMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  connectionAcceptBtn: {
    backgroundColor: COLORS.secondaryDark,
    borderRadius: 6,
    padding: SPACING.xs,
  },
  connectionDeclineBtn: {
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    padding: SPACING.xs,
  },
  connectionEmpty: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.lg,
    fontSize: 14,
  },
})
