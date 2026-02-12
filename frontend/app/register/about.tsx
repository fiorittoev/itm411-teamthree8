import { View, Text, TextInput } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState } from "react";

export default function NameStep() {
  const [bio, setBio] = useState("");
  return (
    <View>
      <Text>Tell others a bit about yourself in your own words.</Text>
      <Text>This is your chance to describe who you are, your experiences, or anything that helps people get to know you better.</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        keyboardType="default"
        autoCapitalize="none"
        placeholder="Tell others little about yourself"
        style={globalStyles.field}
      />
      <Text>About Me visibility can be toggled in setings later</Text>
    </View>
  )
}
