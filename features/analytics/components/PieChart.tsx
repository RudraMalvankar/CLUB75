import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type PieChartProps = {
  readonly data: { label: string; value: number; color: string }[];
  readonly size?: number;
};

export function PieChart({ data, size = 120 }: PieChartProps) {
  const { theme } = useTheme();

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
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
        <Caption variant="caption" color={theme.colors.textSecondary}>
          No data
        </Caption>
      </View>
    );
  }

  const segments = data
    .filter((item) => item.value > 0)
    .map((item) => ({
      ...item,
      percentage: (item.value / total) * 100,
    }));

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.secondary,
          overflow: "hidden",
        }}
      >
        {segments.map((segment, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: segment.color,
              borderRadius: size / 2,
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
        {segments.map((segment, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.xs }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: segment.color,
              }}
            />
            <Caption variant="caption" color={theme.colors.textSecondary}>
              {segment.label} ({Math.round(segment.percentage)}%)
            </Caption>
          </View>
        ))}
      </View>
    </View>
  );
}
