import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { useEffect, useState } from "react"
import { useRegister } from "../context/RegisterContext"

const CATEGORIES = ["boat", "vehicle", "water_toy", "equipment", "other"]

const CATEGORY_LABELS: Record<string, string> = {
  boat: "Boat",
  vehicle: "Vehicle",
  water_toy: "Water Toy",
  equipment: "Equipment",
  other: "Other",
}

interface DraftItem {
  name: string
  description: string
  category: string
}

const emptyDraft = (): DraftItem => ({ name: "", description: "", category: "other" })

export default function ItemStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [draft, setDraft] = useState<DraftItem>(emptyDraft())
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setStepValid(true) 
  }, [])

  function addItem() {
    if (!draft.name.trim()) {
      setError("Item name is required.")
      return
    }
    const updated = [...(data.items ?? []), { ...draft, name: draft.name.trim() }]
    updateField("items", updated)
    setDraft(emptyDraft())
    setAdding(false)
    setError("")
  }

  function removeItem(index: number) {
    const updated = (data.items ?? []).filter((_, i) => i !== index)
    updateField("items", updated)
  }

  return (
    <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 6 }}>Your Items</Text>
      <Text style={{ color: "#666", marginBottom: 20 }}>
        Add items you own or have access to — boats, vehicles, water toys, or equipment.
        This helps neighbors connect, share, or buy and sell more easily.
      </Text>

      {/* Existing items */}
      {(data.items ?? []).map((item, i) => (
        <View key={i} style={{
          backgroundColor: "#f5f5f5", borderRadius: 10,
          padding: 14, marginBottom: 10,
          flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>{item.name}</Text>
              <View style={{
                backgroundColor: "#e3f2fd", borderRadius: 8,
                paddingHorizontal: 8, paddingVertical: 2,
              }}>
                <Text style={{ fontSize: 11, color: "#1976d2" }}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </Text>
              </View>
            </View>
            {!!item.description && (
              <Text style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{item.description}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => removeItem(i)} style={{ paddingLeft: 10 }}>
            <Text style={{ color: "#e53935", fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add form */}
      {adding ? (
        <View style={{
          borderWidth: 1.5, borderColor: "#1976d2", borderRadius: 12,
          padding: 16, marginBottom: 12,
        }}>
          <Text style={{ fontWeight: "600", fontSize: 15, marginBottom: 12 }}>New Item</Text>

          <Text style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>Name *</Text>
          <TextInput
            value={draft.name}
            onChangeText={(v) => { setDraft(d => ({ ...d, name: v })); setError("") }}
            placeholder="e.g. Pontoon Boat, Sea-Doo"
            style={{
              borderWidth: 1, borderColor: error ? "#e53935" : "#ddd",
              borderRadius: 8, padding: 10, marginBottom: 4, fontSize: 15,
            }}
          />
          {!!error && <Text style={{ color: "#e53935", fontSize: 12, marginBottom: 8 }}>{error}</Text>}

          <Text style={{ fontSize: 12, color: "#555", marginBottom: 4, marginTop: 4 }}>Description (optional)</Text>
          <TextInput
            value={draft.description}
            onChangeText={(v) => setDraft(d => ({ ...d, description: v }))}
            placeholder="Any details neighbors should know"
            multiline
            style={{
              borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
              padding: 10, marginBottom: 12, fontSize: 14,
              minHeight: 70, textAlignVertical: "top",
            }}
          />

          <Text style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>Category</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setDraft(d => ({ ...d, category: cat }))}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: draft.category === cat ? "#1976d2" : "#ddd",
                  backgroundColor: draft.category === cat ? "#e3f2fd" : "#fff",
                }}
              >
                <Text style={{
                  fontSize: 13,
                  color: draft.category === cat ? "#1976d2" : "#555",
                  fontWeight: draft.category === cat ? "600" : "400",
                }}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => { setAdding(false); setDraft(emptyDraft()); setError("") }}
              style={{
                flex: 1, padding: 12, borderRadius: 8,
                borderWidth: 1, borderColor: "#ddd", alignItems: "center",
              }}
            >
              <Text style={{ color: "#555" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addItem}
              style={{
                flex: 2, padding: 12, borderRadius: 8,
                backgroundColor: "#1976d2", alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setAdding(true)}
          style={{
            borderWidth: 1.5, borderColor: "#1976d2", borderStyle: "dashed",
            borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 12,
          }}
        >
          <Text style={{ color: "#1976d2", fontSize: 15, fontWeight: "600" }}>+ Add an Item</Text>
        </TouchableOpacity>
      )}

      {(data.items ?? []).length === 0 && !adding && (
        <Text style={{ color: "#aaa", fontSize: 13, textAlign: "center", marginTop: 8 }}>
          No items added yet — this step is optional.
        </Text>
      )}
    </ScrollView>
  )
}