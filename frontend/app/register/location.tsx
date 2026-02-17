import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from "react-native"
import { useEffect, useState, useRef } from "react"
import { globalStyles } from "../styles/globalStyles"
import { useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"

interface AddressComponents {
  street: string
  apt: string
  city: string
  state: string
  zipcode: string
  country: string
}

interface LakeOption {
  name: string
  id: string | null
}

interface Suggestion {
  place_id: string
  description: string
}

export default function LocationStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [lakeOptions, setLakeOptions] = useState<LakeOption[]>([])
  const [address, setAddress] = useState<AddressComponents>({
    street: "", apt: "", city: "", state: "", zipcode: "", country: "US",
  })
  const [inputText, setInputText] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const API_URL = process.env.EXPO_PUBLIC_API_URL

  const fullAddress = [
    address.street, address.apt, address.city,
    address.state && address.zipcode ? `${address.state} ${address.zipcode}` : address.state || address.zipcode,
    address.country,
  ].filter(Boolean).join(", ")

  useEffect(() => {
    setStepValid(addressConfirmed && !!data.community)
  }, [addressConfirmed, data.community])

  // Debounced autocomplete fetch
  function handleInputChange(text: string) {
    setInputText(text)
    setAddressConfirmed(false)
    setSuggestions([])

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (text.length < 3) return

    debounceRef.current = setTimeout(() => fetchSuggestions(text), 400)
  }

  async function fetchSuggestions(input: string) {
    try {
      const res = await fetch(
      `${API_URL}/maps/autocomplete?input=${encodeURIComponent(input)}`
    )
      const json = await res.json()
      setSuggestions(json.predictions?.slice(0, 5) ?? [])
    } catch (err) {
      console.error("Autocomplete error:", err)
    }
  }

  async function selectSuggestion(suggestion: Suggestion) {
    setSuggestions([])
    setInputText(suggestion.description)

    try {
      // Fetch full place details to get address components
    const res = await fetch(
      `${API_URL}/maps/place-details?place_id=${suggestion.place_id}`
    )
      const json = await res.json()
      const components = json.result?.address_components ?? []

      const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name ?? ""
      const getShort = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.short_name ?? ""

      const parsed: AddressComponents = {
        street: `${get("street_number")} ${get("route")}`.trim(),
        apt: "",
        city: get("locality") || get("sublocality") || get("neighborhood"),
        state: getShort("administrative_area_level_1"),
        zipcode: get("postal_code"),
        country: getShort("country"),
      }

      setAddress(parsed)
      setAddressConfirmed(true)
      updateField("address", fullAddress)

      // Kick off lake search with coords from place details
      const { lat, lng } = json.result.geometry.location
      findNearbyLakes(lat, lng)
    } catch (err) {
      console.error("Place details error:", err)
    }
  }

  async function findNearbyLakes(lat: number, lng: number) {
    setLoading(true)
    setSearched(false)
    try {
      const placesRes = await fetch(`${API_URL}/maps/nearby-lakes?lat=${lat}&lng=${lng}`)
      const placesData = await placesRes.json()
      const lakeNames: string[] = (placesData.results || [])
        .slice(0, 5)
        .map((lake: any) => lake.name)

      if (!lakeNames.length) {
        setLakeOptions([])
        setSearched(true)
        return
      }

      const { data: existingCommunities } = await supabase
        .from("communities")
        .select("id, name")
        .in("name", lakeNames)

      const merged: LakeOption[] = lakeNames.map((name) => {
        const existing = existingCommunities?.find((c) => c.name === name)
        return { name, id: existing?.id ?? null }
      })

      setLakeOptions(merged)
    } catch (err) {
      console.error("Error finding lakes:", err)
      setLakeOptions([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  async function selectCommunity(lake: LakeOption) {
  let communityId = lake.id

  if (!communityId) {
    const { data: newCommunity, error } = await supabase
      .from("communities")
      .insert({ name: lake.name })
      .select("id")
      .single()

    if (error) {
      console.error("Failed to create community:", error.message)
      return
    }
    communityId = newCommunity.id
    setLakeOptions((prev) =>
      prev.map((l) => l.name === lake.name ? { ...l, id: communityId } : l)
    )
  }

  updateField("community", lake.name)
  updateField("communityId", communityId ?? undefined)  // convert null → undefined
}

  const labelStyle = { fontSize: 13, color: "#555", marginBottom: 3 }
  const fieldStyle = [globalStyles.field, { marginBottom: 10 }]

  return (
    <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 16 }}>Your Address</Text>

      {/* Autocomplete Input */}
      <Text style={labelStyle}>Search your address *</Text>
      <View style={{ position: "relative", zIndex: 10 }}>
        <TextInput
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Start typing your address..."
          style={[fieldStyle, { marginBottom: 0 }]}
        />

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <View style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            backgroundColor: "white", borderRadius: 8, zIndex: 20,
            borderWidth: 1, borderColor: "#e0e0e0",
            shadowColor: "#000", shadowOpacity: 0.1,
            shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
            elevation: 5,
          }}>
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={s.place_id}
                onPress={() => selectSuggestion(s)}
                style={{
                  padding: 12,
                  borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <Text style={{ fontSize: 14, color: "#333" }}>{s.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Apt field — always visible */}
      <Text style={[labelStyle, { marginTop: 10 }]}>Apt, Suite, Unit (optional)</Text>
      <TextInput
        value={address.apt}
        onChangeText={(v) => setAddress((prev) => ({ ...prev, apt: v }))}
        placeholder="Apt 4B"
        style={fieldStyle}
      />

      {/* Confirmed address preview */}
      {addressConfirmed && (
        <View style={{
          marginTop: 4, marginBottom: 20, padding: 14,
          backgroundColor: "#f8f9fa", borderRadius: 10,
          borderLeftWidth: 4, borderLeftColor: "#1976d2",
        }}>
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Address on file</Text>
          <Text style={{ fontSize: 15, color: "#222", fontWeight: "500" }}>{fullAddress}</Text>
          <TouchableOpacity onPress={() => {
            setAddressConfirmed(false)
            setInputText("")
            setLakeOptions([])
            setSearched(false)
          }}>
            <Text style={{ color: "#1976d2", fontSize: 13, marginTop: 6 }}>Change address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Community Selector Block */}
      <View style={{
        borderRadius: 12, borderWidth: 1.5, overflow: "hidden",
        borderColor: !addressConfirmed ? "#e0e0e0"
          : searched && lakeOptions.length === 0 ? "#e65100"
          : "#1976d2",
      }}>
        <View style={{
          padding: 14,
          backgroundColor: !addressConfirmed ? "#f5f5f5" : "#e3f2fd",
        }}>
          <Text style={{ fontSize: 15, fontWeight: "600", color: !addressConfirmed ? "#aaa" : "#1976d2" }}>
            Select Your Lake Community
          </Text>
          <Text style={{ fontSize: 12, marginTop: 2, color: !addressConfirmed ? "#bbb" : "#555" }}>
            {!addressConfirmed
              ? "Select an address above to see nearby lakes"
              : "Choose the lake community closest to your home"}
          </Text>
        </View>

        <View style={{ padding: 14 }}>
          {!addressConfirmed && (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ color: "#bbb", fontSize: 14, textAlign: "center" }}>
                Search and select your address to find nearby lakes
              </Text>
            </View>
          )}

          {addressConfirmed && loading && (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <ActivityIndicator color="#1976d2" />
              <Text style={{ color: "#999", fontSize: 13, marginTop: 8 }}>Finding nearby lakes...</Text>
            </View>
          )}

          {!loading && searched && lakeOptions.length === 0 && (
            <View style={{ alignItems: "center", paddingVertical: 16 }}>
              <Text style={{ color: "#e65100", fontWeight: "600", marginBottom: 4, textAlign: "center" }}>
                No lakes found near this address
              </Text>
              <Text style={{ color: "#bf360c", fontSize: 13, textAlign: "center" }}>
                Double-check your address or try a nearby ZIP code.
              </Text>
            </View>
          )}

          {!loading && lakeOptions.map((lake) => (
            <TouchableOpacity
              key={lake.name}
              onPress={() => selectCommunity(lake)}
              style={{
                padding: 12, marginVertical: 4, borderRadius: 8,
                backgroundColor: lake.name === data.community ? "#1976d2" : "#f5f5f5",
                borderWidth: 1.5,
                borderColor: lake.name === data.community ? "#1976d2" : "#e0e0e0",
                flexDirection: "row", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <View>
                <Text style={{
                  fontSize: 15,
                  color: lake.name === data.community ? "white" : "#333",
                  fontWeight: lake.name === data.community ? "600" : "400",
                }}>
                  {lake.name}
                </Text>
                <Text style={{
                  fontSize: 11, marginTop: 1,
                  color: lake.name === data.community ? "rgba(255,255,255,0.7)" : "#aaa",
                  fontStyle: lake.id ? "normal" : "italic",
                }}>
                  {lake.id ? "Existing community" : "New — will be created"}
                </Text>
              </View>
              {lake.name === data.community
                ? <Text style={{ color: "white", fontSize: 16 }}>✓</Text>
                : !lake.id && <Text style={{ fontSize: 11, color: "#1976d2" }}>+ New</Text>
              }
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}