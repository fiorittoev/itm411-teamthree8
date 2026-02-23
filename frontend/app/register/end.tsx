import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { registerStyles as s } from "../styles/register/registerStyles"
import { useState,useEffect  } from "react";
import { useRegister } from "../context/RegisterContext"
export default function EndStep() {
    const { setStepValid } = useRegister()
  
    useEffect(() => {
      setStepValid(true)
    }, [])
  
  return (
    <View style={s.endContainer}>
      <Text style={s.endText}>Congratulations on setting up your profile! You can change any details anytime in settings</Text>
    </View>
  )
}
