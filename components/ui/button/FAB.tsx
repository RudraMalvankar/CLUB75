import { Pressable, ActivityIndicator, type PressableProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type FABVariant = "primary" | "secondary" | "danger";
type FABSize = "md" | "lg";

type FABProps = PressableProps & {
  readonly variant?: FABVariant;
  readonly size?: FABSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly children: React.ReactNode;
  readonly accessibilityLabel: string;
};

export function FAB({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  children,
  accessibilityLabel,
  ...rest
}: FABProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles: Record<FABVariant, { backgroundColor: string }> = {
    primary: { backgroundColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.secondary },
    danger: { backgroundColor: theme.colors.danger },
  };

  const sizeStyles: Record<FABSize, { width: number; height: number; borderRadius: number }> = {
    md: { width: 56, height: 56, borderRadius: theme.radius.lg },
    lg: { width: 64, height: 64, borderRadius: theme.radius.xl },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          position: "absolute",
          bottom: theme.spacing.xl,
          right: theme.spacing.xl,
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.14,
          shadowRadius: 8,
        },
        currentVariant,
        currentSize,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? <ActivityIndicator size="small" color={theme.colors.textPrimary} /> : children}
    </Pressable>
  );
}
