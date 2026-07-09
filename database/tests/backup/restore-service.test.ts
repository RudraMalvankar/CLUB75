import { describe, it, expect, vi } from "vitest";

import { RestoreService } from "@/features/backup/services/restore-service";
import type { BackupData } from "@/features/backup/types";

const mockValidBackup: BackupData = {
  metadata: {
    version: "1.0",
    appVersion: "1.0.0",
    databaseVersion: 1,
    createdAt: Date.now(),
    platform: "test",
    recordCounts: {
      semesters: 1,
      subjects: 1,
      attendance: 1,
      timetable: 1,
      lectureSlots: 1,
      goals: 1,
      settings: 1,
      preferences: 0,
      aiMetadata: 0,
    },
    fileSize: 1000,
    checksum: "test",
  },
  semesters: [{ id: "1", name: "Test Semester" }],
  subjects: [{ id: "1", name: "Test Subject" }],
  attendance: [{ id: "1", subjectId: "1", status: "present" }],
  timetable: [{ id: "1", dayOfWeek: "monday" }],
  lectureSlots: [{ id: "1", slotNumber: 1 }],
  goals: [{ id: "1", target: 85 }],
  settings: [{ id: "1", theme: "dark" }],
  preferences: [],
  aiMetadata: [],
};

vi.mock("@/database/database", () => ({
  getDatabase: vi.fn(() => ({})),
}));

vi.mock("@/database/repositories", () => ({
  SemesterRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  SubjectRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  AttendanceRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  TimetableRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  LectureRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  GoalRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
  SettingsRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    upsert: vi.fn().mockResolvedValue({}),
  })),
  AiMetadataRepository: vi.fn(() => ({
    getAll: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  })),
}));

describe("RestoreService", () => {
  describe("validateBackup", () => {
    it("should return null for valid backup", async () => {
      const service = new RestoreService();
      const result = await service.validateBackup(mockValidBackup);
      expect(result).toBeNull();
    });

    it("should return error for null input", async () => {
      const service = new RestoreService();
      const result = await service.validateBackup(null);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("INVALID_JSON");
    });

    it("should return error for invalid version", async () => {
      const service = new RestoreService();
      const invalidVersion = {
        ...mockValidBackup,
        metadata: { ...mockValidBackup.metadata, version: "2.0" },
      };
      const result = await service.validateBackup(invalidVersion);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("INVALID_VERSION");
    });

    it("should return error for missing tables", async () => {
      const service = new RestoreService();
      const missingTables = {
        metadata: mockValidBackup.metadata,
        semesters: [],
      };
      const result = await service.validateBackup(missingTables);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("MISSING_TABLES");
    });

    it("should return error for empty backup", async () => {
      const service = new RestoreService();
      const emptyBackup = {
        ...mockValidBackup,
        semesters: [],
        subjects: [],
        attendance: [],
        timetable: [],
        lectureSlots: [],
        goals: [],
        settings: [],
        preferences: [],
        aiMetadata: [],
      };
      const result = await service.validateBackup(emptyBackup);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("EMPTY_BACKUP");
    });
  });
});
