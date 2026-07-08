import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";

type ToastVariant = "info" | "success" | "warning" | "danger";

type ToastProps = ViewProps & {
  readonly variant?: ToastVariant;
  readonly message: string;
  readonly icon?: React.ReactNode;
};

export function Toast({ variant = "info", message, icon, style, ...rest }: ToastProps) {
  const { theme } = useTheme();

  const variantStyles: Record<ToastVariant, { backgroundColor: string; textColor: string }> = {
    info: {
      backgroundColor: theme.colors.info,
      textColor: "#FFFFFF",
    },
    success: {
      backgroundColor: theme.colors.success,
      textColor: "#FFFFFF",
    },
    warning: {
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.textPrimary,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      textColor: "#FFFFFF",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          backgroundColor: currentVariant.backgroundColor,
          gap: theme.spacing.sm,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.14,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}
      {...rest}
    >
      {icon && <View>{icon}</View>}
      <Text variant="body" color={currentVariant.textColor} style={{ flex: 1 }}>
        {message}
      </Text>
    </View>
  );
}
