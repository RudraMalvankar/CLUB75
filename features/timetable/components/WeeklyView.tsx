import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { TimetableDay } from "../types";
import { DAY_LABELS, LECTURE_TYPE_LABELS } from "../types";

type WeeklyViewProps = {
  readonly days: TimetableDay[];
  readonly onDayPress: (day: string) => void;
  readonly onLecturePress: (lectureId: string) => void;
};

export function WeeklyView({ days, onDayPress, onLecturePress }: WeeklyViewProps) {
  const { theme } = useTheme();

  return (
    <Stack gap="lg">
      {days.map((day) => (
        <View key={day.day} style={{ gap: theme.spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Heading variant="headingM">{DAY_LABELS[day.day]}</Heading>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              {day.lectures.length} lectures
            </Caption>
          </View>

          {day.lectures.length === 0 ? (
            <Card>
              <View style={{ padding: theme.spacing.md, alignItems: "center" }}>
                <Caption variant="caption" color={theme.colors.textDisabled}>
                  No lectures
                </Caption>
              </View>
            </Card>
          ) : (
            <Stack gap="xs">
              {day.lectures.map((lecture) => (
                <Card key={lecture.id}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderLeftWidth: 3,
                      borderLeftColor: lecture.subjectColor,
                      paddingLeft: theme.spacing.sm,
                    }}
                  >
                    <View style={{ flex: 1, gap: theme.spacing.xs }}>
                      <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                        {lecture.subjectName}
                      </Text>
                      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
                        <Caption variant="caption" color={theme.colors.textSecondary}>
                          {lecture.startTime} - {lecture.endTime}
                        </Caption>
                        {lecture.room && (
                          <Caption variant="caption" color={theme.colors.textSecondary}>
                            {lecture.room}
                          </Caption>
                        )}
                      </View>
                    </View>
                    <Badge variant="info" size="sm">
                      {LECTURE_TYPE_LABELS[lecture.lectureType]}
                    </Badge>
                  </View>
                </Card>
              ))}
            </Stack>
          )}
        </View>
      ))}
    </Stack>
  );
}
