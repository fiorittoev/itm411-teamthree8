import { View, Text, TextInput } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000'

export default function EmailStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [emailTaken, setEmailTaken] = useState(false)

  useEffect(() => {
    const validEmail = /\S+@\S+\.\S+/.test(data.email)
    const validPassword = data.password.length >= 6
    const passwordsMatch = data.password === data.confirmPassword

    setStepValid(validEmail && validPassword && passwordsMatch && !emailTaken)

    if (!validEmail) return

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE_URL}/check-email?email=${encodeURIComponent(data.email)}`)
        const json = await res.json()
        setEmailTaken(json.taken)
      } catch {
        setEmailTaken(false)
      }
    }, 500) // debounce

    return () => clearTimeout(timer)
  }, [data.email, data.password, data.confirmPassword])
  
  return (
    <View style={s.paddingContainer}>
      <Text style={s.titleLarge}>Register</Text>
      <Text style={[s.subtitle, s.subtitleMedium]}>
        Create an account by filling in the information below
      </Text>

      <Text style={s.label}>Email</Text>
      <TextInput
        value={data.email}
        onChangeText={(text) => { updateField("email", text); setEmailTaken(false) }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="you@example.com"
        style={s.input}
      />

      {data.email && !/\S+@\S+\.\S+/.test(data.email) && (
        <Text style={s.errorTextSmall}>Enter a valid email address</Text>
      )}
      {emailTaken && (
        <Text style={s.errorTextSmall}>This email is already in use</Text>
      )}

      <Text style={s.label}>Password</Text>
      <TextInput
        value={data.password}
        onChangeText={(text) => updateField("password", text)}
        secureTextEntry
        placeholder="Password (min 6 characters)"
        style={s.input}
      />

      <Text style={s.label}>Confirm Password</Text>
      <TextInput
        value={data.confirmPassword}
        onChangeText={(text) => updateField("confirmPassword", text)}
        secureTextEntry
        placeholder="Confirm password"
        style={s.input}
      />

      {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
        <Text style={s.errorTextSmall}>Passwords do not match</Text>
      )}
    </View>
  )
}