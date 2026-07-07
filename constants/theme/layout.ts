import { Dimensions, PixelRatio } from "react-native";

import type { LayoutTokens } from "@/types/theme";

export const layout: LayoutTokens = {
  breakpoint: {
    smallPhone: 360,
    largePhone: 414,
    tablet: 768,
  },
  contentMaxWidth: {
    phone: 640,
    tablet: 920,
  },
  touchTargetMin: 48,
};

export function getResponsiveMetrics() {
  const { width, height } = Dimensions.get("window");
  const shortestSide = Math.min(width, height);

  return {
    width,
    height,
    shortestSide,
    fontScale: PixelRatio.getFontScale(),
    isSmallPhone: shortestSide <= layout.breakpoint.smallPhone,
    isLargePhone: shortestSide >= layout.breakpoint.largePhone,
    isTablet: shortestSide >= layout.breakpoint.tablet,
    contentWidth: Math.min(
      width - 40,
      shortestSide >= layout.breakpoint.tablet
        ? layout.contentMaxWidth.tablet
        : layout.contentMaxWidth.phone,
    ),
  };
}
