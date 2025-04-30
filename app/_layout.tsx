import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { PartnersProvider } from "@/entities/partner/providers/partners-provider";
import { useEffect } from "react";

function InnerLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper} edges={["left", "right", "bottom"]}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PartnersProvider>
        <InnerLayout />
      </PartnersProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
