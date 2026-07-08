import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import { ProgressRing } from "./ProgressRing";
import type { AttendanceSummary } from "../types";
import { STATUS_LABELS } from "../types";

type AttendanceSummaryCardProps = {
  readonly summary: AttendanceSummary;
};

export function AttendanceSummaryCard({ summary }: AttendanceSummaryCardProps) {
  const { theme } = useTheme();

  const statusVariant =
    summary.status === "excellent"
      ? "success"
      : summary.status === "good"
        ? "info"
        : summary.status === "safe"
          ? "warning"
          : "danger";

  return (
    <Card>
      <Stack gap="md">
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Heading variant="headingM">Attendance Summary</Heading>
          <Badge variant={statusVariant}>{STATUS_LABELS[summary.status]}</Badge>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <ProgressRing value={summary.overallPercentage} size={100} color={theme.colors.primary} />

          <Stack gap="sm" style={{ flex: 1, marginLeft: theme.spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Goal
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                {summary.goalPercentage}%
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Difference
              </Caption>
              <Text
                variant="body"
                style={{
                  fontWeight: theme.fontWeights.medium,
                  color: summary.difference >= 0 ? theme.colors.success : theme.colors.danger,
                }}
              >
                {summary.difference >= 0 ? "+" : ""}
                {summary.difference}%
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Semester
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                {summary.semesterProgress}% complete
              </Text>
            </View>
          </Stack>
        </View>
      </Stack>
    </Card>
  );
}
