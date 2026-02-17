import { View, Text, TouchableOpacity } from "react-native"
import { Slot, usePathname, useRouter,Stack } from "expo-router"
import { StyleSheet, Button} from "react-native"
import { RegisterProvider, useRegister } from "../context/RegisterContext"
import { globalStyles } from "../styles/globalStyles"
import { supabase } from "../../services/supabase"
import { useState, useMemo } from "react"

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

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <RegisterContent/>
    </RegisterProvider>
  )
}
function RegisterContent() {
  const { data, isStepValid } = useRegister()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  const pathname = usePathname()
  const router = useRouter()

  const currentStep = useMemo(() => {
    const index = steps.findIndex((step) => step === pathname)
    return index === -1 ? 0 : index
  }, [pathname])

  const progress = (currentStep + 1) / steps.length

  async function handleSubmit() {
    setLoading(true)
    setMessage(null)
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
      if (authError) return setMessage(authError.message)

      const user = authData.user
      if (!user) return setMessage("User creation failed.")

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: data.name,
          address: data.address,
          community: data.community,
          bio: data.bio,
        })

      if (profileError) return setMessage(profileError.message)

      router.replace("/(tabs)/home")
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  async function handleNext() {
    if (!isStepValid) return
    if (currentStep === steps.length - 1) {
      await handleSubmit()
      return
    }
    router.push(steps[currentStep + 1])
  }

  return (
    <View style={globalStyles.container}>
      {currentStep > 0 && (
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
