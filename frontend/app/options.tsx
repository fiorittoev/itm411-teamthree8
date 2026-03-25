import { View, Text, SafeAreaView } from "react-native"
import { authStyles as s, COLORS } from "./styles/auth/authStyles"
import { useRouter } from "expo-router"
import { Button } from "./components/ui/Button"
import { Ionicons } from '@expo/vector-icons'

export default function Options() {
  const router = useRouter()

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <View style={s.brandContainer}>
          <Ionicons name="water" size={64} color={COLORS.primary} style={{ marginBottom: 16 }} />
          <Text style={s.brandTitle}>My Michigan Lake</Text>
          <Text style={s.brandSubtitle}>Your Community, Your Life, Your Lake</Text>
        </View>

        <Text style={s.welcomeText}>Welcome to the neighborhood!</Text>

        <View style={s.buttonContainer}>
          <Button 
            title="Sign In" 
            onPress={() => router.push("/login")} 
            style={{ borderRadius: 12, paddingVertical: 14 }}
          />
          <Button 
            title="Create Account" 
            onPress={() => router.push("/register")} 
            variant="secondary"
            style={{ borderRadius: 12, paddingVertical: 14 }}
          />
          <View style={{ height: 32 }} />
          <Button 
            title="Explore as Guest" 
            onPress={() => router.replace("/main")} 
            variant="secondary"
            style={{ borderWidth: 0, opacity: 0.7 }}
            textStyle={{ color: COLORS.textMuted, fontWeight: '500' }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
