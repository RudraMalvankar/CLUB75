import { getDatabase } from "@/database/database";
import {
  AiMetadataRepository,
  AttendanceRepository,
  GoalRepository,
  LectureRepository,
  SemesterRepository,
  SubjectRepository,
  TimetableRepository,
} from "@/database/repositories";
import type { ResetResult } from "../types";

export class ResetService {
  private readonly db = getDatabase();

  async resetApplication(): Promise<ResetResult> {
    try {
      await this.clearAllData();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to reset application",
      };
    }
  }

  async clearAllData(): Promise<void> {
    const semesterRepo = new SemesterRepository(this.db);
    const subjectRepo = new SubjectRepository(this.db);
    const attendanceRepo = new AttendanceRepository(this.db);
    const timetableRepo = new TimetableRepository(this.db);
    const lectureRepo = new LectureRepository(this.db);
    const goalRepo = new GoalRepository(this.db);
    const aiRepo = new AiMetadataRepository(this.db);

    const [semesters, subjects, attendance, timetable, lectureSlots, goals, aiMetadata] =
      await Promise.all([
        semesterRepo.getAll({ limit: 1000 }),
        subjectRepo.getAll({ limit: 5000 }),
        attendanceRepo.getAll({ limit: 50000 }),
        timetableRepo.getAll({ limit: 5000 }),
        lectureRepo.getAll({ limit: 5000 }),
        goalRepo.getAll({ limit: 1000 }),
        aiRepo.getAll({ limit: 10000 }),
      ]);

    await Promise.all([
      ...semesters.map((s) => semesterRepo.delete(s.id)),
      ...subjects.map((s) => subjectRepo.delete(s.id)),
      ...attendance.map((a) => attendanceRepo.delete(a.id)),
      ...timetable.map((t) => timetableRepo.delete(t.id)),
      ...lectureSlots.map((l) => lectureRepo.delete(l.id)),
      ...goals.map((g) => goalRepo.delete(g.id)),
      ...aiMetadata.map((a) => aiRepo.delete(a.id)),
    ]);
  }

  async getStorageInfo(): Promise<{
    totalRecords: number;
    recordCounts: Record<string, number>;
  }> {
    const semesterRepo = new SemesterRepository(this.db);
    const subjectRepo = new SubjectRepository(this.db);
    const attendanceRepo = new AttendanceRepository(this.db);
    const timetableRepo = new TimetableRepository(this.db);
    const lectureRepo = new LectureRepository(this.db);
    const goalRepo = new GoalRepository(this.db);
    const aiRepo = new AiMetadataRepository(this.db);

    const [semesters, subjects, attendance, timetable, lectureSlots, goals, aiMetadata] =
      await Promise.all([
        semesterRepo.getAll({ limit: 1000 }),
        subjectRepo.getAll({ limit: 5000 }),
        attendanceRepo.getAll({ limit: 50000 }),
        timetableRepo.getAll({ limit: 5000 }),
        lectureRepo.getAll({ limit: 5000 }),
        goalRepo.getAll({ limit: 1000 }),
        aiRepo.getAll({ limit: 10000 }),
      ]);

    const recordCounts = {
      semesters: semesters.length,
      subjects: subjects.length,
      attendance: attendance.length,
      timetable: timetable.length,
      lectureSlots: lectureSlots.length,
      goals: goals.length,
      aiMetadata: aiMetadata.length,
    };

    const totalRecords = Object.values(recordCounts).reduce((sum, count) => sum + count, 0);

    return { totalRecords, recordCounts };
  }
}
