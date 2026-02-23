import { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, Button } from "react-native"
import { Slot, usePathname, useRouter} from "expo-router"
import { RegisterProvider, useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
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
    setLoading(true)
    setMessage(null)

    try {
      // Register everything through backend
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          username: data.name,
          address: data.address,
          community: data.community,
          bio: data.bio,
          items: data.items ?? [],
        }),
      }).then(async res => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail ?? 'Registration failed')
        }
      })

      // Sign in after successful registration
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw new Error(error.message)

      router.replace('/main')
    } catch (err: any) {
      setMessage(err?.message ?? 'Unexpected error')
    } finally {
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
    <View style={s.container}>
      {currentStep !== 7 && (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backButton}>← Back</Text>
        </TouchableOpacity>
      )}

      <Text style={s.titleLarge}>Profile Setup</Text>

      <View style={s.section}>
        <Slot />
      </View>

      {message && <Text style={s.errorText}>{message}</Text>}

      <View style={s.section}>
        <Button
          title={currentStep === steps.length - 1 ? "Create Account" : "Next"}
          onPress={handleNext}
          disabled={!isStepValid || loading}
        />

        <View style={s.progressBackground}>
          <View
            style={[
              s.progressFillDynamic,
              { width: `${progress * 100}%` }
            ]}
          />
        </View>
      </View>
    </View>
  )
}
