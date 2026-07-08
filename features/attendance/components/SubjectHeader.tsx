import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { CircularProgress } from "@/components/ui/progress/CircularProgress";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import type { AttendanceSubject, AttendanceStats } from "../types";

type SubjectHeaderProps = {
  readonly subject: AttendanceSubject;
  readonly stats: AttendanceStats;
};

export function SubjectHeader({ subject, stats }: SubjectHeaderProps) {
  const { theme } = useTheme();

  const riskVariant =
    subject.risk === "none"
      ? "success"
      : subject.risk === "low"
        ? "info"
        : subject.risk === "medium"
          ? "warning"
          : "danger";
  const riskLabel =
    subject.risk === "none"
      ? "SAFE"
      : subject.risk === "low"
        ? "GOOD"
        : subject.risk === "medium"
          ? "WARNING"
          : subject.risk === "high"
            ? "RISK"
            : "CRITICAL";

  return (
    <Card>
      <View style={{ alignItems: "center", gap: theme.spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: subject.color,
            }}
          />
          <Heading variant="headingL">{subject.name}</Heading>
          <Badge variant={riskVariant}>{riskLabel}</Badge>
        </View>

        <CircularProgress value={stats.percentage} size={120} strokeWidth={10} />

        <View style={{ width: "100%", gap: theme.spacing.md }}>
          <ProgressBar value={stats.percentage} height={8} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {stats.attended}/{stats.totalLectures}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Attended
              </Caption>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.danger }}
              >
                {stats.missed}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Missed
              </Caption>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text
                variant="body"
                style={{ fontWeight: theme.fontWeights.semiBold, color: theme.colors.success }}
              >
                {stats.safeBunks}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Safe Bunks
              </Caption>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {stats.goalPercentage}%
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Goal
              </Caption>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}
