import { View, Text, TextInput, ActivityIndicator } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"
import { Ionicons } from '@expo/vector-icons'

export default function NameStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [checking, setChecking] = useState(false)
  const [taken, setTaken] = useState(false)

  const formatValid = data.name.trim().length >= 3 && data.name.trim().length <= 20
  const tooShort = data.name.trim().length > 0 && data.name.trim().length < 3
  const tooLong = data.name.length > 20

  useEffect(() => {
    setStepValid(formatValid && !taken && !checking)
  }, [formatValid, taken, checking])

  function handleChange(text: string) {
    updateField("name", text)
    setTaken(false)
  }

  async function checkUniqueness() {
    if (!formatValid) return
    setChecking(true)
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", data.name.trim())
        .maybeSingle()

      setTaken(!!existing)
    } catch (err) {
      console.error("Username check error:", err)
    } finally {
      setChecking(false)
    }
  }

  return (
    <View style={s.stepContainer}>
      <Text style={s.titleLarge}>Your Community Name</Text>
      <Text style={s.subtitle}>
        This is how your neighbors will see you in the community feed and search.
      </Text>

      <View style={s.section}>
        <Text style={s.labelSmall}>Display Name *</Text>
        <View style={s.inputContainer}>
          <TextInput
            value={data.name}
            onChangeText={handleChange}
            onBlur={checkUniqueness}
            autoCapitalize="none"
            placeholder="e.g. CaptainLake22"
            style={[
              s.input,
              taken && s.inputError,
              !taken && formatValid && !checking && s.inputSuccess,
            ]}
            placeholderTextColor={COLORS.textLight}
          />
          {checking && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={s.iconContainer}
            />
          )}
          {!checking && formatValid && !taken && (
            <View style={s.iconContainer}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            </View>
          )}
        </View>

        {tooShort && (
          <Text style={s.errorText}>Name must be at least 3 characters</Text>
        )}
        {tooLong && (
          <Text style={s.errorText}>Name must be under 20 characters</Text>
        )}
        {taken && (
          <Text style={s.errorText}>That name is already taken</Text>
        )}
        {!taken && formatValid && !checking && (
          <Text style={s.successText}>Name is available!</Text>
        )}
      </View>
    </View>
  )
}