import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s } from "../styles/register/registerStyles"
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
    <View style={s.paddingContainer}>
      <Text style={s.titleMedium}>
        Choose the interests and hobbies that most interest you
      </Text>

      <Text style={[s.subtitle, s.subtitleMedium]}>Select as many as you would like</Text>

      <FlatList
        data={ALL_INTERESTS}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleInterest(item)}
            style={[
              s.interestChip,
              selected.includes(item) ? s.interestChipSelected : s.interestChipUnselected,
            ]}
          >
            <Text style={selected.includes(item) ? s.interestChipTextSelected : s.interestChipText}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={s.infoText}>
        Interests can be added and removed in settings
      </Text>

      <Text style={s.infoTextSmall}>Interests visibility can be turned on or off in settings</Text>
    </View>
  )
}
