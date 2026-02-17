import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { globalStyles } from "./styles/globalStyles"
import { supabase } from "../services/supabase"

export default function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isValid, setIsValid] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Validation (mirrors EmailStep logic)
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

      router.replace("/(tabs)/home")
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Login</Text>
      <Text style={{ marginBottom: 20 }}>
        Welcome back! Sign in to continue.
      </Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="you@example.com"
        style={globalStyles.field}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={globalStyles.field}
      />

      {email && !/\S+@\S+\.\S+/.test(email) && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Enter a valid email address
        </Text>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={[
            globalStyles.button,
            { opacity: isValid ? 1 : 0.5 },
          ]}
          onPress={handleLogin}
          disabled={!isValid}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {message && (
        <Text style={{ marginTop: 10, color: "red" }}>
          {message}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: "center" }}>
          Dont have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}
