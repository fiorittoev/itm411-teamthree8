import { View, Text, TextInput } from "react-native"
import { useEffect } from "react"
import { globalStyles } from "../styles/globalStyles"
import { useRegister } from "../context/RegisterContext"

export default function EmailStep() {
  const { data, updateField, setStepValid } = useRegister()

  useEffect(() => {
    const validEmail = /\S+@\S+\.\S+/.test(data.email)
    const validPassword = data.password.length >= 6
    const passwordsMatch = data.password === data.confirmPassword

    setStepValid(validEmail && validPassword && passwordsMatch)
  }, [data.email, data.password, data.confirmPassword])

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Register</Text>
      <Text style={{ marginBottom: 20 }}>
        Create an account by filling in the information below
      </Text>

      <Text>Email</Text>
      <TextInput
        value={data.email}
        onChangeText={(text) => updateField("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="you@example.com"
        style={globalStyles.field}
      />

      <Text>Password</Text>
      <TextInput
        value={data.password}
        onChangeText={(text) => updateField("password", text)}
        secureTextEntry
        placeholder="Password (min 6 characters)"
        style={globalStyles.field}
      />

      <Text>Confirm Password</Text>
      <TextInput
        value={data.confirmPassword}
        onChangeText={(text) => updateField("confirmPassword", text)}
        secureTextEntry
        placeholder="Confirm password"
        style={globalStyles.field}
      />

      {data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword && (
          <Text style={{ color: "red", marginTop: 5 }}>
            Passwords do not match
          </Text>
        )}

      {data.email && !/\S+@\S+\.\S+/.test(data.email) && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Enter a valid email address
        </Text>
      )}
    </View>
  )
}
