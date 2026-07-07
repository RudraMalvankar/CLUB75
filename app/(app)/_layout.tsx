import { Redirect, Stack } from "expo-router";

import { ROUTES } from "@/constants/routes";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Redirect href={ROUTES.TABS} />
    </Stack>
  );
}
