import { describe, it, expect } from "vitest";
import {
  calculateAttendance,
  calculateSubjectAttendance,
  calculateAttendanceFromCounts,
  calculateFutureAttendance,
  countRecordsByStatus,
  filterRecordsBySubject,
  filterRecordsByDateRange,
} from "../calculators/attendance";
import type { AttendanceRecord } from "../types/models";
import { AttendanceStatusLevel, AttendanceCategory } from "../types/enums";

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

describe("calculateAttendance", () => {
  it("returns zero state for empty records", () => {
    const result = calculateAttendance({ records: [] });
    expect(result.percentage).toBe(0);
    expect(result.present).toBe(0);
    expect(result.total).toBe(0);
    expect(result.absent).toBe(0);
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Critical);
  });

  it("calculates 100% attendance", () => {
    const records = [
      makeRecord({ status: "present" }),
      makeRecord({ status: "present" }),
      makeRecord({ status: "present" }),
    ];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(100);
    expect(result.present).toBe(3);
    expect(result.total).toBe(3);
    expect(result.absent).toBe(0);
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Excellent);
  });

  it("calculates 50% attendance", () => {
    const records = [makeRecord({ status: "present" }), makeRecord({ status: "absent" })];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(50);
    expect(result.present).toBe(1);
    expect(result.total).toBe(2);
    expect(result.absent).toBe(1);
  });

  it("ignores cancelled records in total", () => {
    const records = [makeRecord({ status: "present" }), makeRecord({ status: "cancelled" })];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(100);
    expect(result.total).toBe(1);
  });

  it("ignores medical records in total", () => {
    const records = [makeRecord({ status: "present" }), makeRecord({ status: "medical" })];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(100);
    expect(result.total).toBe(1);
  });

  it("ignores holiday records in total", () => {
    const records = [makeRecord({ status: "absent" }), makeRecord({ status: "holiday" })];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(0);
    expect(result.total).toBe(1);
  });

  it("counts extraLecture as present", () => {
    const records = [makeRecord({ status: "present" }), makeRecord({ status: "extraLecture" })];
    const result = calculateAttendance({ records });
    expect(result.percentage).toBe(100);
    expect(result.present).toBe(2);
    expect(result.total).toBe(2);
  });

  it("classifies as excellent above 90%", () => {
    const records = Array.from({ length: 10 }, (_, i) =>
      makeRecord({ status: i < 9 ? "present" : "present" }),
    );
    const result = calculateAttendance({ records });
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Excellent);
  });

  it("classifies as good between 80-89%", () => {
    const records = [
      ...Array.from({ length: 8 }, () => makeRecord({ status: "present" })),
      makeRecord({ status: "absent" }),
      makeRecord({ status: "absent" }),
    ];
    const result = calculateAttendance({ records });
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Good);
  });

  it("classifies as safe between 75-79%", () => {
    const records = [
      ...Array.from({ length: 75 }, () => makeRecord({ status: "present" })),
      ...Array.from({ length: 25 }, () => makeRecord({ status: "absent" })),
    ];
    const result = calculateAttendance({ records });
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Safe);
  });

  it("classifies as warning between 70-74%", () => {
    const records = [
      ...Array.from({ length: 70 }, () => makeRecord({ status: "present" })),
      ...Array.from({ length: 30 }, () => makeRecord({ status: "absent" })),
    ];
    const result = calculateAttendance({ records });
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Warning);
  });

  it("classifies as critical below 70%", () => {
    const records = [
      ...Array.from({ length: 60 }, () => makeRecord({ status: "present" })),
      ...Array.from({ length: 40 }, () => makeRecord({ status: "absent" })),
    ];
    const result = calculateAttendance({ records });
    expect(result.statusLevel).toBe(AttendanceStatusLevel.Critical);
  });
});

describe("calculateSubjectAttendance", () => {
  it("filters records by subjectId", () => {
    const records = [
      makeRecord({ subjectId: "subj-1", status: "present" }),
      makeRecord({ subjectId: "subj-2", status: "absent" }),
      makeRecord({ subjectId: "subj-1", status: "present" }),
    ];
    const result = calculateSubjectAttendance({
      subjectId: "subj-1",
      records,
      totalLectures: 10,
    });
    expect(result.percentage).toBe(100);
    expect(result.present).toBe(2);
    expect(result.total).toBe(2);
  });

  it("returns zero for no matching subject", () => {
    const records = [makeRecord({ subjectId: "subj-1", status: "present" })];
    const result = calculateSubjectAttendance({
      subjectId: "subj-99",
      records,
      totalLectures: 10,
    });
    expect(result.percentage).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe("calculateAttendanceFromCounts", () => {
  it("calculates from raw counts", () => {
    const result = calculateAttendanceFromCounts(75, 100);
    expect(result.percentage).toBe(75);
    expect(result.present).toBe(75);
    expect(result.total).toBe(100);
    expect(result.absent).toBe(25);
  });

  it("handles zero total", () => {
    const result = calculateAttendanceFromCounts(0, 0);
    expect(result.percentage).toBe(0);
  });

  it("handles NaN inputs gracefully", () => {
    const result = calculateAttendanceFromCounts(NaN, NaN);
    expect(result.percentage).toBe(0);
  });
});

describe("calculateFutureAttendance", () => {
  it("calculates future attendance", () => {
    const result = calculateFutureAttendance(70, 100, 5, 0);
    expect(result.present).toBe(75);
    expect(result.total).toBe(105);
    expect(result.percentage).toBe(71.43);
  });

  it("handles zero future lectures", () => {
    const result = calculateFutureAttendance(70, 100, 0, 0);
    expect(result.present).toBe(70);
    expect(result.total).toBe(100);
    expect(result.percentage).toBe(70);
  });
});

describe("countRecordsByStatus", () => {
  it("counts records with specific status", () => {
    const records = [
      makeRecord({ status: "present" }),
      makeRecord({ status: "absent" }),
      makeRecord({ status: "present" }),
    ];
    expect(countRecordsByStatus(records, "present")).toBe(2);
    expect(countRecordsByStatus(records, "absent")).toBe(1);
    expect(countRecordsByStatus(records, "cancelled")).toBe(0);
  });
});

describe("filterRecordsBySubject", () => {
  it("filters records by subject", () => {
    const records = [
      makeRecord({ subjectId: "subj-1" }),
      makeRecord({ subjectId: "subj-2" }),
      makeRecord({ subjectId: "subj-1" }),
    ];
    const filtered = filterRecordsBySubject(records, "subj-1");
    expect(filtered).toHaveLength(2);
  });
});

describe("filterRecordsByDateRange", () => {
  it("filters records within date range", () => {
    const records = [
      makeRecord({ date: "2025-01-01" }),
      makeRecord({ date: "2025-01-15" }),
      makeRecord({ date: "2025-01-31" }),
    ];
    const filtered = filterRecordsByDateRange(records, "2025-01-10", "2025-01-20");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]!.date).toBe("2025-01-15");
  });
});
