import { View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Heading } from "@/components/ui/typography/Heading";
import { Caption } from "@/components/ui/typography/Caption";
import { Card } from "@/components/ui/card/Card";
import { Stack } from "@/components/ui/layout/Stack";
import type { TimetableDay, TimetableLecture } from "../types";
import { DAY_LABELS } from "../types";
import { LectureCard } from "./LectureCard";

type DayViewProps = {
  readonly day: TimetableDay;
  readonly onLecturePress: (lecture: TimetableLecture) => void;
};

export function DayView({ day, onLecturePress }: DayViewProps) {
  const { theme } = useTheme();

  if (day.lectures.length === 0) {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Heading variant="headingM">{DAY_LABELS[day.day]}</Heading>
        <Card>
          <View style={{ alignItems: "center", padding: theme.spacing.xl }}>
            <Caption variant="caption" color={theme.colors.textSecondary}>
              No lectures scheduled
            </Caption>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Heading variant="headingM">{DAY_LABELS[day.day]}</Heading>
        <Caption variant="caption" color={theme.colors.textSecondary}>
          {day.lectures.length} lectures
        </Caption>
      </View>

      <Stack gap="sm">
        {day.lectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} onPress={onLecturePress} />
        ))}
      </Stack>
    </View>
  );
}
