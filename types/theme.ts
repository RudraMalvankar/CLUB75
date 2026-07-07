import type { TextStyle, ViewStyle } from "react-native";

export type ThemeMode = "light" | "dark" | "amoled";
export type ThemePreference = ThemeMode | "system";
export type StatusBarTone = "light" | "dark";

export type ColorTokens = {
  background: string;
  surface: string;
  card: string;
  border: string;
  divider: string;
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
};

export type TypographyScale = {
  displayXL: TextStyle;
  displayL: TextStyle;
  displayM: TextStyle;
  headingXL: TextStyle;
  headingL: TextStyle;
  headingM: TextStyle;
  title: TextStyle;
  bodyLarge: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  micro: TextStyle;
};

export type FontFamilyTokens = {
  preferred: string;
  sans: string;
};

export type FontWeightTokens = {
  light: TextStyle["fontWeight"];
  regular: TextStyle["fontWeight"];
  medium: TextStyle["fontWeight"];
  semiBold: TextStyle["fontWeight"];
  bold: TextStyle["fontWeight"];
  extraBold: TextStyle["fontWeight"];
};

export type SpacingTokens = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  "4xl": number;
  "5xl": number;
  "6xl": number;
  "7xl": number;
  screenPadding: number;
  cardPadding: number;
  cardGap: number;
  sectionGap: number;
};

export type RadiusTokens = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
};

export type ElevationTokens = {
  level1: ViewStyle;
  level2: ViewStyle;
  level3: ViewStyle;
  level4: ViewStyle;
};

export type AnimationTokens = {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: [number, number, number, number];
    emphasized: [number, number, number, number];
  };
};

export type LayoutTokens = {
  breakpoint: {
    smallPhone: number;
    largePhone: number;
    tablet: number;
  };
  contentMaxWidth: {
    phone: number;
    tablet: number;
  };
  touchTargetMin: number;
};

export type IconTokens = {
  strokeWidth: number;
  size: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

export type ThemeTokens = {
  id: ThemeMode;
  isDark: boolean;
  statusBar: StatusBarTone;
  colors: ColorTokens;
  fontFamilies: FontFamilyTokens;
  typography: TypographyScale;
  fontWeights: FontWeightTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  elevation: ElevationTokens;
  animation: AnimationTokens;
  layout: LayoutTokens;
  icons: IconTokens;
};

export type ThemeContextValue = {
  theme: ThemeTokens;
  resolvedTheme: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};
