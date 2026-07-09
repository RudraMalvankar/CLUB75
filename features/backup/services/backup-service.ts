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
import { APP_VERSION, DATABASE_VERSION, BACKUP_FORMAT_VERSION } from "../types";
import type { BackupData, BackupMetadata, BackupRecordCounts } from "../types";

const BACKUP_NAMESPACE = "backup_history";

export class BackupService {
  private readonly db = getDatabase();

  async createBackup(): Promise<BackupData> {
    const semesterRepo = new SemesterRepository(this.db);
    const subjectRepo = new SubjectRepository(this.db);
    const attendanceRepo = new AttendanceRepository(this.db);
    const timetableRepo = new TimetableRepository(this.db);
    const lectureRepo = new LectureRepository(this.db);
    const goalRepo = new GoalRepository(this.db);
    const settingsRepo = new SettingsRepository(this.db);
    const aiRepo = new AiMetadataRepository(this.db);

    const [semesters, subjects, attendance, timetable, lectureSlots, goals, settings, aiMetadata] =
      await Promise.all([
        semesterRepo.getAll({ limit: 1000 }),
        subjectRepo.getAll({ limit: 5000 }),
        attendanceRepo.getAll({ limit: 50000 }),
        timetableRepo.getAll({ limit: 5000 }),
        lectureRepo.getAll({ limit: 5000 }),
        goalRepo.getAll({ limit: 1000 }),
        settingsRepo.getSettings(),
        aiRepo.getAll({ limit: 10000 }),
      ]);

    const settingsArray = settings ? [settings] : [];

    const recordCounts: BackupRecordCounts = {
      semesters: semesters.length,
      subjects: subjects.length,
      attendance: attendance.length,
      timetable: timetable.length,
      lectureSlots: lectureSlots.length,
      goals: goals.length,
      settings: settingsArray.length,
      preferences: 0,
      aiMetadata: aiMetadata.length,
    };

    const metadata: BackupMetadata = {
      version: BACKUP_FORMAT_VERSION,
      appVersion: APP_VERSION,
      databaseVersion: DATABASE_VERSION,
      createdAt: Date.now(),
      platform: this.getPlatform(),
      recordCounts,
      fileSize: 0,
      checksum: "",
    };

    const backup: BackupData = {
      metadata,
      semesters: semesters as unknown as Record<string, unknown>[],
      subjects: subjects as unknown as Record<string, unknown>[],
      attendance: attendance as unknown as Record<string, unknown>[],
      timetable: timetable as unknown as Record<string, unknown>[],
      lectureSlots: lectureSlots as unknown as Record<string, unknown>[],
      goals: goals as unknown as Record<string, unknown>[],
      settings: settingsArray as unknown as Record<string, unknown>[],
      preferences: [],
      aiMetadata: aiMetadata as unknown as Record<string, unknown>[],
    };

    const jsonString = JSON.stringify(backup);
    const fileSize = new Blob([jsonString]).size;
    const checksum = await this.calculateChecksum(jsonString);

    const finalMetadata: BackupMetadata = {
      ...metadata,
      fileSize,
      checksum,
    };

    return {
      ...backup,
      metadata: finalMetadata,
    };
  }

  async saveBackupHistory(metadata: BackupMetadata, name: string): Promise<void> {
    const aiRepo = new AiMetadataRepository(this.db);
    await aiRepo.insert({
      namespace: BACKUP_NAMESPACE,
      key: metadata.createdAt.toString(),
      value: JSON.stringify({ name, metadata }),
    });
  }

  async getBackupHistory(): Promise<{ name: string; metadata: BackupMetadata }[]> {
    const aiRepo = new AiMetadataRepository(this.db);
    const entries = await aiRepo.findByNamespace(BACKUP_NAMESPACE);

    return entries
      .map((entry) => {
        try {
          return JSON.parse(entry.value) as { name: string; metadata: BackupMetadata };
        } catch {
          return null;
        }
      })
      .filter((item): item is { name: string; metadata: BackupMetadata } => item !== null)
      .sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
  }

  async deleteBackupHistory(createdAt: number): Promise<void> {
    const aiRepo = new AiMetadataRepository(this.db);
    const entries = await aiRepo.findByNamespace(BACKUP_NAMESPACE);
    const entry = entries.find((e) => e.key === createdAt.toString());
    if (entry) {
      await aiRepo.delete(entry.id);
    }
  }

  private getPlatform(): string {
    if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
      return "react-native";
    }
    return "unknown";
  }

  private async calculateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
