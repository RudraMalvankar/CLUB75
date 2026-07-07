import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { Platform } from "react-native";

import type { ThemeTokens } from "@/types/theme";

export async function syncSystemUi(theme: ThemeTokens) {
  await SystemUI.setBackgroundColorAsync(theme.colors.background);

  if (Platform.OS === "android") {
    NavigationBar.setStyle(theme.isDark ? "dark" : "light");
  }
}
