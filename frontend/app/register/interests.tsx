import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState } from "react";

export default function NameStep() {
  return (
    <View>
      <Text>Choose the interests and hobbies that most interest you</Text>
      <Text>Select as many as you would like</Text>
        <TouchableOpacity style={globalStyles.button}>
            <Text>Show All</Text>
        </TouchableOpacity>
        
      <Text>Interests can be added and removed in settings</Text>
      <Text>Interests visibility can be turned on or off in settings</Text>
    </View>
  )
}
