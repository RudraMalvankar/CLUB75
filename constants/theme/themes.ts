import { animation } from "@/constants/theme/animation";
import { themeColors } from "@/constants/theme/colors";
import { elevation } from "@/constants/theme/elevation";
import { layout } from "@/constants/theme/layout";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import { fontWeights, typography } from "@/constants/theme/typography";
import type { ThemeMode, ThemeTokens } from "@/types/theme";

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: {
    id: "light",
    isDark: false,
    statusBar: "dark",
    colors: themeColors.light,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
  },
  dark: {
    id: "dark",
    isDark: true,
    statusBar: "light",
    colors: themeColors.dark,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
  },
  amoled: {
    id: "amoled",
    isDark: true,
    statusBar: "light",
    colors: themeColors.amoled,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
  },
};
