import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Appearance, Platform, useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createThemeVariables, themes } from "@/constants/theme";
import { useAppFonts } from "@/hooks/useAppFonts";
import { syncSystemUi } from "@/utils/system-ui";
import type { ThemeContextValue, ThemeMode, ThemePreference } from "@/types/theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

SplashScreen.preventAutoHideAsync().catch(() => null);

function resolveTheme(
  preference: ThemePreference,
  systemTheme: ReturnType<typeof useColorScheme>,
): ThemeMode {
  if (preference !== "system") {
    return preference;
  }

  return systemTheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme();
  const { fontsLoaded, fontError } = useAppFonts();
  const [preference, setPreference] = useState<ThemePreference>("system");

  const resolvedTheme = resolveTheme(preference, systemTheme);
  const theme = themes[resolvedTheme];
  const themeVariables = useMemo(() => createThemeVariables(theme), [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      preference,
      setPreference,
    }),
    [preference, resolvedTheme, theme],
  );

  useEffect(() => {
    if (preference === "system") {
      return;
    }

    Appearance.setColorScheme(theme.isDark ? "dark" : "light");
  }, [preference, theme.isDark]);

  useEffect(() => {
    void syncSystemUi(theme);
  }, [theme]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => null);
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError && Platform.OS !== "web") {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      <SafeAreaProvider>
        <View className="flex-1 bg-background" style={themeVariables}>
          {children}
        </View>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
