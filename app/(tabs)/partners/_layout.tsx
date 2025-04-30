import { Stack } from "expo-router";

export default function index() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]/checkout"
        options={{
          title: "Оформление заказа",
        }}
      />
    </Stack>
  );
}
