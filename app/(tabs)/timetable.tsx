import { useCallback, useEffect, useState } from "react";

import { Screen } from "@/components/layout/Screen";
import { TimetableScreen } from "@/features/timetable/screens/TimetableScreen";
import { getDatabase } from "@/database/database";
import { SemesterRepository } from "@/database/repositories";
import type { TimetableLecture } from "@/features/timetable/types";

export default function TimetableTab() {
  const [semesterId, setSemesterId] = useState<string | null>(null);

  useEffect(() => {
    const loadSemester = async () => {
      try {
        const db = getDatabase();
        const semesterRepo = new SemesterRepository(db);
        const semesters = await semesterRepo.getAll();
        setSemesterId(semesters[0]?.id ?? null);
      } catch {
        setSemesterId(null);
      }
    };
    loadSemester();
  }, []);

  const handleCreateTimetable = useCallback(() => {
    // Navigation will be handled by Expo Router
    console.log("Navigate to create timetable");
  }, []);

  const handleLecturePress = useCallback((lecture: TimetableLecture) => {
    // Navigation will be handled by Expo Router
    console.log("Navigate to lecture:", lecture.id);
  }, []);

  return (
    <Screen>
      <TimetableScreen
        semesterId={semesterId}
        onCreateTimetable={handleCreateTimetable}
        onLecturePress={handleLecturePress}
      />
    </Screen>
  );
}
