import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useEffect, useState } from "react"
import { useRegister } from "../context/RegisterContext"
import { globalStyles as gs } from "../styles/globalStyles"

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
    <ScrollView style={s.scrollContainer} keyboardShouldPersistTaps="handled">
      <Text style={s.titleMedium}>Your Items</Text>
      <Text style={[s.subtitle, { color: COLORS.mutedText, marginBottom: 20 }]}>
        Add items you own or have access to — boats, vehicles, water toys, or equipment.
        This helps neighbors connect, share, or buy and sell more easily.
      </Text>

      {/* Existing items */}
      {(data.items ?? []).map((item, i) => (
        <View key={i} style={s.itemCard}>
          <View style={s.itemCardContent}>
            <View style={s.itemCardHeader}>
              <Text style={s.itemCardName}>{item.name}</Text>
              <View style={s.itemCardCategory}>
                <Text style={s.itemCardCategoryText}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </Text>
              </View>
            </View>
            {!!item.description && (
              <Text style={s.itemCardDescription}>{item.description}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => removeItem(i)} style={s.itemCardDelete}>
            <Text style={s.itemCardDeleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add form */}
      {adding ? (
        <View style={s.itemForm}>
          <Text style={s.itemFormTitle}>New Item</Text>

          <Text style={s.labelMedium}>Name *</Text>
          <TextInput
            value={draft.name}
            onChangeText={(v) => { setDraft(d => ({ ...d, name: v })); setError("") }}
            placeholder="e.g. Pontoon Boat, Sea-Doo"
            style={[
              s.input,
              error && s.inputError,
              { marginBottom: 4 },
            ]}
          />
          {!!error && <Text style={[s.errorTextSmall, { marginBottom: 8 }]}>{error}</Text>}

          <Text style={s.labelMedium}>Description (optional)</Text>
          <TextInput
            value={draft.description}
            onChangeText={(v) => setDraft(d => ({ ...d, description: v }))}
            placeholder="Any details neighbors should know"
            multiline
            style={[
              s.input,
              s.textarea,
              { marginBottom: 12 },
            ]}
          />

          <Text style={[s.labelMedium, { marginBottom: 6 }]}>Category</Text>
          <View style={[gs.row, { flexWrap: "wrap", gap: 8, marginBottom: 16 }]}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setDraft(d => ({ ...d, category: cat }))}
                style={[
                  s.categoryChip,
                  draft.category === cat ? s.categoryChipSelected : s.categoryChipUnselected,
                ]}
              >
                <Text style={[
                  draft.category === cat ? s.categoryChipTextSelected : s.categoryChipText,
                ]}>
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.itemFormActions}>
            <TouchableOpacity
              onPress={() => { setAdding(false); setDraft(emptyDraft()); setError("") }}
              style={s.itemFormCancelButton}
            >
              <Text style={s.itemFormCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addItem}
              style={s.itemFormSubmitButton}
            >
              <Text style={s.itemFormSubmitButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setAdding(true)}
          style={s.itemFormAddButton}
        >
          <Text style={s.itemFormAddButtonText}>+ Add an Item</Text>
        </TouchableOpacity>
      )}

      {(data.items ?? []).length === 0 && !adding && (
        <Text style={s.emptyText}>
          No items added yet — this step is optional.
        </Text>
      )}
    </ScrollView>
  )
}