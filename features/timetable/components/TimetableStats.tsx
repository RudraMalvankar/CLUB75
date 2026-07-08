import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import type { TimetableStats } from "../types";
import { DAY_LABELS } from "../types";

type TimetableStatsProps = {
  readonly stats: TimetableStats;
};

export function TimetableStatsCard({ stats }: TimetableStatsProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Statistics</Heading>
      <Card>
        <Stack gap="md">
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Total Subjects
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
              {stats.totalSubjects}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Weekly Lectures
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
              {stats.totalLecturesPerWeek}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Avg Duration
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
              {stats.averageDuration} min
            </Text>
          </View>

          {stats.busiestDay && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="body" color={theme.colors.textSecondary}>
                Busiest Day
              </Text>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.warning }}
              >
                {DAY_LABELS[stats.busiestDay]}
              </Text>
            </View>
          )}

          {stats.lightestDay && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="body" color={theme.colors.textSecondary}>
                Lightest Day
              </Text>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.success }}
              >
                {DAY_LABELS[stats.lightestDay]}
              </Text>
            </View>
          )}
        </Stack>
      </Card>
    </View>
  );
}
