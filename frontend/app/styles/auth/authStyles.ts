import { StyleSheet, Dimensions } from "react-native"
import { COLORS, SPACING, TYPOGRAPHY, scale, isPhone } from "../theme"

const { width, height } = Dimensions.get('window')

export { COLORS, SPACING, TYPOGRAPHY }

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  brandTitle: {
    ...TYPOGRAPHY.display,
    color: COLORS.primary,
    letterSpacing: -1,
    textAlign: 'center',
  },
  brandSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  welcomeText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  field: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.lg,
    fontSize: TYPOGRAPHY.body.fontSize,
    color: COLORS.text,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: -8,
    marginBottom: SPACING.lg,
    marginLeft: SPACING.xs,
  },
  linkContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
})
