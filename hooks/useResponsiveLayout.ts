import { useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { layout, spacing } from "@/constants/theme";

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const shortestSide = Math.min(width, height);
    const orientation = width > height ? "landscape" : "portrait";

    return {
      width,
      height,
      shortestSide,
      orientation,
      fontScale: PixelRatio.getFontScale(),
      insets,
      isPhone: shortestSide < layout.breakpoint.tablet,
      isLargePhone: shortestSide >= layout.breakpoint.largePhone,
      isTablet: shortestSide >= layout.breakpoint.tablet,
      isPortrait: orientation === "portrait",
      isLandscape: orientation === "landscape",
      contentWidth: Math.min(
        width - spacing.screenPadding * 2,
        shortestSide >= layout.breakpoint.tablet
          ? layout.contentMaxWidth.tablet
          : layout.contentMaxWidth.phone,
      ),
      spacing,
      touchTargetMin: layout.touchTargetMin,
      withSafeAreaPadding: {
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
      },
    };
  }, [height, insets, width]);
}
