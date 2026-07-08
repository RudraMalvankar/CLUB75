import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type LineChartProps = {
  readonly data: { label: string; value: number }[];
  readonly height?: number;
  readonly showDots?: boolean;
  readonly color?: string;
};

export function LineChart({ data, height = 100, showDots = true, color }: LineChartProps) {
  const { theme } = useTheme();
  const chartColor = color ?? theme.colors.primary;

  if (data.length === 0) {
    return (
      <View
        style={{
          height,
          backgroundColor: theme.colors.secondary,
          borderRadius: theme.radius.md,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Caption variant="caption" color={theme.colors.textSecondary}>
          No data
        </Caption>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <View style={{ height, flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
        {data.map((point, index) => {
          const normalizedHeight = ((point.value - minValue) / range) * height;
          return (
            <View
              key={index}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-end",
                height,
              }}
            >
              {showDots && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: chartColor,
                    marginBottom: 2,
                  }}
                />
              )}
              <View
                style={{
                  width: "80%",
                  height: Math.max(2, normalizedHeight),
                  backgroundColor: chartColor,
                  opacity: 0.3,
                  borderRadius: theme.radius.sm,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {data
          .filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1)
          .map((point, index) => (
            <Caption key={index} variant="caption" color={theme.colors.textSecondary}>
              {point.label}
            </Caption>
          ))}
      </View>
    </View>
  );
}
