import { animation } from "@/constants/theme/animation";
import { themeColors } from "@/constants/theme/colors";
import { elevation } from "@/constants/theme/elevation";
import { layout } from "@/constants/theme/layout";
import { primitives } from "@/constants/theme/primitives";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";
import { fontFamilies, fontWeights, typography } from "@/constants/theme/typography";
import type { ThemeMode, ThemeTokens } from "@/types/theme";

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: {
    id: "light",
    isDark: false,
    statusBar: "dark",
    colors: themeColors.light,
    fontFamilies,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
    icons: primitives.icons,
  },
  dark: {
    id: "dark",
    isDark: true,
    statusBar: "light",
    colors: themeColors.dark,
    fontFamilies,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
    icons: primitives.icons,
  },
  amoled: {
    id: "amoled",
    isDark: true,
    statusBar: "light",
    colors: themeColors.amoled,
    fontFamilies,
    typography,
    fontWeights,
    spacing,
    radius,
    elevation,
    animation,
    layout,
    icons: primitives.icons,
  },
};
