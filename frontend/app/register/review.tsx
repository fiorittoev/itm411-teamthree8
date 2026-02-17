import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useRegister } from "../context/RegisterContext"
import { useState } from "react"
import { RegisterData } from "../context/RegisterContext" // export this from your context

export default function ReviewStep() {
  const { data, updateField } = useRegister()
  const [editing, setEditing] = useState<keyof RegisterData | null>(null)

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
        Review and edit your profile before finishing
      </Text>

      <EditableRow label="Name" field="name" value={data.name} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Email" field="email" value={data.email} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Address" field="address" value={data.address} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Community" field="community" value={data.community} editing={editing} setEditing={setEditing} updateField={updateField} />
      <EditableRow label="Bio" field="bio" value={data.bio} editing={editing} setEditing={setEditing} updateField={updateField} multiline />

      {data.interests?.length > 0 && (
        <View>
          <Text style={{ fontWeight: "600", marginBottom: 4 }}>Interests</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {data.interests.map((i: string) => (
              <View key={i} style={{
                backgroundColor: "#e8f5e9",
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}>
                <Text style={{ color: "#2e7d32" }}>{i}</Text>
              </View>
            ))}
          </View>
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
    <View style={{ borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: "#999" }}>{label}</Text>
        <TouchableOpacity onPress={() => setEditing(isEditing ? null : field)}>
          <Text style={{ fontSize: 13, color: isEditing ? "#e53935" : "#1976d2" }}>
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
          style={{
            borderWidth: 1,
            borderColor: "#1976d2",
            borderRadius: 6,
            padding: 8,
            marginTop: 6,
            fontSize: 15,
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? "top" : undefined,
          }}
          onSubmitEditing={() => setEditing(null)}
        />
      ) : (
        <Text style={{ fontSize: 15, marginTop: 2 }}>{value || "—"}</Text>
      )}
    </View>
  )
}