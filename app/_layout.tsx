import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { PartnersProvider } from "@/entities/partner/providers/partners-provider";

export default function RootLayout() {
  return (
    <PartnersProvider>
      <SafeAreaView style={styles.wrapper} edges={["left", "right", "bottom"]}>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </PartnersProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
