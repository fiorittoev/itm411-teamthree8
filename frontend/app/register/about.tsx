import { View, Text, TextInput,Keyboard } from "react-native"
import { useEffect } from "react"
import { registerStyles as s } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"

export default function AboutStep() {
  const { data, updateField, setStepValid } = useRegister()

  useEffect(() => {
    const trimmedBio = data.bio.trim()
    const validBio =
      trimmedBio.length >= 10 &&
      trimmedBio.length <= 300

    setStepValid(validBio)
  }, [data.bio])

  return (
    <View style={s.paddingContainer}>
      <Text style={s.titleMedium}>
        Tell others a bit about yourself in your own words.
      </Text>

      <Text style={[s.subtitle, s.subtitleMedium]}>
        This is your chance to describe who you are, your experiences,
        or anything that helps people get to know you better.
      </Text>

      <TextInput
        value={data.bio}
        onChangeText={(text) => updateField("bio", text)}
        placeholder="Tell others a little about yourself"
        multiline
        numberOfLines={4}
        style={[s.input, s.textarea]}
        blurOnSubmit={true}       
        onSubmitEditing={() => Keyboard.dismiss()}
        returnKeyType="done"     
      />

      {/* Character Counter */}
      <Text style={s.characterCounter}>
        {data.bio.length}/300 characters
      </Text>

      {/* Validation Feedback */}
      {data.bio.length > 0 && data.bio.trim().length < 10 && (
        <Text style={s.errorTextSmall}>
          Bio must be at least 10 characters
        </Text>
      )}

      {data.bio.length > 300 && (
        <Text style={s.errorTextSmall}>
          Bio must be under 300 characters
        </Text>
      )}

      <Text style={s.infoText}>
        About Me visibility can be toggled in settings later.
      </Text>
    </View>
  )
}
