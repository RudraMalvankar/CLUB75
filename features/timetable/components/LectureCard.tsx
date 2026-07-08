import { Pressable, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Text } from "@/components/ui/typography/Text";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import type { TimetableLecture } from "../types";
import { LECTURE_TYPE_LABELS } from "../types";

type LectureCardProps = {
  readonly lecture: TimetableLecture;
  readonly onPress: (lecture: TimetableLecture) => void;
};

export function LectureCard({ lecture, onPress }: LectureCardProps) {
  const { theme } = useTheme();

  const statusVariant = lecture.isCurrent ? "info" : lecture.isNext ? "warning" : "default";
  const statusLabel = lecture.isCurrent ? "NOW" : lecture.isNext ? "NEXT" : null;

  return (
    <Pressable
      onPress={() => onPress(lecture)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Card
        style={{
          borderLeftWidth: 4,
          borderLeftColor: lecture.subjectColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1, gap: theme.spacing.xs }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
              <Text variant="bodyLarge" style={{ fontWeight: theme.fontWeights.semiBold, flex: 1 }}>
                {lecture.subjectName}
              </Text>
              {statusLabel && (
                <Badge variant={statusVariant} size="sm">
                  {statusLabel}
                </Badge>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
              <Text variant="body" color={theme.colors.textSecondary}>
                {lecture.startTime} - {lecture.endTime}
              </Text>
              <Caption variant="caption" color={theme.colors.textSecondary}>
                {lecture.duration}min
              </Caption>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
              {lecture.faculty && (
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  {lecture.faculty}
                </Caption>
              )}
              {lecture.room && (
                <Caption variant="caption" color={theme.colors.textSecondary}>
                  Room {lecture.room}
                </Caption>
              )}
            </View>
          </View>

          <Badge variant="info" size="sm">
            {LECTURE_TYPE_LABELS[lecture.lectureType]}
          </Badge>
        </View>
      </Card>
    </Pressable>
  );
}
