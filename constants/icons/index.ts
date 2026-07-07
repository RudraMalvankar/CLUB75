import type { LucideProps } from "lucide-react-native";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoonStar,
  Smartphone,
  SunMedium,
  Tablet,
  X,
} from "lucide-react-native";

import { useTheme } from "@/hooks/useTheme";

export {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoonStar,
  Smartphone,
  SunMedium,
  Tablet,
  X,
};

export function useIconProps(overrides: Partial<LucideProps> = {}): LucideProps {
  const { theme } = useTheme();

  return {
    color: theme.colors.textPrimary,
    size: theme.icons.size.lg,
    strokeWidth: theme.icons.strokeWidth,
    ...overrides,
  };
}
