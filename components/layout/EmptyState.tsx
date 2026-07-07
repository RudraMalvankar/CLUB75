import { View, Text } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type EmptyStateProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly icon?: React.ReactNode;
};

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ padding: theme.spacing["3xl"] }}
    >
      {icon && <View style={{ marginBottom: theme.spacing.lg }}>{icon}</View>}
      <Text
        className="text-title font-semibold text-foreground"
        style={{ marginBottom: theme.spacing.sm }}
      >
        {title}
      </Text>
      {subtitle && <Text className="text-body text-foreground-muted text-center">{subtitle}</Text>}
    </View>
  );
}
