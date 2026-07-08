import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Badge } from "@/components/ui/badge/Badge";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import type { DashboardSubject } from "../types";

type SubjectOverviewProps = {
  readonly subjects: DashboardSubject[];
  readonly goalPercentage: number;
};

export function SubjectOverview({ subjects, goalPercentage }: SubjectOverviewProps) {
  const { theme } = useTheme();

  const displaySubjects = subjects.slice(0, 6);

  if (displaySubjects.length === 0) {
    return (
      <View style={{ gap: theme.spacing.sm }}>
        <Heading variant="headingM">Subjects</Heading>
        <Card>
          <View style={{ alignItems: "center", paddingVertical: theme.spacing.xl }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              No subjects added yet
            </Caption>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">Subjects</Heading>
      <Stack gap="sm">
        {displaySubjects.map((subject) => {
          const status = subject.attendancePercentage >= goalPercentage ? "safe" : "critical";
          return (
            <Card key={subject.id}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: subject.color,
                  }}
                />
                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                    {subject.name}
                  </Text>
                  <Caption variant="caption" color={theme.colors.textSecondary}>
                    {subject.attended}/{subject.totalLectures} lectures | {subject.safeBunks} safe
                    bunks
                  </Caption>
                </View>
                <View style={{ alignItems: "flex-end", gap: theme.spacing.xs }}>
                  <Text
                    variant="body"
                    color={status === "safe" ? theme.colors.success : theme.colors.danger}
                    style={{ fontWeight: theme.fontWeights.semiBold }}
                  >
                    {subject.attendancePercentage}%
                  </Text>
                  <Badge variant={status === "safe" ? "success" : "danger"} size="sm">
                    {status === "safe" ? "SAFE" : "CRITICAL"}
                  </Badge>
                </View>
              </View>
            </Card>
          );
        })}
      </Stack>
    </View>
  );
}
