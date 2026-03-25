import { useState, useMemo } from "react"
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Slot, usePathname, useRouter} from "expo-router"
import { RegisterProvider, useRegister } from "../context/RegisterContext"
import { supabase } from "../../services/supabase"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator } from "react-native"
// Routes for each step in the registration flow, used for navigation and progress tracking
const steps = [
  "/register",
  "/register/account-type",
  "/register/location",
  "/register/display-name",
  "/register/profile-picture",
  "/register/about",
  "/register/interests",
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
          profile_image_url: data.profileImageUrl,
          is_business: data.accountType === 'business',
          business_name: data.accountType === 'business' ? data.businessName : null,
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
        {currentStep > 0 && currentStep !== steps.length - 1 && (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[s.titleLarge, { marginBottom: 0 }]}>Profile Setup</Text>
          <Text style={[s.labelSmall, { color: COLORS.textMuted }]}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>

      {message && (
        <View style={[s.card, { backgroundColor: COLORS.error + '10', borderColor: COLORS.error + '30', marginBottom: 16 }]}>
          <Text style={[s.errorText, { marginTop: 0 }]}>{message}</Text>
        </View>
      )}

      <View style={{ paddingBottom: 40, paddingTop: 10 }}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!isStepValid || loading}
          style={[
            s.primaryButton,
            (!isStepValid || loading) && { backgroundColor: COLORS.border, shadowOpacity: 0 }
          ]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={s.primaryButtonText}>
              {currentStep === steps.length - 1 ? "Create Account" : "Continue"}
            </Text>
          )}
        </TouchableOpacity>

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
