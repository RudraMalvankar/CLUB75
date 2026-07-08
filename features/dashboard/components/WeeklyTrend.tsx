import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";

type WeeklyTrendProps = {
  readonly direction: "improving" | "declining" | "stable";
  readonly weeklyAverage: number;
  readonly changeRate: number;
};

export function WeeklyTrend({ direction, weeklyAverage, changeRate }: WeeklyTrendProps) {
  const { theme } = useTheme();

  const directionIcon = direction === "improving" ? "↑" : direction === "declining" ? "↓" : "→";
  const directionColor =
    direction === "improving"
      ? theme.colors.success
      : direction === "declining"
        ? theme.colors.danger
        : theme.colors.textSecondary;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Weekly Trend</Heading>
      <Card>
        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <View style={{ gap: theme.spacing.xs }}>
            <Text variant="bodyLarge" style={{ fontWeight: theme.fontWeights.semiBold }}>
              {weeklyAverage}%
            </Text>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Weekly Average
            </Caption>
          </View>
          <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
            <Text variant="bodyLarge" color={directionColor} style={{ fontSize: 24 }}>
              {directionIcon}
            </Text>
            <Caption variant="caption" color={directionColor}>
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </Caption>
          </View>
          <View style={{ alignItems: "flex-end", gap: theme.spacing.xs }}>
            <Text
              variant="body"
              color={changeRate >= 0 ? theme.colors.success : theme.colors.danger}
            >
              {changeRate >= 0 ? "+" : ""}
              {changeRate}%
            </Text>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Change
            </Caption>
          </View>
        </View>
      </Card>
    </View>
  );
}
