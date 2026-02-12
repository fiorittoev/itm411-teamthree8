import { View, Text, TextInput } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState } from "react";

export default function NameStep() {
  const [displayName, setDisplayName] = useState("");
  return (
    <View>
      <Text>Choose a Display Name</Text>
      <Text>It can be your real name, a nickname, or a username. This is how others will recognize you in the app</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        keyboardType="default"
        autoCapitalize="none"
        placeholder="Enter your display name"
        style={globalStyles.field}
      />
    </View>
  )
}
