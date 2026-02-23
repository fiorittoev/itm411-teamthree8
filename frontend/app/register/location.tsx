import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { useEffect, useState, useRef } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
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
  const [addressTaken, setAddressTaken] = useState(false)
  const [checkingAddress, setCheckingAddress] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const API_URL = process.env.EXPO_PUBLIC_API_URL

  const fullAddress = [
    address.street, address.apt, address.city,
    address.state && address.zipcode
      ? `${address.state} ${address.zipcode}`
      : address.state || address.zipcode,
    address.country,
  ].filter(Boolean).join(", ")

  useEffect(() => {
    setStepValid(addressConfirmed && !!data.community && !addressTaken && !checkingAddress)
  }, [addressConfirmed, data.community, addressTaken, checkingAddress])

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
      const res = await fetch(`${API_URL}/maps/autocomplete?input=${encodeURIComponent(input)}`)
      const json = await res.json()
      setSuggestions(json.predictions?.slice(0, 5) ?? [])
    } catch (err) {
      console.error("Autocomplete error:", err)
    }
  }

  async function checkAddressUniqueness(address: string) {
    setCheckingAddress(true)
    setAddressTaken(false)
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .ilike("address", `%${address}%`)
        .maybeSingle()

      setAddressTaken(!!existing)
    } catch (err) {
      console.error("Address check error:", err)
    } finally {
      setCheckingAddress(false)
    }
  }

  async function selectSuggestion(suggestion: Suggestion) {
    setSuggestions([])
    setInputText(suggestion.description)
    try {
      const res = await fetch(`${API_URL}/maps/place-details?place_id=${suggestion.place_id}`)
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

      const computedAddress = [
        parsed.street,
        parsed.city,
        parsed.state && parsed.zipcode
          ? `${parsed.state} ${parsed.zipcode}`
          : parsed.state || parsed.zipcode,
        parsed.country,
      ].filter(Boolean).join(", ")

      updateField("address", computedAddress)
      checkAddressUniqueness(computedAddress)

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
      const rawResults = (placesData.results || []).slice(0, 5)
      const lakeNames: string[] = rawResults.map((lake: any) => lake.name)

      if (!lakeNames.length) {
        setLakeOptions([])
        setSearched(true)
        return
      }

      const { data: existingCommunities } = await supabase
        .from("communities")
        .select("id, name")
        .in("name", lakeNames)

      const merged: LakeOption[] = rawResults.map((lake: any) => {
        const existing = existingCommunities?.find((c) => c.name === lake.name)
        return {
          name: lake.name,
          id: existing?.id ?? null,
        }
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
    updateField("community", lake.name)
    updateField("communityId", lake.id ?? undefined)
  }

  return (
    <ScrollView style={s.scrollContainer} keyboardShouldPersistTaps="handled">
      <Text style={s.titleMedium}>Your Address</Text>

      {/* Autocomplete Input */}
      <Text style={s.labelSmall}>Search your address *</Text>
      <View style={s.autocompleteContainer}>
        <TextInput
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Start typing your address..."
          style={[s.input, { marginBottom: 0 }]}
        />

        {suggestions.length > 0 && (
          <View style={s.suggestionsContainer}>
            {suggestions.map((suggestion, i) => (
              <TouchableOpacity
                key={suggestion.place_id}
                onPress={() => selectSuggestion(suggestion)}
                style={[
                  s.suggestionItem,
                  i < suggestions.length - 1 && s.suggestionItemBorder,
                ]}
              >
                <Text style={s.suggestionText}>{suggestion.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Apt field */}
      <Text style={[s.labelSmall, { marginTop: 10 }]}>Apt, Suite, Unit (optional)</Text>
      <TextInput
        value={address.apt}
        onChangeText={(v) => setAddress((prev) => ({ ...prev, apt: v }))}
        placeholder="Apt 4B"
        style={[s.input, s.inputWithMargin]}
      />

      {/* Confirmed address preview */}
      {addressConfirmed && (
        <View style={[
          s.addressPreview,
          addressTaken ? s.addressPreviewWarning : checkingAddress ? s.addressPreviewChecking : s.addressPreviewNormal,
        ]}>
          <View style={s.addressStatusRow}>
            {checkingAddress
              ? <ActivityIndicator size="small" color={COLORS.gray} />
              : <Text style={[
                  s.addressStatusText,
                  addressTaken && s.addressStatusTextWarning,
                ]}>
                  {addressTaken ? "⚠ Address already registered" : "Address on file"}
                </Text>
            }
          </View>
          <Text style={s.addressText}>{fullAddress}</Text>
          {addressTaken && (
            <Text style={s.addressWarningText}>
              An account is already associated with this address. If this is you, try signing in instead.
            </Text>
          )}
          <TouchableOpacity onPress={() => {
            setAddressConfirmed(false)
            setInputText("")
            setLakeOptions([])
            setSearched(false)
            setAddressTaken(false)
            setCheckingAddress(false)
            updateField("community", "")
            updateField("communityId", undefined)
          }}>
            <Text style={s.linkButton}>Change address</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Community Selector Block */}
      <View style={[
        s.communitySelector,
        !addressConfirmed ? s.communitySelectorDisabled
          : searched && lakeOptions.length === 0 ? s.communitySelectorWarning
          : s.communitySelectorActive,
      ]}>
        <View style={[
          s.communityHeader,
          !addressConfirmed ? s.communityHeaderDisabled : s.communityHeaderActive,
        ]}>
          <Text style={[
            s.communityHeaderTitle,
            !addressConfirmed ? s.communityHeaderTitleDisabled : s.communityHeaderTitleActive,
          ]}>
            Select Your Lake Community
          </Text>
          <Text style={[
            s.communityHeaderSubtitle,
            !addressConfirmed ? s.communityHeaderSubtitleDisabled : s.communityHeaderSubtitleActive,
          ]}>
            {!addressConfirmed
              ? "Select an address above to see nearby lakes"
              : "Choose the lake community closest to your home"}
          </Text>
        </View>

        <View style={s.communityContent}>
          {!addressConfirmed && (
            <View style={s.communityEmptyState}>
              <Text style={s.communityEmptyText}>
                Search and select your address to find nearby lakes
              </Text>
            </View>
          )}

          {addressConfirmed && loading && (
            <View style={s.communityLoadingState}>
              <ActivityIndicator color={COLORS.blue} />
              <Text style={s.communityLoadingText}>Finding nearby lakes...</Text>
            </View>
          )}

          {!loading && searched && lakeOptions.length === 0 && (
            <View style={s.communityErrorState}>
              <Text style={s.communityErrorTitle}>
                No lakes found near this address
              </Text>
              <Text style={s.communityErrorText}>
                Double-check your address or try a nearby ZIP code.
              </Text>
            </View>
          )}

          {!loading && lakeOptions.map((lake) => (
            <TouchableOpacity
              key={lake.name}
              onPress={() => selectCommunity(lake)}
              style={[
                s.communityOption,
                lake.name === data.community ? s.communityOptionSelected : s.communityOptionUnselected,
              ]}
            >
              <View>
                <Text style={[
                  s.communityOptionText,
                  lake.name === data.community && s.communityOptionTextSelected,
                ]}>
                  {lake.name}
                </Text>
                <Text style={[
                  s.communityOptionSubtext,
                  lake.name === data.community ? s.communityOptionSubtextSelected : s.communityOptionSubtext,
                  !lake.id && s.communityOptionSubtextNew,
                ]}>
                  {lake.id ? "Existing community" : "New — will be created"}
                </Text>
              </View>
              {lake.name === data.community
                ? <Text style={s.communityOptionCheck}>✓</Text>
                : !lake.id && <Text style={s.communityOptionSubtextNew}>+ New</Text>
              }
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}