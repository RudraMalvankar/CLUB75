import { describe, it, expect } from "vitest";
import { calculateStatistics } from "../calculators/statistics";
import type { AttendanceRecord } from "../types/models";

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

describe("calculateStatistics", () => {
  it("returns empty statistics for no records", () => {
    const result = calculateStatistics({ records: [] });
    expect(result.overall.totalLectures).toBe(0);
    expect(result.bySubject).toHaveLength(0);
    expect(result.dailyBreakdown).toHaveLength(0);
  });

  it("calculates overall statistics", () => {
    const records = [
      makeRecord({ status: "present", date: "2025-01-15" }),
      makeRecord({ status: "absent", date: "2025-01-15" }),
      makeRecord({ status: "present", date: "2025-01-16" }),
    ];
    const result = calculateStatistics({ records });
    expect(result.overall.attended).toBe(2);
    expect(result.overall.missed).toBe(1);
    expect(result.overall.totalLectures).toBe(3);
  });

  it("counts cancelled separately", () => {
    const records = [makeRecord({ status: "present" }), makeRecord({ status: "cancelled" })];
    const result = calculateStatistics({ records });
    expect(result.overall.attended).toBe(1);
    expect(result.overall.cancelled).toBe(1);
    expect(result.overall.totalLectures).toBe(1);
  });

  it("groups by subject", () => {
    const records = [
      makeRecord({ subjectId: "subj-1", status: "present" }),
      makeRecord({ subjectId: "subj-2", status: "absent" }),
      makeRecord({ subjectId: "subj-1", status: "present" }),
    ];
    const result = calculateStatistics({ records });
    expect(result.bySubject).toHaveLength(2);
  });

  it("filters by subjectId", () => {
    const records = [
      makeRecord({ subjectId: "subj-1", status: "present" }),
      makeRecord({ subjectId: "subj-2", status: "absent" }),
    ];
    const result = calculateStatistics({ records, subjectId: "subj-1" });
    expect(result.overall.attended).toBe(1);
    expect(result.overall.missed).toBe(0);
  });

  it("filters by date range", () => {
    const records = [
      makeRecord({ date: "2025-01-01", status: "present" }),
      makeRecord({ date: "2025-01-15", status: "present" }),
      makeRecord({ date: "2025-01-31", status: "absent" }),
    ];
    const result = calculateStatistics({
      records,
      startDate: "2025-01-10",
      endDate: "2025-01-20",
    });
    expect(result.overall.attended).toBe(1);
    expect(result.overall.missed).toBe(0);
  });

  it("calculates streaks", () => {
    const records = [
      makeRecord({ date: "2025-01-15", status: "present" }),
      makeRecord({ date: "2025-01-16", status: "present" }),
      makeRecord({ date: "2025-01-17", status: "absent" }),
      makeRecord({ date: "2025-01-18", status: "present" }),
    ];
    const result = calculateStatistics({ records });
    expect(result.streaks.longestStreak).toBe(2);
  });

  it("calculates daily breakdown", () => {
    const records = [
      makeRecord({ date: "2025-01-15", status: "present" }),
      makeRecord({ date: "2025-01-15", status: "absent" }),
      makeRecord({ date: "2025-01-16", status: "present" }),
    ];
    const result = calculateStatistics({ records });
    expect(result.dailyBreakdown).toHaveLength(2);
    const day1 = result.dailyBreakdown.find((d) => d.date === "2025-01-15");
    expect(day1?.total).toBe(2);
    expect(day1?.attended).toBe(1);
  });

  it("calculates trends", () => {
    const records = Array.from({ length: 10 }, (_, i) =>
      makeRecord({
        date: `2025-01-${String(i + 1).padStart(2, "0")}`,
        status: i < 8 ? "present" : "absent",
      }),
    );
    const result = calculateStatistics({ records });
    expect(result.trends.direction).toBeDefined();
    expect(result.trends.weeklyAverage).toBeGreaterThanOrEqual(0);
    expect(result.trends.monthlyAverage).toBeGreaterThanOrEqual(0);
  });
});
