import { View, Text, TextInput,Keyboard } from "react-native"
import { useEffect } from "react"
import { globalStyles } from "../styles/globalStyles"
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Tell others a bit about yourself in your own words.
      </Text>

      <Text style={{ marginBottom: 20 }}>
        This is your chance to describe who you are, your experiences,
        or anything that helps people get to know you better.
      </Text>

      <TextInput
        value={data.bio}
        onChangeText={(text) => updateField("bio", text)}
        placeholder="Tell others a little about yourself"
        multiline
        numberOfLines={4}
        style={[globalStyles.field, { height: 120, textAlignVertical: "top" }]}
        blurOnSubmit={true}       
        onSubmitEditing={() => Keyboard.dismiss()}
        returnKeyType="done"     
      />

      {/* Character Counter */}
      <Text style={{ marginTop: 5 }}>
        {data.bio.length}/300 characters
      </Text>

      {/* Validation Feedback */}
      {data.bio.length > 0 && data.bio.trim().length < 10 && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Bio must be at least 10 characters
        </Text>
      )}

      {data.bio.length > 300 && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Bio must be under 300 characters
        </Text>
      )}

      <Text style={{ marginTop: 15 }}>
        About Me visibility can be toggled in settings later.
      </Text>
    </View>
  )
}
