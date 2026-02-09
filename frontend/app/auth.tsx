import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../services/supabase";

export default function AuthTab(){
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "signUp") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else {
          setMessage("Sign-up successful. Check your email if verification is required.");
          // Note: You may need to wait for email verification before auto-redirecting
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          setMessage("Signed in successfully.");
          // Navigate to the tabs after successful sign-in
          router.replace("/(tabs)/home");
        }
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>{mode === "signIn" ? "Sign In" : "Create Account"}</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        placeholder="you@example.com"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={mode === "signIn" ? "password" : "password-new"}
        placeholder="password"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title={mode === "signIn" ? "Sign In" : "Create Account"} onPress={handleSubmit} />
      )}

      <TouchableOpacity
        onPress={() => {
          setMode(mode === "signIn" ? "signUp" : "signIn");
          setMessage(null);
        }}
        style={{ marginTop: 12 }}
      >
        <Text style={{ color: "blue" }}>
          {mode === "signIn" ? "Need an account? Create one" : "Have an account? Sign in"}
        </Text>
      </TouchableOpacity>

      {message ? <Text style={{ marginTop: 12 }}>{message}</Text> : null}
    </View>
  );
}