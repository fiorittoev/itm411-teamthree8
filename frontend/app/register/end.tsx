import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useState,useEffect  } from "react";
import { useRegister } from "../context/RegisterContext"
export default function EndStep() {
    const { setStepValid } = useRegister()
  
    useEffect(() => {
      setStepValid(true)
    }, [])
  
  return (
    
    <View>
      <Text>Congratulations on setting up your profile! You can change any details anytime in settings</Text>
    </View>
  )
}
