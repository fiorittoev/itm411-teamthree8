import { View, Text } from "react-native"
import { Slot, usePathname, useRouter } from "expo-router"
import { useMemo } from "react"
import { StyleSheet, Button } from "react-native"

const steps = [
  "/register",
  "/register/location",
  "/register/display-name",
  "/register/about",
  "/register/interests",
] as const

export default function RegisterLayout() {
  const pathname = usePathname()
  const router = useRouter()

  const currentStep = useMemo(() => {
    return steps.findIndex((step) => step === pathname)
  }, [pathname])

  const progress = (currentStep + 1) / steps.length

  function handleNext() {
    if (currentStep < steps.length - 1) {
      router.push(steps[currentStep + 1])
    } 
    else {
      router.replace("/home") // Navigate to home after the last step
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <Text>Profile Setup</Text>
      {/* Step Content */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottom_view}>
        <Button title="Next" onPress={handleNext} />

        <View style={styles.view}>
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

const styles = StyleSheet.create({
    view:{
        height: 6,
        backgroundColor: "#ccc",
        marginTop: 10,
        borderRadius: 4,
    },
    bottom_view:{
        padding: 20 
    }
});