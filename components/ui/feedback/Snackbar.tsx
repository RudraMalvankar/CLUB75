import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Button } from "@/components/ui/button/Button";

type SnackbarProps = ViewProps & {
  readonly message: string;
  readonly action?: {
    label: string;
    onPress: () => void;
  };
};

export function Snackbar({ message, action, style, ...rest }: SnackbarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: theme.spacing.md,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.textPrimary,
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
      <Text variant="body" color={theme.colors.background} style={{ flex: 1 }}>
        {message}
      </Text>
      {action && (
        <Button variant="ghost" size="sm" onPress={action.onPress} style={{ minWidth: "auto" }}>
          {action.label}
        </Button>
      )}
    </View>
  );
}
