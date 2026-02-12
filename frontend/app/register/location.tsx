import { View, Text, TextInput } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState } from "react";

export default function LocationStep() {
  const [address, setAddress] = useState("");
  return (
    <View>
      <TextInput
        value={address}
        onChangeText={setAddress}
        keyboardType="default"
        autoCapitalize="none"
        placeholder="Enter your address"
        style={globalStyles.field}
      />
      <Text>Location visibility can be turned on or off in settings</Text>
    </View>
  )
}
