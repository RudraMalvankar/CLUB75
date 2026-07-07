import type { AnimationTokens } from "@/types/theme";

export const animation: AnimationTokens = {
  duration: {
    fast: 200,
    normal: 260,
    slow: 320,
  },
  easing: {
    standard: [0.2, 0, 0, 1],
    emphasized: [0.2, 0.8, 0.2, 1],
  },
};
