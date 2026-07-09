import { describe, it, expect } from "vitest";

import {
  validateBackupStructure,
  validateMetadata,
  formatBackupSize,
  formatRecordCount,
  generateBackupName,
  calculateTotalRecords,
  isBackupData,
} from "@/features/backup/utils/backup-validator";
import type { BackupMetadata, BackupData } from "@/features/backup/types";

const mockMetadata: BackupMetadata = {
  version: "1.0",
  appVersion: "1.0.0",
  databaseVersion: 1,
  createdAt: 1700000000000,
  platform: "react-native",
  recordCounts: {
    semesters: 2,
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

const mockBackupData: BackupData = {
  metadata: mockMetadata,
  semesters: [{ id: "1", name: "Fall 2024" }],
  subjects: [{ id: "1", name: "Math" }],
  attendance: [{ id: "1", subjectId: "1", status: "present" }],
  timetable: [{ id: "1", dayOfWeek: "monday" }],
  lectureSlots: [{ id: "1", slotNumber: 1 }],
  goals: [{ id: "1", target: 85 }],
  settings: [{ id: "1", theme: "dark" }],
  preferences: [],
  aiMetadata: [{ id: "1", key: "test" }],
};

describe("Backup Validator", () => {
  describe("validateBackupStructure", () => {
    it("should return null for valid backup data", () => {
      const result = validateBackupStructure(mockBackupData);
      expect(result).toBeNull();
    });

    it("should return error for null input", () => {
      const result = validateBackupStructure(null);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("INVALID_JSON");
    });

    it("should return error for non-object input", () => {
      const result = validateBackupStructure("string");
      expect(result).not.toBeNull();
      expect(result?.code).toBe("INVALID_JSON");
    });

    it("should return error for missing fields", () => {
      const result = validateBackupStructure({ metadata: {} });
      expect(result).not.toBeNull();
      expect(result?.code).toBe("MISSING_TABLES");
    });
  });

  describe("validateMetadata", () => {
    it("should return null for valid metadata", () => {
      const result = validateMetadata(mockMetadata);
      expect(result).toBeNull();
    });

    it("should return error for null input", () => {
      const result = validateMetadata(null);
      expect(result).not.toBeNull();
      expect(result?.code).toBe("MISSING_METADATA");
    });

    it("should return error for missing required fields", () => {
      const result = validateMetadata({ version: "1.0" });
      expect(result).not.toBeNull();
      expect(result?.code).toBe("MISSING_METADATA");
    });
  });

  describe("formatBackupSize", () => {
    it("should format bytes correctly", () => {
      expect(formatBackupSize(500)).toBe("500 B");
      expect(formatBackupSize(1500)).toBe("1.5 KB");
      expect(formatBackupSize(1500000)).toBe("1.4 MB");
    });
  });

  describe("formatRecordCount", () => {
    it("should format numbers with locale", () => {
      const result = formatRecordCount(1000);
      expect(result).toBeTruthy();
    });
  });

  describe("generateBackupName", () => {
    it("should generate backup name from metadata", () => {
      const name = generateBackupName(mockMetadata);
      expect(name).toContain("Club75_Backup_");
      expect(name).toContain("2023");
    });
  });

  describe("calculateTotalRecords", () => {
    it("should sum all record counts", () => {
      const total = calculateTotalRecords(mockMetadata);
      expect(total).toBe(603);
    });

    it("should return 0 for empty counts", () => {
      const emptyMetadata: BackupMetadata = {
        ...mockMetadata,
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
      };
      const total = calculateTotalRecords(emptyMetadata);
      expect(total).toBe(0);
    });
  });

  describe("isBackupData", () => {
    it("should return true for valid backup data", () => {
      expect(isBackupData(mockBackupData)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isBackupData(null)).toBe(false);
    });

    it("should return false for incomplete data", () => {
      expect(isBackupData({ metadata: {} })).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(isBackupData("string")).toBe(false);
    });
  });
});
