import { View, Text, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type ProgressBarProps = ViewProps & {
  readonly value: number;
  readonly max?: number;
  readonly height?: number;
  readonly showLabel?: boolean;
};

export function ProgressBar({
  value,
  max = 100,
  height = 8,
  showLabel = false,
  style,
  ...rest
}: ProgressBarProps) {
  const { theme } = useTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View style={[{ gap: theme.spacing.xs }, style]} {...rest}>
      <View
        className="bg-secondary"
        style={[
          {
            height,
            borderRadius: theme.radius.sm,
            overflow: "hidden",
          },
        ]}
      >
        <View
          className="bg-primary"
          style={[
            {
              height: "100%",
              width: `${percentage}%`,
              borderRadius: theme.radius.sm,
            },
          ]}
        />
      </View>
      {showLabel && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
    </View>
  );
}
