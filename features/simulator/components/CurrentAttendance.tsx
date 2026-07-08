import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { CircularProgress } from "@/components/ui/progress/CircularProgress";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import type { SimulationResult } from "../types";

type CurrentAttendanceProps = {
  readonly result: SimulationResult;
};

export function CurrentAttendance({ result }: CurrentAttendanceProps) {
  const { theme } = useTheme();

  const statusVariant =
    result.status === "excellent"
      ? "success"
      : result.status === "good"
        ? "info"
        : result.status === "safe"
          ? "warning"
          : "danger";
  const statusLabel = result.status.toUpperCase();

  return (
    <Card>
      <View style={{ alignItems: "center", gap: theme.spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
          <Heading variant="headingM">Current Attendance</Heading>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </View>

        <CircularProgress value={result.originalPercentage} size={100} strokeWidth={8} />

        <View style={{ width: "100%", gap: theme.spacing.sm }}>
          <ProgressBar value={result.originalPercentage} height={6} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              Goal: {result.goalPercentage}%
            </Caption>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              {result.totalPresent}/{result.totalLectures} lectures
            </Caption>
          </View>
        </View>
      </View>
    </Card>
  );
}
