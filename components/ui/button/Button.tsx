import { Pressable, Text, ActivityIndicator, type PressableProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = PressableProps & {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly children: string;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  children,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      container: { backgroundColor: theme.colors.primary },
      text: { color: "#FFFFFF" },
    },
    secondary: {
      container: { backgroundColor: theme.colors.secondary },
      text: { color: theme.colors.textPrimary },
    },
    outline: {
      container: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      text: { color: theme.colors.textPrimary },
    },
    ghost: {
      container: { backgroundColor: "transparent" },
      text: { color: theme.colors.textPrimary },
    },
    danger: {
      container: { backgroundColor: theme.colors.danger },
      text: { color: "#FFFFFF" },
    },
  };

  const sizeStyles = {
    sm: {
      container: {
        height: 36,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radius.sm,
      },
      text: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: theme.fontWeights.medium,
      },
    },
    md: {
      container: {
        height: 44,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radius.md,
      },
      text: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: theme.fontWeights.medium,
      },
    },
    lg: {
      container: {
        height: 52,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.radius.md,
      },
      text: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: theme.fontWeights.semiBold,
      },
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.sm,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
        },
        currentVariant.container,
        currentSize.container,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? <ActivityIndicator size="small" color={currentVariant.text.color} /> : leftIcon}
      <Text style={[currentVariant.text, currentSize.text]}>{children}</Text>
      {!loading && rightIcon}
    </Pressable>
  );
}
