import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState,useEffect } from "react";
import { useRegister } from "../context/RegisterContext"


export default function ItemStep() {
    const { setStepValid } = useRegister()

  // Hardcode step as valid for now
  useEffect(() => {
    setStepValid(true)
  }, [])
  
  return (
    <View>
      <Text>Add items you own or have access to, like boats, vehicles,water toys, or equipment</Text>
      <Text>This helps neighbors connect,share, or buy and sell more easily</Text>
    </View>
  )
}
