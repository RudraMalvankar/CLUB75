import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";

type AlertVariant = "info" | "success" | "warning" | "danger";

type AlertProps = ViewProps & {
  readonly variant?: AlertVariant;
  readonly title: string;
  readonly message?: string;
  readonly icon?: React.ReactNode;
};

export function Alert({ variant = "info", title, message, icon, style, ...rest }: AlertProps) {
  const { theme } = useTheme();

  const variantStyles: Record<
    AlertVariant,
    { backgroundColor: string; borderColor: string; textColor: string }
  > = {
    info: {
      backgroundColor: `${theme.colors.info}15`,
      borderColor: theme.colors.info,
      textColor: theme.colors.info,
    },
    success: {
      backgroundColor: `${theme.colors.success}15`,
      borderColor: theme.colors.success,
      textColor: theme.colors.success,
    },
    warning: {
      backgroundColor: `${theme.colors.warning}15`,
      borderColor: theme.colors.warning,
      textColor: theme.colors.warning,
    },
    danger: {
      backgroundColor: `${theme.colors.danger}15`,
      borderColor: theme.colors.danger,
      textColor: theme.colors.danger,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          gap: theme.spacing.sm,
        },
        style,
      ]}
      {...rest}
    >
      {icon && <View>{icon}</View>}
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <Text
          variant="bodyLarge"
          color={currentVariant.textColor}
          style={{ fontWeight: theme.fontWeights.semiBold }}
        >
          {title}
        </Text>
        {message && (
          <Caption variant="caption" color={theme.colors.textSecondary}>
            {message}
          </Caption>
        )}
      </View>
    </View>
  );
}
