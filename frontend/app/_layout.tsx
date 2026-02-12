import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { Provider as PaperProvider, Menu, Button } from 'react-native-paper';
import { supabase } from "../services/supabase";

import 'react-native-reanimated';

export default function RootLayout() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="options" options={{ headerShown: false }}/>
        {/* Header for tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: true, title: '', headerRight: () => (
              <View style={{ marginRight: 10 }}>
                <Menu
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  anchor={
                    <Button onPress={() => setVisible(true)}>
                      Account
                    </Button>
                  }>
                  <Menu.Item onPress={async () => {
                        setVisible(false);

                        const { error } = await supabase.auth.signOut();

                        if (error) {
                          console.log("Logout error:", error.message);
                          return;
                        }

                        // Clear navigation history and go to auth
                        router.replace("/options");
                      }}
                      title="Logout"
                    />

                  <Menu.Item onPress={() => {
                      setVisible(false);
                      router.push("/settings/account");
                    }}
                    title="Account Settings"
                  />
                </Menu>
              </View>
            ),
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </PaperProvider>
  );
}
