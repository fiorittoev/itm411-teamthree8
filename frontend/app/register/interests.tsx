import { View, Text, TouchableOpacity, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"
import { Ionicons } from '@expo/vector-icons'

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
    <View style={s.stepContainer}>
      <Text style={s.titleLarge}>Your Interests</Text>
      <Text style={s.subtitle}>
        Select what you're passionate about to connect with like-minded neighbors.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {ALL_INTERESTS.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggleInterest(item)}
            style={[
              s.interestChip,
              selected.includes(item) ? s.interestChipSelected : s.interestChipUnselected,
              { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }
            ]}
          >
            <Text style={[
              s.interestChipText,
              selected.includes(item) && s.interestChipTextSelected
            ]}>
              {item}
            </Text>
            {selected.includes(item) && (
              <Ionicons name="checkmark" size={16} color={COLORS.white} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[s.card, { backgroundColor: COLORS.lightGray, borderColor: COLORS.border, marginTop: 40 }]}>
        <Text style={[s.bodyText, { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }]}>
          You can always update these later in your profile settings.
        </Text>
      </View>
    </View>
  )
}
