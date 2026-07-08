import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";

type BadgeProps = ViewProps & {
  readonly variant?: BadgeVariant;
  readonly size?: BadgeSize;
  readonly children: string;
};

export function Badge({ variant = "default", size = "md", style, children, ...rest }: BadgeProps) {
  const { theme } = useTheme();

  const variantStyles: Record<BadgeVariant, { backgroundColor: string; textColor: string }> = {
    default: {
      backgroundColor: theme.colors.secondary,
      textColor: theme.colors.textPrimary,
    },
    primary: {
      backgroundColor: `${theme.colors.primary}20`,
      textColor: theme.colors.primary,
    },
    success: {
      backgroundColor: `${theme.colors.success}20`,
      textColor: theme.colors.success,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}20`,
      textColor: theme.colors.warning,
    },
    danger: {
      backgroundColor: `${theme.colors.danger}20`,
      textColor: theme.colors.danger,
    },
    info: {
      backgroundColor: `${theme.colors.info}20`,
      textColor: theme.colors.info,
    },
  };

  const sizeStyles: Record<BadgeSize, { paddingHorizontal: number; paddingVertical: number }> = {
    sm: { paddingHorizontal: theme.spacing.xs, paddingVertical: 2 },
    md: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs },
    lg: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          borderRadius: theme.radius.sm,
          backgroundColor: currentVariant.backgroundColor,
        },
        currentSize,
        style,
      ]}
      {...rest}
    >
      <Caption
        variant="caption"
        color={currentVariant.textColor}
        style={{ fontWeight: theme.fontWeights.medium }}
      >
        {children}
      </Caption>
    </View>
  );
}
