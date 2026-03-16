import { StyleSheet } from "react-native"

export const COLORS = {
  primary: "#476E8D",
  secondary: "#9CB2C3",
  background: "#ffffff",
  white: "#ffffff",
  black: "#000000",
  error: "#e53935",
  mutedText: "#666666",
  border: "#dddddd"
}

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    color: COLORS.black,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    
    marginBottom: 20,
  },
  field: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
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
    color: COLORS.primary,
    fontSize: 14,
  },
  loadingContainer: {
    marginTop: 20,
  },
})
