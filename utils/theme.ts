import type { ThemeTokens } from "@/types/theme";

export function getThemeSurfaceColor(theme: ThemeTokens) {
  return theme.id === "amoled" ? theme.colors.background : theme.colors.surface;
}
