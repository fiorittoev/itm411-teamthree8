import { createContext, useContext, useState, ReactNode } from "react"

export type RegisterData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  address: string
  community: string       // selected community name
  communityId?: string    // optional: selected community ID from backend
  bio: string
  interests: string[]
  profileImageUrl?: string
}

type RegisterContextType = {
  data: RegisterData
  updateField: <K extends keyof RegisterData>(field: K, value: RegisterData[K]) => void
  addInterest: (interest: string) => void
  removeInterest: (interest: string) => void
  isStepValid: boolean
  setStepValid: (valid: boolean) => void
}

const RegisterContext = createContext<RegisterContextType | undefined>(undefined)

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    community: "",
    bio: "",
    interests: [],
    profileImageUrl: undefined,
    communityId: undefined,
  })

  const [isStepValid, setStepValid] = useState(false)

  function updateField<K extends keyof RegisterData>(field: K, value: RegisterData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function addInterest(interest: string) {
    setData((prev) => {
      if (!prev.interests.includes(interest)) {
        return { ...prev, interests: [...prev.interests, interest] }
      }
      return prev
    })
  }

  function removeInterest(interest: string) {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  return (
    <RegisterContext.Provider
      value={{
        data,
        updateField,
        addInterest,
        removeInterest,
        isStepValid,
        setStepValid,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

export function useRegister() {
  const context = useContext(RegisterContext)
  if (!context) {
    throw new Error("useRegister must be used inside RegisterProvider")
  }
  return context
}
