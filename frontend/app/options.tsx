import { View, Text } from "react-native"
import { authStyles as s } from "./styles/auth/authStyles"
import { useRouter } from "expo-router"
import { Button } from "./components/ui/Button"


export default function Options() {
  const router = useRouter()

  return (
    <View style={s.container}>
      <Text style={s.title}>Welcome!</Text>

      <View style={{ gap: 15 }}>
        <Button title="Login" onPress={() => router.push("/login")} />
        <Button title="Register" onPress={() => router.push("/register")} />
        <Button title="Guest" onPress={() => router.replace("/main")} variant="secondary" />
      </View>
    </View>
  )
}
