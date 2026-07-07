import { primitives } from "@/constants/theme/primitives";
import type { ElevationTokens } from "@/types/theme";

const shadowColor = "#000000";

export const elevation: ElevationTokens = {
  level1: {
    shadowColor,
    shadowOffset: { width: 0, height: primitives.elevation.level1.shadowOffsetY },
    shadowOpacity: primitives.elevation.level1.shadowOpacity,
    shadowRadius: primitives.elevation.level1.shadowRadius,
    elevation: primitives.elevation.level1.elevation,
  },
  level2: {
    shadowColor,
    shadowOffset: { width: 0, height: primitives.elevation.level2.shadowOffsetY },
    shadowOpacity: primitives.elevation.level2.shadowOpacity,
    shadowRadius: primitives.elevation.level2.shadowRadius,
    elevation: primitives.elevation.level2.elevation,
  },
  level3: {
    shadowColor,
    shadowOffset: { width: 0, height: primitives.elevation.level3.shadowOffsetY },
    shadowOpacity: primitives.elevation.level3.shadowOpacity,
    shadowRadius: primitives.elevation.level3.shadowRadius,
    elevation: primitives.elevation.level3.elevation,
  },
  level4: {
    shadowColor,
    shadowOffset: { width: 0, height: primitives.elevation.level4.shadowOffsetY },
    shadowOpacity: primitives.elevation.level4.shadowOpacity,
    shadowRadius: primitives.elevation.level4.shadowRadius,
    elevation: primitives.elevation.level4.elevation,
  },
};
