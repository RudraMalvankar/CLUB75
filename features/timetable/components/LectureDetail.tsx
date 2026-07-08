import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Stack } from "@/components/ui/layout/Stack";
import type { TimetableLecture } from "../types";
import { LECTURE_TYPE_LABELS, DAY_LABELS } from "../types";

type LectureDetailProps = {
  readonly lecture: TimetableLecture;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onMarkAttendance: () => void;
  readonly onViewSubject: () => void;
};

export function LectureDetail({
  lecture,
  onEdit,
  onDelete,
  onMarkAttendance,
  onViewSubject,
}: LectureDetailProps) {
  const { theme } = useTheme();

  return (
    <Stack gap="lg">
      <View style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: lecture.subjectColor,
            }}
          />
          <Heading variant="headingL">{lecture.subjectName}</Heading>
        </View>
        <Caption variant="caption" color={theme.colors.textSecondary}>
          {lecture.subjectCode}
        </Caption>
      </View>

      <Card>
        <Stack gap="md">
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Day
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
              {DAY_LABELS[lecture.day]}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Time
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
              {lecture.startTime} - {lecture.endTime}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Duration
            </Text>
            <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
              {lecture.duration} minutes
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Type
            </Text>
            <Badge variant="info">{LECTURE_TYPE_LABELS[lecture.lectureType]}</Badge>
          </View>

          {lecture.faculty && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="body" color={theme.colors.textSecondary}>
                Faculty
              </Text>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                {lecture.faculty}
              </Text>
            </View>
          )}

          {lecture.room && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="body" color={theme.colors.textSecondary}>
                Room
              </Text>
              <Text variant="body" style={{ fontWeight: theme.fontWeights.medium }}>
                {lecture.room}
              </Text>
            </View>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
