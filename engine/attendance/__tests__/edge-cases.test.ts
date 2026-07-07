import { describe, it, expect } from "vitest";
import {
  calculateAttendance,
  calculateSafeBunks,
  calculateGoal,
  calculatePrediction,
  calculateRecovery,
  calculateStatistics,
  calculateRecommendations,
  calculateSimulation,
} from "../index";
import type { AttendanceRecord } from "../types/models";
import { AttendanceStatusLevel, AttendanceCategory, RiskLevel } from "../types/enums";

function makeRecord(overrides: Partial<AttendanceRecord> = {}): AttendanceRecord {
  return {
    id: crypto.randomUUID(),
    subjectId: "subj-1",
    date: "2025-01-15",
    status: "present",
    lectureNumber: 1,
    remarks: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("Edge Cases", () => {
  describe("Empty inputs", () => {
    it("attendance handles empty records", () => {
      const result = calculateAttendance({ records: [] });
      expect(result.percentage).toBe(0);
      expect(result.total).toBe(0);
    });

    it("safe bunks handles zero values", () => {
      const result = calculateSafeBunks({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 75,
      });
      expect(result.safeBunks).toBe(0);
      expect(result.currentPercentage).toBe(0);
    });

    it("goal handles zero values", () => {
      const result = calculateGoal({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 75,
      });
      expect(result.currentPercentage).toBe(0);
    });

    it("prediction handles zero values", () => {
      const result = calculatePrediction({
        currentPresent: 0,
        currentTotal: 0,
        totalSemesterLectures: 0,
      });
      expect(result.scenarios).toHaveLength(5);
    });

    it("recovery handles zero values", () => {
      const result = calculateRecovery({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 75,
        totalSemesterLectures: 100,
      });
      expect(result.lecturesRemaining).toBe(100);
    });

    it("statistics handles empty records", () => {
      const result = calculateStatistics({ records: [] });
      expect(result.overall.totalLectures).toBe(0);
      expect(result.bySubject).toHaveLength(0);
    });

    it("recommendations handles zero values", () => {
      const result = calculateRecommendations({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 75,
        totalSemesterLectures: 0,
      });
      expect(result.actions.length).toBeGreaterThan(0);
    });

    it("simulation handles zero values", () => {
      const result = calculateSimulation({
        currentPresent: 0,
        currentTotal: 0,
        futurePresent: 0,
        futureAbsent: 0,
      });
      expect(result.originalPercentage).toBe(0);
      expect(result.simulatedPercentage).toBe(0);
    });
  });

  describe("Boundary percentages", () => {
    it("handles exactly 100% attendance", () => {
      const records = Array.from({ length: 50 }, () => makeRecord({ status: "present" }));
      const result = calculateAttendance({ records });
      expect(result.percentage).toBe(100);
      expect(result.statusLevel).toBe(AttendanceStatusLevel.Excellent);
    });

    it("handles exactly 0% attendance", () => {
      const records = Array.from({ length: 50 }, () => makeRecord({ status: "absent" }));
      const result = calculateAttendance({ records });
      expect(result.percentage).toBe(0);
      expect(result.statusLevel).toBe(AttendanceStatusLevel.Critical);
    });

    it("handles exactly 75% (boundary)", () => {
      const records = [
        ...Array.from({ length: 75 }, () => makeRecord({ status: "present" })),
        ...Array.from({ length: 25 }, () => makeRecord({ status: "absent" })),
      ];
      const result = calculateAttendance({ records });
      expect(result.percentage).toBe(75);
      expect(result.statusLevel).toBe(AttendanceStatusLevel.Safe);
    });

    it("handles exactly 90% (excellent boundary)", () => {
      const records = [
        ...Array.from({ length: 90 }, () => makeRecord({ status: "present" })),
        ...Array.from({ length: 10 }, () => makeRecord({ status: "absent" })),
      ];
      const result = calculateAttendance({ records });
      expect(result.percentage).toBe(90);
      expect(result.statusLevel).toBe(AttendanceStatusLevel.Excellent);
    });

    it("handles exactly 70% (warning boundary)", () => {
      const records = [
        ...Array.from({ length: 70 }, () => makeRecord({ status: "present" })),
        ...Array.from({ length: 30 }, () => makeRecord({ status: "absent" })),
      ];
      const result = calculateAttendance({ records });
      expect(result.percentage).toBe(70);
      expect(result.statusLevel).toBe(AttendanceStatusLevel.Warning);
    });
  });

  describe("Mixed statuses", () => {
    it("handles mix of all status types", () => {
      // present, absent, cancelled, medical, holiday, extraLecture
      // counted: present, absent, extraLecture → total=3, present=2, absent=1
      const records = [
        makeRecord({ status: "present" }),
        makeRecord({ status: "absent" }),
        makeRecord({ status: "cancelled" }),
        makeRecord({ status: "medical" }),
        makeRecord({ status: "holiday" }),
        makeRecord({ status: "extraLecture" }),
      ];
      const result = calculateAttendance({ records });
      expect(result.present).toBe(2);
      expect(result.total).toBe(3);
      expect(result.absent).toBe(1);
      expect(result.percentage).toBe(66.67);
    });

    it("only counts present and extraLecture as present", () => {
      const records = [
        makeRecord({ status: "present" }),
        makeRecord({ status: "extraLecture" }),
        makeRecord({ status: "cancelled" }),
        makeRecord({ status: "medical" }),
      ];
      const result = calculateAttendance({ records });
      expect(result.present).toBe(2);
      expect(result.total).toBe(2);
    });
  });

  describe("Large datasets", () => {
    it("handles 1000 records efficiently", () => {
      const records = Array.from({ length: 1000 }, (_, i) =>
        makeRecord({
          subjectId: `subj-${i % 10}`,
          date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
          status: i % 3 === 0 ? "absent" : "present",
        }),
      );
      const start = performance.now();
      const result = calculateAttendance({ records });
      const end = performance.now();
      expect(end - start).toBeLessThan(5);
      expect(result.percentage).toBeGreaterThan(0);
    });

    it("statistics handles large dataset", () => {
      const records = Array.from({ length: 500 }, (_, i) =>
        makeRecord({
          subjectId: `subj-${i % 5}`,
          date: `2025-${String(Math.floor(i / 28) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
          status: i % 4 === 0 ? "absent" : "present",
        }),
      );
      const start = performance.now();
      const result = calculateStatistics({ records });
      const end = performance.now();
      expect(end - start).toBeLessThan(200);
      expect(result.overall.totalLectures).toBeGreaterThan(0);
    });
  });

  describe("No NaN or Infinity", () => {
    it("attendance never returns NaN", () => {
      const result = calculateAttendance({ records: [] });
      expect(Number.isNaN(result.percentage)).toBe(false);
      expect(Number.isFinite(result.percentage)).toBe(true);
    });

    it("safe bunks never returns NaN", () => {
      const result = calculateSafeBunks({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 0,
      });
      expect(Number.isNaN(result.safeBunks)).toBe(false);
      expect(Number.isFinite(result.safeBunks)).toBe(true);
    });

    it("goal never returns NaN", () => {
      const result = calculateGoal({
        currentPresent: 0,
        currentTotal: 0,
        goalPercentage: 0,
      });
      expect(Number.isNaN(result.needed)).toBe(false);
      expect(Number.isFinite(result.needed)).toBe(true);
    });

    it("prediction never returns NaN", () => {
      const result = calculatePrediction({
        currentPresent: 0,
        currentTotal: 0,
        totalSemesterLectures: 0,
      });
      expect(Number.isNaN(result.bestCase)).toBe(false);
      expect(Number.isFinite(result.bestCase)).toBe(true);
    });
  });

  describe("Immutability", () => {
    it("does not mutate input records", () => {
      const records = [makeRecord({ status: "present" }), makeRecord({ status: "absent" })];
      const original = JSON.parse(JSON.stringify(records));
      calculateAttendance({ records });
      expect(JSON.parse(JSON.stringify(records))).toEqual(original);
    });
  });

  describe("Determinism", () => {
    it("returns same result for same input", () => {
      const records = [makeRecord({ status: "present" }), makeRecord({ status: "absent" })];
      const result1 = calculateAttendance({ records });
      const result2 = calculateAttendance({ records });
      expect(result1).toEqual(result2);
    });
  });
});
