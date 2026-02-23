import { StyleSheet } from "react-native"

export const COLORS = {
  primary: "#476E8D",
  secondary: "#9CB2C3",
  background: "#4f6d87",
  white: "#ffffff",
  black: "#000000",
  error: "#e53935",
  mutedText: "#666666",
}

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e3a5f",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  field: {
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 6,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 5,
    fontSize: 13,
  },
  messageText: {
    marginTop: 10,
    color: COLORS.error,
    fontSize: 14,
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 20,
  },
})
