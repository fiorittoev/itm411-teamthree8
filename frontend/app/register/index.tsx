import { View, Text, TouchableOpacity, TextInput } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import { useRouter } from "expo-router"
import { useState } from "react";

export default function EmailStep() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter()

    return (
    <View>
        <Text>Register</Text>
        <Text>Create an account by filling in the information below</Text>

        <Text>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                style={globalStyles.field}
              />
        
        <Text>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="password"
                style={globalStyles.field}
              />

        <Text>Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="confirm password"
                style={globalStyles.field}
              />

        <TouchableOpacity
                style={globalStyles.button}
                onPress={() => router.push("/register")}
        >
                <Text style={globalStyles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text>Already have an account?</Text>
        <Text onPress={() => {router.replace("/login") }}>
            Login Here
        </Text>
        <Text>Or sign up with</Text>
        
    </View>
    )
}
