import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { authStyles as s, COLORS } from "./styles/auth/authStyles"
import { supabase } from "../services/supabase"
import { Button } from "./components/ui/Button"
import { Ionicons } from '@expo/vector-icons'

export default function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isValid, setIsValid] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const validEmail = /\S+@\S+\.\S+/.test(email)
    const validPassword = password.length >= 6
    setIsValid(validEmail && validPassword)
  }, [email, password])

  async function handleLogin() {
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        return
      }

      router.replace("/main")
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.content}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ alignSelf: 'flex-start', marginBottom: 24 }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={s.title}>Sign In</Text>
            <Text style={[s.brandSubtitle, { marginBottom: 32 }]}>
              Welcome back to My Michigan Lake.
            </Text>

            <View style={{ width: '100%', maxWidth: 400 }}>
              <Text style={s.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                style={s.field}
                placeholderTextColor={COLORS.textLight}
              />

              <Text style={s.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Your password"
                style={s.field}
                placeholderTextColor={COLORS.textLight}
              />

              {email && !/\S+@\S+\.\S+/.test(email) && (
                <Text style={s.errorText}>
                  Enter a valid email address
                </Text>
              )}

              {message && (
                <Text style={[s.errorText, { textAlign: 'center' }]}>
                  {message}
                </Text>
              )}

              <Button 
                title="Sign In" 
                onPress={handleLogin} 
                disabled={!isValid || loading} 
                loading={loading}
                style={{ borderRadius: 12, paddingVertical: 14, marginTop: 16 }}
              />

              <TouchableOpacity
                onPress={() => router.push("/register")}
                style={s.linkContainer}
              >
                <Text style={[s.brandSubtitle, { fontSize: 14 }]}>
                  Don't have an account? <Text style={s.linkText}>Create one</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
