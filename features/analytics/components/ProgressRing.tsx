import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";

type ProgressRingProps = {
  readonly value: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly color?: string;
  readonly label?: string;
};

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  color,
  label,
}: ProgressRingProps) {
  const { theme } = useTheme();
  const ringColor = color ?? theme.colors.primary;

  return (
    <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.secondary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          variant="bodyLarge"
          style={{
            fontWeight: theme.fontWeights.bold,
            color: ringColor,
          }}
        >
          {Math.round(value)}%
        </Text>
      </View>
      {label && (
        <Text variant="body" color={theme.colors.textSecondary} style={{ fontSize: 12 }}>
          {label}
        </Text>
      )}
    </View>
  );
}
