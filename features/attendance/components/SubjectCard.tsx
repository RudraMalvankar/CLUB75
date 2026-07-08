import { View, Pressable } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress/ProgressBar";
import type { AttendanceSubject } from "../types";

type SubjectCardProps = {
  readonly subject: AttendanceSubject;
  readonly onPress: (subjectId: string) => void;
};

export function SubjectCard({ subject, onPress }: SubjectCardProps) {
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
    <Pressable
      onPress={() => onPress(subject.id)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Card>
        <View style={{ gap: theme.spacing.sm }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: subject.color,
              }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold, flex: 1 }}>
                  {subject.name}
                </Text>
                <Badge variant={riskVariant} size="sm">
                  {riskLabel}
                </Badge>
              </View>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                {subject.faculty}
              </Caption>
            </View>
          </View>

          <ProgressBar value={subject.attendancePercentage} height={6} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Attendance
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {subject.attendancePercentage}%
              </Text>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Present
              </Caption>
              <Text variant="body">{subject.attended}</Text>
            </View>
            <View style={{ alignItems: "center", gap: theme.spacing.xs }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Absent
              </Caption>
              <Text variant="body">{subject.missed}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: theme.spacing.xs }}>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                Safe Bunks
              </Caption>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                {subject.safeBunks}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
