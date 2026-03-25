import { StyleSheet, Dimensions } from "react-native"
import { COLORS, scale, isPhone } from "../theme"

const { width, height } = Dimensions.get('window')

export { COLORS }

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandTitle: {
    fontSize: scale(32),
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: scale(16),
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: scale(22),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  title: {
    fontSize: scale(24),
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  field: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
})
