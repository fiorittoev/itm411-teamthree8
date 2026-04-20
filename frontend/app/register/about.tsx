import { View, Text, TextInput, Keyboard } from "react-native"
import { useEffect } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"

export default function AboutStep() {
  const { data, updateField, setStepValid } = useRegister()

  useEffect(() => {
    const trimmedBio = (data.bio || "").trim()
    const validBio = trimmedBio.length >= 10 && trimmedBio.length <= 300
    setStepValid(validBio)
  }, [data.bio])

  return (
    <View style={s.stepContainer}>
      <Text style={s.titleLarge}>Tell us about yourself</Text>
      <Text style={s.subtitle}>
        Share what you love about lake life. This helps your neighbors get to know you.
      </Text>

      <View style={s.section}>
        <Text style={s.labelSmall}>Your Bio *</Text>
        <TextInput
          value={data.bio}
          onChangeText={(text) => updateField("bio", text)}
          placeholder="e.g. I've lived on the lake for 10 years and love early morning paddles..."
          multiline
          numberOfLines={6}
          style={[s.input, s.textarea]}
          blurOnSubmit={true}       
          onSubmitEditing={() => Keyboard.dismiss()}
          returnKeyType="done"     
          placeholderTextColor={COLORS.textLight}
          maxLength={300}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <View>
            {data.bio.length > 0 && data.bio.trim().length < 10 && (
              <Text style={s.errorText}>Mini bio must be at least 10 chars</Text>
            )}
          </View>
          <Text style={[s.labelSmall, data.bio.length >= 300 && { color: COLORS.error }]}>
            {data.bio.length}/300
          </Text>
        </View>
      </View>

      <View style={[s.card, { backgroundColor: COLORS.lightBlue, borderColor: COLORS.primary + '20' }]}>
        <Text style={[s.bodyText, { color: COLORS.primary, fontSize: 13, fontWeight: '500' }]}>
          Tip: Mention your favorite lake activities or if you're new to the area!
        </Text>
      </View>
    </View>
  )
}
