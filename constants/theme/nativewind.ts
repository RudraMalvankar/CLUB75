import { vars } from "nativewind";

import type { ThemeTokens } from "@/types/theme";

const variableKeys = {
  background: "--color-background",
  surface: "--color-surface",
  card: "--color-card",
  border: "--color-border",
  divider: "--color-divider",
  primary: "--color-primary",
  primaryHover: "--color-primary-hover",
  primaryPressed: "--color-primary-pressed",
  secondary: "--color-secondary",
  accent: "--color-accent",
  textPrimary: "--color-text-primary",
  textSecondary: "--color-text-secondary",
  textDisabled: "--color-text-disabled",
  success: "--color-success",
  warning: "--color-warning",
  danger: "--color-danger",
  info: "--color-info",
} as const;

export function createThemeVariables(theme: ThemeTokens) {
  const colorEntries = Object.entries(variableKeys) as [
    keyof ThemeTokens["colors"],
    (typeof variableKeys)[keyof typeof variableKeys],
  ][];

  return vars(
    Object.fromEntries(
      colorEntries.map(([token, cssVariable]) => [cssVariable, theme.colors[token]]),
    ),
  );
}
