import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { globalStyles } from "../styles/globalStyles"
import { useRegister } from "../context/RegisterContext"

// Example interest options
const ALL_INTERESTS = [
  "Boating",
  "Fishing",
  "Kayaking",
  "Swimming",
  "Paddleboarding",
  "Picnicking",
  "Hiking",
  "Wildlife Watching",
]

export default function InterestStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [selected, setSelected] = useState<string[]>(data.interests || [])

  useEffect(() => {
    // Step is valid if at least one interest is selected
    setStepValid(selected.length > 0)
    // Update context whenever selection changes
    updateField("interests", selected)
  }, [selected])

  function toggleInterest(interest: string) {
    if (selected.includes(interest)) {
      setSelected(selected.filter((i) => i !== interest))
    } else {
      setSelected([...selected, interest])
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Choose the interests and hobbies that most interest you
      </Text>

      <Text style={{ marginBottom: 20 }}>Select as many as you would like</Text>

      <FlatList
        data={ALL_INTERESTS}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleInterest(item)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 20,
              backgroundColor: selected.includes(item) ? "green" : "#ddd",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: selected.includes(item) ? "white" : "black" }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={{ marginTop: 20 }}>
        Interests can be added and removed in settings
      </Text>

      <Text>Interests visibility can be turned on or off in settings</Text>
    </View>
  )
}
