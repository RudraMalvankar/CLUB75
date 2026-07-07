import type { FontWeightTokens, TypographyScale } from "@/types/theme";

const fontFamily = "System";

export const fontWeights: FontWeightTokens = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
};

export const typography: TypographyScale = {
  displayXL: {
    fontFamily,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: fontWeights.extraBold,
  },
  displayL: {
    fontFamily,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: fontWeights.bold,
  },
  displayM: {
    fontFamily,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: fontWeights.bold,
  },
  headingXL: {
    fontFamily,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: fontWeights.bold,
  },
  headingL: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: fontWeights.semiBold,
  },
  headingM: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: fontWeights.semiBold,
  },
  title: {
    fontFamily,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: fontWeights.medium,
  },
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: fontWeights.regular,
  },
  body: {
    fontFamily,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
  },
  micro: {
    fontFamily,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
};
