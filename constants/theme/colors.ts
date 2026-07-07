import { primitives } from "@/constants/theme/primitives";
import type { ColorTokens, ThemeMode } from "@/types/theme";

export const themeColors: Record<ThemeMode, ColorTokens> = {
  light: primitives.colors.light,
  dark: primitives.colors.dark,
  amoled: primitives.colors.amoled,
};
