import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { DashboardLecture } from "../types";

type TodayTimetableProps = {
  readonly lectures: DashboardLecture[];
};

export function TodayTimetable({ lectures }: TodayTimetableProps) {
  const { theme } = useTheme();

  if (lectures.length === 0) {
    return (
      <Card>
        <View
          style={{ gap: theme.spacing.sm, alignItems: "center", paddingVertical: theme.spacing.xl }}
        >
          <Heading variant="headingM">{"Today's Classes"}</Heading>
          <Caption variant="caption" color={theme.colors.textSecondary}>
            No classes scheduled for today
          </Caption>
        </View>
      </Card>
    );
  }

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Heading variant="headingM">{"Today's Classes"}</Heading>
      <Stack gap="sm">
        {lectures.map((lecture) => (
          <Card key={lecture.id}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
              <View
                style={{
                  width: 4,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: lecture.subjectColor,
                }}
              />
              <View style={{ flex: 1, gap: theme.spacing.xs }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
                  <Text variant="body" style={{ fontWeight: theme.fontWeights.semiBold }}>
                    {lecture.subjectName}
                  </Text>
                  <Badge variant="default" size="sm">
                    {lecture.subjectCode}
                  </Badge>
                </View>
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  {lecture.startTime} - {lecture.endTime} | {lecture.faculty ?? "TBA"} |{" "}
                  {lecture.room ?? "TBA"}
                </Caption>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text variant="body" color={theme.colors.textSecondary}>
                  {lecture.attendancePercentage}%
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </Stack>
    </View>
  );
}
