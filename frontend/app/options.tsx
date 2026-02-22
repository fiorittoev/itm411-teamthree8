import { View, Text, TouchableOpacity } from "react-native"
import { authStyles as s } from "./styles/auth/authStyles"
import { useRouter } from "expo-router"


export default function Options() {
  const router = useRouter()

  return (
    <View style={s.container}>
      <Text style={s.title}>Choose your location</Text>

      <TouchableOpacity
        style={s.button}
        onPress={() => router.push("/login")}
      >
        <Text style={s.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.button}
        onPress={() => router.push("/register")}
      >
        <Text style={s.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.button}
        onPress={() => router.replace("/main")}
      >
        <Text style={s.buttonText}>Guest</Text>
      </TouchableOpacity>
    </View>
  )
}
