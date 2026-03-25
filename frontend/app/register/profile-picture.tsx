import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { useEffect, useState } from "react"
import { registerStyles as s, COLORS } from "../styles/register/registerStyles"
import { useRegister } from "../context/RegisterContext"
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'

export default function ProfilePictureStep() {
  const { data, updateField, setStepValid } = useRegister()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Always valid, picture is optional but encouraged
    setStepValid(true)
  }, [])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    })

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0]
      const base64Image = `data:image/jpeg;base64,${asset.base64}`
      updateField("profileImageUrl", base64Image)
    }
  }

  const removeImage = () => {
    updateField("profileImageUrl", undefined)
  }

  return (
    <View style={s.stepContainer}>
      <Text style={s.titleLarge}>Profile Picture</Text>
      <Text style={s.subtitle}>
        Add a photo so your neighbors can recognize you. You can always change this later.
      </Text>

      <View style={profileStyles.centerContainer}>
        <TouchableOpacity 
          onPress={pickImage} 
          style={[
            profileStyles.imageContainer,
            { shadowColor: COLORS.primary, shadowOpacity: 0.1, shadowRadius: 15, elevation: 5 }
          ]}
          activeOpacity={0.9}
        >
          {data.profileImageUrl ? (
            <Image source={{ uri: data.profileImageUrl }} style={profileStyles.image} />
          ) : (
            <View style={profileStyles.placeholder}>
              <Ionicons name="camera-outline" size={60} color={COLORS.primary} />
              <Text style={profileStyles.placeholderText}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        {data.profileImageUrl ? (
          <TouchableOpacity onPress={removeImage} style={s.secondaryButton}>
            <Text style={s.secondaryButtonText}>Remove Photo</Text>
          </TouchableOpacity>
        ) : (
          <View style={[s.card, { backgroundColor: COLORS.lightBlue, borderColor: COLORS.primary + '20' }]}>
            <Text style={[s.bodyText, { fontSize: 13, color: COLORS.primary, textAlign: 'center' }]}>
              💡 A friendly photo helps build trust in the community!
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const profileStyles = {
  centerContainer: {
    alignItems: 'center' as const,
    marginTop: 30,
    gap: 32,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden' as const,
    backgroundColor: COLORS.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  image: {
    width: 200,
    height: 200,
  },
  placeholder: {
    alignItems: 'center' as const,
  },
  placeholderText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
}
