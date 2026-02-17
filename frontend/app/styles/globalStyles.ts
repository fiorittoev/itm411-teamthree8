import { StyleSheet } from "react-native"

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4f6d87",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#1e3a5f",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  field: {
    borderWidth: 1,
    padding: 8, 
    marginBottom: 12
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slotContainer: {
    flex: 1,
  },
  bottomContainer: {
    marginTop: 10,
  },
  nextButton: {
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "green",
    borderRadius: 4,
  },
})
