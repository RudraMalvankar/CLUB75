import { getDatabase } from "@/database/database";
import {
  AiMetadataRepository,
  AttendanceRepository,
  GoalRepository,
  LectureRepository,
  SemesterRepository,
  SettingsRepository,
  SubjectRepository,
  TimetableRepository,
} from "@/database/repositories";
import { BACKUP_FORMAT_VERSION, MAX_BACKUP_SIZE, REQUIRED_TABLES } from "../types";
import type {
  BackupData,
  BackupValidationError,
  BackupValidationErrorCode,
  RestoreResult,
} from "../types";

export class RestoreService {
  private readonly db = getDatabase();

  async validateBackup(data: unknown): Promise<BackupValidationError | null> {
    if (!data || typeof data !== "object") {
      return this.createError("INVALID_JSON", "Invalid backup file format");
    }

    const backup = data as Record<string, unknown>;

    if (!backup.metadata || typeof backup.metadata !== "object") {
      return this.createError("MISSING_METADATA", "Backup metadata is missing");
    }

    const metadata = backup.metadata as Record<string, unknown>;

    if (metadata.version !== BACKUP_FORMAT_VERSION) {
      return this.createError(
        "INVALID_VERSION",
        `Unsupported backup version: ${metadata.version}. Expected ${BACKUP_FORMAT_VERSION}`,
      );
    }

    const missingTables = REQUIRED_TABLES.filter(
      (table) => !backup[table] || !Array.isArray(backup[table]),
    );

    if (missingTables.length > 0) {
      return this.createError(
        "MISSING_TABLES",
        `Backup is missing required tables: ${missingTables.join(", ")}`,
      );
    }

    const jsonString = JSON.stringify(data);
    const fileSize = new Blob([jsonString]).size;
    if (fileSize > MAX_BACKUP_SIZE) {
      return this.createError(
        "FILE_TOO_LARGE",
        `Backup file is too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum: ${MAX_BACKUP_SIZE / 1024 / 1024}MB`,
      );
    }

    const totalRecords = REQUIRED_TABLES.reduce((sum, table) => {
      const records = backup[table] as unknown[];
      return sum + (Array.isArray(records) ? records.length : 0);
    }, 0);

    if (totalRecords === 0) {
      return this.createError("EMPTY_BACKUP", "Backup contains no data");
    }

    return null;
  }

  async restoreFromBackup(data: BackupData): Promise<RestoreResult> {
    const validationError = await this.validateBackup(data);
    if (validationError) {
      return { success: false, recordsRestored: 0, error: validationError };
    }

    try {
      const semesterRepo = new SemesterRepository(this.db);
      const subjectRepo = new SubjectRepository(this.db);
      const attendanceRepo = new AttendanceRepository(this.db);
      const timetableRepo = new TimetableRepository(this.db);
      const lectureRepo = new LectureRepository(this.db);
      const goalRepo = new GoalRepository(this.db);
      const settingsRepo = new SettingsRepository(this.db);
      const aiRepo = new AiMetadataRepository(this.db);

      await this.clearAllData();

      let recordsRestored = 0;

      for (const semester of data.semesters) {
        await semesterRepo.insert(semester as Parameters<typeof semesterRepo.insert>[0]);
        recordsRestored++;
      }

      for (const subject of data.subjects) {
        await subjectRepo.insert(subject as Parameters<typeof subjectRepo.insert>[0]);
        recordsRestored++;
      }

      for (const record of data.attendance) {
        await attendanceRepo.insert(record as Parameters<typeof attendanceRepo.insert>[0]);
        recordsRestored++;
      }

      for (const entry of data.timetable) {
        await timetableRepo.insert(entry as Parameters<typeof timetableRepo.insert>[0]);
        recordsRestored++;
      }

      for (const slot of data.lectureSlots) {
        await lectureRepo.insert(slot as Parameters<typeof lectureRepo.insert>[0]);
        recordsRestored++;
      }

      for (const goal of data.goals) {
        await goalRepo.insert(goal as Parameters<typeof goalRepo.insert>[0]);
        recordsRestored++;
      }

      for (const setting of data.settings) {
        await settingsRepo.upsert(setting as Parameters<typeof settingsRepo.upsert>[0]);
        recordsRestored++;
      }

      for (const meta of data.aiMetadata) {
        await aiRepo.insert(meta as Parameters<typeof aiRepo.insert>[0]);
        recordsRestored++;
      }

      return { success: true, recordsRestored };
    } catch (error) {
      return {
        success: false,
        recordsRestored: 0,
        error: this.createError(
          "CORRUPTED_DATA",
          error instanceof Error ? error.message : "Failed to restore backup",
        ),
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

  private createError(
    code: BackupValidationErrorCode,
    message: string,
    field?: string,
  ): BackupValidationError {
    return { code, message, field };
  }
}
