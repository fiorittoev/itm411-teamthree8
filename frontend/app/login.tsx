import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { authStyles as s } from "./styles/auth/authStyles"
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

      router.replace("/main")
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Login</Text>
      <Text style={s.subtitle}>
        Welcome back! Sign in to continue.
      </Text>

      <Text style={s.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="you@example.com"
        style={s.field}
      />

      <Text style={s.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={s.field}
      />

      {email && !/\S+@\S+\.\S+/.test(email) && (
        <Text style={s.errorText}>
          Enter a valid email address
        </Text>
      )}

      {loading ? (
        <ActivityIndicator style={s.loadingContainer} />
      ) : (
        <TouchableOpacity
          style={[
            s.button,
            !isValid && s.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!isValid}
        >
          <Text style={s.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {message && (
        <Text style={s.messageText}>
          {message}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={s.linkContainer}
      >
        <Text style={s.linkText}>
          Dont have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  )
}
