import { PartnersProvider } from "@/entities/partner/providers/partners-provider";
import PartnersListScreen from "@/entities/partner/screens/partners-list-screen";
import { Stack } from "expo-router";

export default function index() {
  return (
    <PartnersProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
      </Stack>
    </PartnersProvider>
  );
}
