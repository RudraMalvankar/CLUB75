import { primitives } from "@/constants/theme/primitives";
import type { AnimationTokens } from "@/types/theme";

export const animation: AnimationTokens = {
  duration: primitives.animation.duration,
  easing: {
    standard: primitives.animation.easing.standard as [number, number, number, number],
    emphasized: primitives.animation.easing.emphasized as [number, number, number, number],
  },
};
