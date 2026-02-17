import { View, Text, TextInput } from "react-native"
import { useEffect } from "react"
import { globalStyles } from "../styles/globalStyles"
import { useRegister } from "../context/RegisterContext"

export default function NameStep() {
  const { data, updateField, setStepValid } = useRegister()

  useEffect(() => {
    const validName =
      data.name.trim().length >= 3 &&
      data.name.trim().length <= 20

    setStepValid(validName)
  }, [data.name])

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Choose a Display Name
      </Text>

      <Text style={{ marginBottom: 20 }}>
        It can be your real name, a nickname, or a username.
        This is how others will recognize you in the app.
      </Text>

      <TextInput
        value={data.name}
        onChangeText={(text) => updateField("name", text)}
        autoCapitalize="none"
        placeholder="Enter your display name"
        style={globalStyles.field}
      />
      {data.name.length > 0 && data.name.trim().length < 3 && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Name must be at least 3 characters
        </Text>
      )}

      {data.name.length > 20 && (
        <Text style={{ color: "red", marginTop: 5 }}>
          Name must be under 20 characters
        </Text>
      )}
    </View>
  )
}
