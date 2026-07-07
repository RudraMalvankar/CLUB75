import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { themes } from "@/constants/theme";
import type { ThemeContextValue, ThemeMode, ThemePreference } from "@/types/theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

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
  const [preference, setPreference] = useState<ThemePreference>("system");

  const resolvedTheme = resolveTheme(preference, systemTheme);
  const theme = themes[resolvedTheme];

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      preference,
      setPreference,
    }),
    [preference, resolvedTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
