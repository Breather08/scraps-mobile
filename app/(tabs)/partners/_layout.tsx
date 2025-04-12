import { PartnersProvider } from "@/entities/partner/providers/partners-provider";
import { Stack } from "expo-router";

export default function index() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/checkout"
        options={{
          title: "Checkout",
        }}
      />
    </Stack>
  );
}
