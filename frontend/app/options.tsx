import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { globalStyles } from "./styles/globalStyles"
import { useRouter } from "expo-router"


export default function Options() {
  const router = useRouter()

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Choose your location</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/register")}
      >
        <Text style={globalStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.replace("/home")}
      >
        <Text style={globalStyles.buttonText}>Guest</Text>
      </TouchableOpacity>
    </View>
  )
}
