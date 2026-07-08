import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { CircularProgress } from "@/components/ui/progress/CircularProgress";
import { Badge } from "@/components/ui/badge/Badge";

type OverallAttendanceCardProps = {
  readonly percentage: number;
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly goalPercentage: number;
  readonly currentWeek: number;
  readonly totalWeeks: number;
  readonly status: "safe" | "warning" | "critical";
};

export function OverallAttendanceCard({
  percentage,
  totalLectures,
  attended,
  missed,
  goalPercentage,
  currentWeek,
  totalWeeks,
  status,
}: OverallAttendanceCardProps) {
  const { theme } = useTheme();

  const statusVariant = status === "safe" ? "success" : status === "warning" ? "warning" : "danger";
  const statusLabel = status === "safe" ? "SAFE" : status === "warning" ? "WARNING" : "CRITICAL";

  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.lg }}>
        <CircularProgress value={percentage} size={80} strokeWidth={8} />
        <View style={{ flex: 1, gap: theme.spacing.sm }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
            <Heading variant="headingL">{percentage}%</Heading>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </View>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Goal: {goalPercentage}%
          </Caption>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            Semester Week: {currentWeek} / {totalWeeks}
          </Caption>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            {attended} / {totalLectures} lectures ({missed} missed)
          </Caption>
        </View>
      </View>
    </Card>
  );
}
