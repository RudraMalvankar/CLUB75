import { Pressable, ActivityIndicator, type PressableProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = PressableProps & {
  readonly variant?: IconButtonVariant;
  readonly size?: IconButtonSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly children: React.ReactNode;
  readonly accessibilityLabel: string;
};

export function IconButton({
  variant = "ghost",
  size = "md",
  loading = false,
  disabled = false,
  style,
  children,
  accessibilityLabel,
  ...rest
}: IconButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles: Record<
    IconButtonVariant,
    { backgroundColor: string; borderColor?: string }
  > = {
    primary: { backgroundColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.secondary },
    outline: { backgroundColor: "transparent", borderColor: theme.colors.border },
    ghost: { backgroundColor: "transparent" },
    danger: { backgroundColor: theme.colors.danger },
  };

  const sizeStyles: Record<
    IconButtonSize,
    { width: number; height: number; borderRadius: number }
  > = {
    sm: { width: 32, height: 32, borderRadius: theme.radius.sm },
    md: { width: 44, height: 44, borderRadius: theme.radius.md },
    lg: { width: 52, height: 52, borderRadius: theme.radius.md },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
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
