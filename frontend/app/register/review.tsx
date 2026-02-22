import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useRegister } from "../context/RegisterContext"
import { useState } from "react"
import { RegisterData } from "../context/RegisterContext"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"

export default function ReviewStep() {
  const { data, updateField } = useRegister()
  const [editing, setEditing] = useState<keyof RegisterData | null>(null)

  return (
    <View style={s.reviewContainer}>
      <Text style={s.headerText}>
        Review and edit your profile before finishing
      </Text>

      <EditableRow label="Name" field="name" value={data.name} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Email" field="email" value={data.email} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Address" field="address" value={data.address} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Community" field="community" value={data.community} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Bio" field="bio" value={data.bio} editing={editing} setEditing={setEditing} updateField={updateField} multiline />

      {data.interests?.length > 0 && (
        <View style={s.reviewSection}>
          <Text style={s.reviewSectionTitle}>Interests</Text>
          <View style={s.reviewChipsContainer}>
            {data.interests.map((i: string) => (
              <View key={i} style={s.reviewChip}>
                <Text style={s.reviewChipText}>{i}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

        {(data.items ?? []).length > 0 && (
    <View style={s.reviewSection}>
      <Text style={[s.reviewSectionTitle, { marginBottom: 6 }]}>Items</Text>
      {data.items.map((item, i) => (
        <View key={i} style={s.reviewItemCard}>
          <Text style={s.reviewItemName}>{item.name}
            <Text style={{ fontWeight: "400", color: COLORS.gray }}> · {item.category}</Text>
          </Text>
          {!!item.description && (
            <Text style={s.reviewItemDescription}>{item.description}</Text>
          )}
        </View>
      ))}
    </View>
  )}
    </View>
  )
}

function EditableRow<K extends keyof RegisterData>({
  label,
  field,
  value,
  editing,
  setEditing,
  updateField,
  multiline = false,
}: {
  label: string
  field: K
  value: string
  editing: keyof RegisterData | null
  setEditing: (f: keyof RegisterData | null) => void
  updateField: <K extends keyof RegisterData>(field: K, value: RegisterData[K]) => void
  multiline?: boolean
}) {
  const isEditing = editing === field

  return (
    <View style={s.reviewRow}>
      <View style={s.reviewRowHeader}>
        <Text style={s.reviewRowLabel}>{label}</Text>
        <TouchableOpacity onPress={() => setEditing(isEditing ? null : field)}>
          <Text style={isEditing ? s.editButtonActive : s.editButton}>
            {isEditing ? "✕ Cancel" : "✏️ Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <TextInput
          value={value}
          onChangeText={(v) => updateField(field, v as RegisterData[K])}
          autoFocus
          multiline={multiline}
          style={[
            s.reviewEditInput,
            multiline && s.reviewEditInputMultiline,
          ]}
          onSubmitEditing={() => setEditing(null)}
        />
      ) : (
        <Text style={s.reviewRowValue}>{value || "—"}</Text>
      )}
    </View>
  )
}