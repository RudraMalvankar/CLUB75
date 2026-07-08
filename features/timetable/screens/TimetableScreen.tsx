import { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Screen } from "@/components/layout/Screen";
import { Heading } from "@/components/ui/typography/Heading";
import { Button } from "@/components/ui/button/Button";
import { Stack } from "@/components/ui/layout/Stack";
import { useTimetable } from "../hooks/useTimetable";
import {
  DaySelector,
  DayView,
  WeeklyView,
  TimetableStatsCard,
  TimetableEmptyState,
  TimetableLoading,
  TimetableError,
} from "../components";
import type { TimetableLecture } from "../types";

type TimetableScreenProps = {
  readonly semesterId: string | null;
  readonly onCreateTimetable: () => void;
  readonly onLecturePress: (lecture: TimetableLecture) => void;
};

export function TimetableScreen({
  semesterId,
  onCreateTimetable,
  onLecturePress,
}: TimetableScreenProps) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const { days, currentDay, selectedDay, isLoading, error, stats, selectDay, refresh } =
    useTimetable(semesterId);

  if (isLoading) {
    return (
      <Screen>
        <TimetableLoading />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <TimetableError message={error} onRetry={refresh} />
      </Screen>
    );
  }

  if (!semesterId || days.every((d) => d.lectures.length === 0)) {
    return (
      <Screen>
        <TimetableEmptyState onCreateTimetable={onCreateTimetable} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: theme.spacing["4xl"] }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        <Stack gap="xl">
          <Heading variant="headingL">Timetable</Heading>

          <ViewModeToggle mode={viewMode} onModeChange={setViewMode} />

          {viewMode === "day" && (
            <>
              <DaySelector days={days} selectedDay={selectedDay} onSelectDay={selectDay} />

              {currentDay && <DayView day={currentDay} onLecturePress={onLecturePress} />}
            </>
          )}

          {viewMode === "week" && (
            <WeeklyView
              days={days}
              onDayPress={(day) => selectDay(day as any)}
              onLecturePress={(id) => {
                const lecture = days.flatMap((d) => d.lectures).find((l) => l.id === id);
                if (lecture) onLecturePress(lecture);
              }}
            />
          )}

          <TimetableStatsCard stats={stats} />
        </Stack>
      </ScrollView>
    </Screen>
  );
}

type ViewModeToggleProps = {
  readonly mode: "day" | "week";
  readonly onModeChange: (mode: "day" | "week") => void;
};

function ViewModeToggle({ mode, onModeChange }: ViewModeToggleProps) {
  return (
    <Stack gap="sm" style={{ flexDirection: "row" }}>
      <Button
        variant={mode === "day" ? "primary" : "outline"}
        size="sm"
        onPress={() => onModeChange("day")}
      >
        Day
      </Button>
      <Button
        variant={mode === "week" ? "primary" : "outline"}
        size="sm"
        onPress={() => onModeChange("week")}
      >
        Week
      </Button>
    </Stack>
  );
}
