import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { Provider as PaperProvider, Menu, Button } from "react-native-paper";
import { supabase } from "../services/supabase";

import "react-native-reanimated";

export default function RootLayout() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="options" />
        <Stack.Screen name="register" />
        <Stack.Screen name="main" />
      </Stack>

      <StatusBar style="auto" />
    </PaperProvider>
  );
}