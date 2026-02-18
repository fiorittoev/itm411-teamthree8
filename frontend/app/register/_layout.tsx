import { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, Button } from "react-native"
import { Slot, usePathname, useRouter} from "expo-router"
import { RegisterProvider, useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"
import { globalStyles } from "../styles/globalStyles"

// Routes for each step in the registration flow, used for navigation and progress tracking
const steps = [
  "/register",
  "/register/location",
  "/register/display-name",
  "/register/about",
  "/register/interests",
  "/register/items",
  "/register/review",
  "/register/end"
] as const

// Main layout component that wraps the registration flow with context, needed for multi-step data persistence and validation across steps
export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <RegisterContent/>
    </RegisterProvider>
  )
}

function RegisterContent() {

  // Router and path info
  const pathname = usePathname()
  const router = useRouter()

  // Persisted data and validation state from context
  const { data, isStepValid } = useRegister()

  //States
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  // Determine current step index based on pathname, defaulting to 0 if not found (shouldn't happen in normal flow)
  const currentStep = useMemo(() => {
    const index = steps.findIndex((step) => step === pathname)
    return index === -1 ? 0 : index
  }, [pathname])
  const progress = (currentStep + 1) / steps.length

  async function handleSubmit() {
    // Adjust loading and message states
    setLoading(true)
    setMessage(null)

    // Attempt to create user, profile, and items in a single flow
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      
      if (authError) 
        return setMessage(authError.message)

      const user = authData.user
      if (!user) 
        return setMessage("User creation failed.")

      // Create community if it didn't already exist
      let communityId = data.communityId
      if (!communityId && data.community) {
        const { data: newCommunity, error: communityError } = await supabase
          .from("communities")
          .insert({ name: data.community })
          .select("id")
          .single()

        if (communityError) 
          return setMessage("Failed to create community: " + communityError.message)
        
        communityId = newCommunity.id
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: data.name,
          address: data.address,
          community: data.community,
          community_id: communityId,
          bio: data.bio,
        })

      if (profileError) 
        return setMessage(profileError.message)

      if (data.items?.length) {
        const { error: itemsError } = await supabase
          .from("items")
          .insert(
            data.items.map((item) => ({
              owner_id: user.id,
              name: item.name,
              description: item.description || null,
              category: item.category,
            }))
          )

        if (itemsError)
          return setMessage(itemsError.message)
      }

      router.replace("/(tabs)/home")
    } 
    catch (err: any) {
      setMessage(err?.message ?? "Unexpected error")
    } 
    finally {
      setLoading(false)
    }
  }

  async function handleNext() {

    if (!isStepValid) 
      return
    if (currentStep === steps.length - 1) {
      await handleSubmit()
      return
    }
    // Navigate to the next step in the registration flow
    router.push(steps[currentStep + 1])
  }

  return (
    <View style={globalStyles.container}>
      {currentStep !== 7 && (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text>Profile Setup</Text>

      <View style={globalStyles.slotContainer}>
        <Slot />
      </View>

      {message && <Text style={{ color: "red" }}>{message}</Text>}

      <View style={globalStyles.bottomContainer}>
        <Button
          title={currentStep === steps.length - 1 ? "Create Account" : "Next"}
          onPress={handleNext}
          disabled={!isStepValid || loading}
        />

        <View style={globalStyles.progressBarBackground}>
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "green",
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    </View>
  )
}
