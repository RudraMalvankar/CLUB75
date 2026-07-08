import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Caption } from "@/components/ui/typography/Caption";

type BarChartProps = {
  readonly data: { label: string; value: number; color?: string }[];
  readonly maxValue?: number;
  readonly height?: number;
};

export function BarChart({ data, maxValue, height = 120 }: BarChartProps) {
  const { theme } = useTheme();

  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", height, gap: theme.spacing.xs }}>
        {data.map((item, index) => {
          const barHeight = max > 0 ? (item.value / max) * height : 0;
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
              <View
                style={{
                  width: "100%",
                  height: Math.max(4, barHeight),
                  backgroundColor: item.color ?? theme.colors.primary,
                  borderRadius: theme.radius.sm,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
        {data.map((item, index) => (
          <View key={index} style={{ flex: 1, alignItems: "center" }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              {item.label}
            </Caption>
          </View>
        ))}
      </View>
    </View>
  );
}
