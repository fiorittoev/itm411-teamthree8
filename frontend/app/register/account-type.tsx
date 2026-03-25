import { View, Text, TouchableOpacity, TextInput } from "react-native"
import { useEffect } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"
import { Ionicons } from '@expo/vector-icons'

export default function AccountTypeStep() {
  const { data, updateField, setStepValid } = useRegister()

  useEffect(() => {
    const valid =
      data.accountType === 'user' ||
      (data.accountType === 'business' && (data.businessName || "").trim().length > 0)
    setStepValid(valid)
  }, [data.accountType, data.businessName])

  return (
    <View style={s.stepContainer}>
      <Text style={s.titleLarge}>Account Type</Text>
      <Text style={s.subtitle}>
        Choose the type of account you'd like to create.
      </Text>

      {/* Personal option */}
      <TouchableOpacity
        onPress={() => updateField('accountType', 'user')}
        style={[
          s.selectionCard,
          data.accountType === 'user' ? s.selectionCardSelected : s.selectionCardUnselected,
        ]}
        activeOpacity={0.8}
      >
        <View style={[s.selectionIconContainer, data.accountType === 'user' && s.selectionIconContainerSelected]}>
          <Ionicons 
            name="person-outline" 
            size={24} 
            color={data.accountType === 'user' ? COLORS.white : COLORS.primary} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.selectionCardTitle, data.accountType === 'user' && s.selectionCardTitleSelected]}>
            Personal Account
          </Text>
          <Text style={s.selectionCardSubtitle}>
            For residents, neighbors, and lake lovers.
          </Text>
        </View>
        {data.accountType === 'user' && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      {/* Business option */}
      <TouchableOpacity
        onPress={() => updateField('accountType', 'business')}
        style={[
          s.selectionCard,
          data.accountType === 'business' ? s.selectionCardSelected : s.selectionCardUnselected,
        ]}
        activeOpacity={0.8}
      >
        <View style={[s.selectionIconContainer, data.accountType === 'business' && s.selectionIconContainerSelected]}>
          <Ionicons 
            name="briefcase-outline" 
            size={24} 
            color={data.accountType === 'business' ? COLORS.white : COLORS.primary} 
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.selectionCardTitle, data.accountType === 'business' && s.selectionCardTitleSelected]}>
            Business Account
          </Text>
          <Text style={s.selectionCardSubtitle}>
            For local business owners. Promote your services to the community.
          </Text>
        </View>
        {data.accountType === 'business' && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </TouchableOpacity>

      {/* Business name field — only shown for businesses */}
      {data.accountType === 'business' && (
        <View style={s.section}>
          <Text style={s.labelSmall}>Business Name</Text>
          <TextInput
            value={data.businessName}
            onChangeText={(text) => updateField('businessName', text)}
            placeholder="e.g. Lake Shore Rentals"
            style={s.input}
            placeholderTextColor={COLORS.textLight}
          />
          {(!data.businessName || data.businessName.trim().length === 0) && (
            <Text style={s.errorText}>Business name is required</Text>
          )}
        </View>
      )}
    </View>
  )
}
