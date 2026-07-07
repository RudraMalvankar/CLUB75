import type { ColorTokens, ThemeMode } from "@/types/theme";

const lightColors: ColorTokens = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E5E7EB",
  divider: "#E2E8F0",
  primary: "#4F46E5",
  primaryHover: "#4338CA",
  primaryPressed: "#3730A3",
  secondary: "#E2E8F0",
  accent: "#4F46E5",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textDisabled: "#94A3B8",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

const darkColors: ColorTokens = {
  background: "#09090B",
  surface: "#18181B",
  card: "#1E1E21",
  border: "#2A2A2E",
  divider: "#2A2A2E",
  primary: "#6366F1",
  primaryHover: "#818CF8",
  primaryPressed: "#4F46E5",
  secondary: "#27272A",
  accent: "#6366F1",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textDisabled: "#71717A",
  success: "#22C55E",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#60A5FA",
};

const amoledColors: ColorTokens = {
  background: "#000000",
  surface: "#050505",
  card: "#101010",
  border: "#1B1B1B",
  divider: "#1B1B1B",
  primary: "#818CF8",
  primaryHover: "#A5B4FC",
  primaryPressed: "#6366F1",
  secondary: "#111111",
  accent: "#818CF8",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textDisabled: "#666666",
  success: "#22C55E",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#60A5FA",
};

export const themeColors: Record<ThemeMode, ColorTokens> = {
  light: lightColors,
  dark: darkColors,
  amoled: amoledColors,
};
