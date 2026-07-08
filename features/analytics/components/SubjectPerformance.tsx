import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { SubjectAnalytics } from "../types";
import { STATUS_LABELS } from "../types";

type SubjectPerformanceProps = {
  readonly subjects: SubjectAnalytics[];
};

export function SubjectPerformance({ subjects }: SubjectPerformanceProps) {
  const { theme } = useTheme();

  if (subjects.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Subject Performance</Heading>
      <Stack gap="sm">
        {subjects.map((subject) => {
          const statusVariant =
            subject.status === "excellent"
              ? "success"
              : subject.status === "good"
                ? "info"
                : subject.status === "safe"
                  ? "warning"
                  : "danger";
          return (
            <Card key={subject.subjectId}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
                <View
                  style={{
                    width: 4,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: subject.subjectColor,
                  }}
                />
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                      {subject.subjectName}
                    </Text>
                    <Badge variant={statusVariant} size="sm">
                      {STATUS_LABELS[subject.status]}
                    </Badge>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Caption variant="caption" color={theme.colors.textSecondary}>
                      {subject.faculty}
                    </Caption>
                    <Text
                      variant="body"
                      style={{ fontWeight: theme.fontWeights.bold, color: subject.subjectColor }}
                    >
                      {subject.attendancePercentage}%
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
