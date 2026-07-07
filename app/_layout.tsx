import "@/global.css";
import "react-native-gesture-handler";

import { NavigationBar } from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "@/components/providers/AppProvider";
import { useTheme } from "@/hooks/useTheme";
import { useInitializationContext } from "@/components/providers/InitializationProvider";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { ErrorScreen } from "@/components/layout/ErrorScreen";

function RootNavigator() {
  const { theme } = useTheme();
  const { isReady, error } = useInitializationContext();

  if (error) {
    return <ErrorScreen />;
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style={theme.statusBar} />
      <NavigationBar hidden={false} style={theme.isDark ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(splash)" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="(onboarding)" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="(modals)/settings-modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/subject-modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="+error" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
