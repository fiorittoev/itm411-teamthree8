import { View, Text, TextInput, ActivityIndicator } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"

export default function NameStep() {
  // States and context
  const { data, updateField, setStepValid } = useRegister()
  const [checking, setChecking] = useState(false)
  const [taken, setTaken] = useState(false)

  // Validation logic for display name field
  const tooShort = data.name.trim().length > 0 && data.name.trim().length < 3
  const tooLong = data.name.length > 20
  const formatValid = data.name.trim().length >= 3 && data.name.trim().length <= 20

  // Update step validity whenever relevant fields or states change
  useEffect(() => {
    setStepValid(formatValid && !taken && !checking)
  }, [formatValid, taken, checking])

  // Reset taken status whenever name changes
  function handleChange(text: string) {
    updateField("name", text)
    setTaken(false)
  }

  // Check if the entered display name is already taken in the database, providing feedback to the user
  async function checkUniqueness() {
    if (!formatValid) 
      return
    setChecking(true)
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", data.name.trim()) // case-insensitive match
        .maybeSingle()

      setTaken(!!existing)
    } 
    catch (err) {
      console.error("Username check error:", err)
    } 
    finally {
      setChecking(false)
    }
  }

  return (
    <View style={s.paddingContainer}>
      <Text style={s.titleLarge}>Choose a Display Name</Text>
      <Text style={[s.subtitle, s.subtitleMedium]}>
        It can be your real name, a nickname, or a username.
        This is how others will recognize you in the app.
      </Text>

      <View style={s.inputContainer}>
        <TextInput
          value={data.name}
          onChangeText={handleChange}
          onBlur={checkUniqueness}
          autoCapitalize="none"
          placeholder="Enter your display name"
          style={[
            s.input,
            taken && s.inputError,
            !taken && formatValid && !checking && s.inputSuccess,
          ]}
        />
        {checking && (
          <ActivityIndicator
            size="small"
            color={COLORS.blue}
            style={s.iconContainer}
          />
        )}
        {!checking && formatValid && !taken && (
          <Text style={s.checkIcon}>✓</Text>
        )}
      </View>

      {tooShort && (
        <Text style={s.errorTextSmall}>Name must be at least 3 characters</Text>
      )}
      {tooLong && (
        <Text style={s.errorTextSmall}>Name must be under 20 characters</Text>
      )}
      {taken && (
        <Text style={s.errorTextSmall}>That name is already taken — try another</Text>
      )}
      {!taken && formatValid && !checking && (
        <Text style={s.successTextSmall}>Name is available</Text>
      )}
    </View>
  )
}