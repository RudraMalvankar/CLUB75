import { primitives } from "@/constants/theme/primitives";
import type { FontFamilyTokens, FontWeightTokens, TypographyScale } from "@/types/theme";

export const fontFamilies: FontFamilyTokens = {
  preferred: primitives.preferredFontFamily,
  sans: primitives.fallbackFontFamily,
};

export const fontWeights: FontWeightTokens = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
};

type PrimitiveFontScaleValue = {
  fontSize: number;
  lineHeight: number;
  fontWeight: keyof FontWeightTokens;
  letterSpacing?: number;
};

export const typography = Object.fromEntries(
  (Object.entries(primitives.fontScale) as [keyof TypographyScale, PrimitiveFontScaleValue][]).map(
    ([key, value]) => [
      key,
      {
        fontFamily: fontFamilies.sans,
        fontSize: value.fontSize,
        lineHeight: value.lineHeight,
        fontWeight: fontWeights[value.fontWeight],
        ...(value.letterSpacing ? { letterSpacing: value.letterSpacing } : {}),
      },
    ],
  ),
) as TypographyScale;
