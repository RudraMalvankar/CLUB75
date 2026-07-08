import { View, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import { LineChart } from "./LineChart";
import type { AttendanceTrend, AnalyticsTimeRange } from "../types";
import { TREND_LABELS } from "../types";

type AttendanceTrendCardProps = {
  readonly trend: AttendanceTrend;
  readonly timeRange: AnalyticsTimeRange;
  readonly onTimeRangeChange: (range: AnalyticsTimeRange) => void;
};

export function AttendanceTrendCard({
  trend,
  timeRange,
  onTimeRangeChange,
}: AttendanceTrendCardProps) {
  const { theme } = useTheme();

  const timeRanges: { value: AnalyticsTimeRange; label: string }[] = [
    { value: "7days", label: "7D" },
    { value: "30days", label: "30D" },
    { value: "semester", label: "All" },
  ];

  const trendColor =
    trend.direction === "improving"
      ? theme.colors.success
      : trend.direction === "declining"
        ? theme.colors.danger
        : theme.colors.info;

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Heading variant="headingM">Attendance Trend</Heading>
        <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
          {timeRanges.map((range) => (
            <Pressable
              key={range.value}
              onPress={() => onTimeRangeChange(range.value)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View
                style={{
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  backgroundColor:
                    timeRange === range.value ? theme.colors.primary : theme.colors.surface,
                }}
              >
                <Text
                  variant="body"
                  style={{
                    fontSize: 12,
                    color:
                      timeRange === range.value
                        ? theme.colors.background
                        : theme.colors.textPrimary,
                    fontWeight: theme.fontWeights.medium,
                  }}
                >
                  {range.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <Card>
        <Stack gap="md">
          <LineChart
            data={trend.dataPoints.slice(-14).map((dp) => ({
              label: dp.date.slice(5),
              value: dp.percentage,
            }))}
            height={100}
            color={theme.colors.primary}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Weekly Avg
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {trend.weeklyAverage}%
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Monthly Avg
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {trend.monthlyAverage}%
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Trend
              </Caption>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: trendColor }}
              >
                {TREND_LABELS[trend.direction]}
              </Text>
            </View>
          </View>
        </Stack>
      </Card>
    </View>
  );
}
