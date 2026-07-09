import { describe, it, expect, vi } from "vitest";

import type { BackupMetadata } from "@/features/backup/types";
import { calculateTotalRecords, formatBackupSize } from "@/features/backup/utils/backup-validator";

vi.mock("@/database/database", () => ({
  getDatabase: vi.fn(() => ({})),
}));

vi.mock("@/database/repositories", () => ({
  SemesterRepository: vi.fn(() => ({
    getAll: vi
      .fn()
      .mockResolvedValue([
        { id: "1", name: "Fall 2024", startDate: "2024-08-01", endDate: "2024-12-15" },
      ]),
  })),
  SubjectRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([
      { id: "1", name: "Mathematics", semesterId: "1" },
      { id: "2", name: "Physics", semesterId: "1" },
    ]),
  })),
  AttendanceRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([
      { id: "1", subjectId: "1", date: "2024-09-01", status: "present" },
      { id: "2", subjectId: "1", date: "2024-09-02", status: "absent" },
      { id: "3", subjectId: "2", date: "2024-09-01", status: "present" },
    ]),
  })),
  TimetableRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
  })),
  LectureRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
  })),
  GoalRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
  })),
  SettingsRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
  })),
  AiMetadataRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    findByNamespace: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
}));

describe("Backup Utilities", () => {
  describe("calculateTotalRecords", () => {
    it("should calculate total records correctly", () => {
      const metadata: BackupMetadata = {
        version: "1.0",
        appVersion: "1.0.0",
        databaseVersion: 1,
        createdAt: Date.now(),
        platform: "test",
        recordCounts: {
          semesters: 1,
          subjects: 10,
          attendance: 500,
          timetable: 20,
          lectureSlots: 15,
          goals: 5,
          settings: 1,
          preferences: 0,
          aiMetadata: 50,
        },
        fileSize: 102400,
        checksum: "abc123",
      };

      const total = calculateTotalRecords(metadata);
      expect(total).toBe(602);
    });

    it("should handle zero records", () => {
      const metadata: BackupMetadata = {
        version: "1.0",
        appVersion: "1.0.0",
        databaseVersion: 1,
        createdAt: Date.now(),
        platform: "test",
        recordCounts: {
          semesters: 0,
          subjects: 0,
          attendance: 0,
          timetable: 0,
          lectureSlots: 0,
          goals: 0,
          settings: 0,
          preferences: 0,
          aiMetadata: 0,
        },
        fileSize: 0,
        checksum: "",
      };

      const total = calculateTotalRecords(metadata);
      expect(total).toBe(0);
    });
  });

  describe("formatBackupSize", () => {
    it("should format bytes", () => {
      expect(formatBackupSize(500)).toBe("500 B");
    });

    it("should format kilobytes", () => {
      expect(formatBackupSize(1500)).toBe("1.5 KB");
    });

    it("should format megabytes", () => {
      expect(formatBackupSize(1500000)).toBe("1.4 MB");
    });
  });
});
