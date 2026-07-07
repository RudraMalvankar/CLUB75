import {
  ABSENT_STATUSES,
  COUNTED_STATUSES,
  DEFAULT_GOAL_PERCENTAGE,
  MAXIMUM_ATTENDANCE_PERCENTAGE,
  MINIMUM_ATTENDANCE_PERCENTAGE,
  PRESENT_STATUSES,
  STATUS_LEVEL_THRESHOLDS,
  UNCOUNTED_STATUSES,
} from "../constants";
import type { AttendanceInput, AttendanceRecord, SubjectAttendanceInput } from "../types/models";
import type { AttendanceResult } from "../types/results";
import { AttendanceCategory, AttendanceStatusLevel } from "../types/enums";
import { calculatePercentage, countStatuses, roundToDefault } from "../helpers/math";
import { guardNaN, safeNumber } from "../helpers/validation";

function getStatusLevel(percentage: number): AttendanceStatusLevel {
  if (percentage >= STATUS_LEVEL_THRESHOLDS.excellent) return AttendanceStatusLevel.Excellent;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.good) return AttendanceStatusLevel.Good;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.safe) return AttendanceStatusLevel.Safe;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.warning) return AttendanceStatusLevel.Warning;
  return AttendanceStatusLevel.Critical;
}

function getCategory(present: number, total: number): AttendanceCategory {
  if (total === 0) return AttendanceCategory.Uncounted;
  const percentage = calculatePercentage(present, total);
  if (percentage >= DEFAULT_GOAL_PERCENTAGE) return AttendanceCategory.Counted;
  return AttendanceCategory.Uncounted;
}

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const { records } = input;
  if (!records || records.length === 0) {
    return {
      percentage: 0,
      present: 0,
      total: 0,
      absent: 0,
      category: AttendanceCategory.Uncounted,
      statusLevel: AttendanceStatusLevel.Critical,
    };
  }

  const statuses = records.map((r) => r.status);
  const present = countStatuses(statuses, [...PRESENT_STATUSES]);
  const total = countStatuses(statuses, [...COUNTED_STATUSES]);
  const absent = countStatuses(statuses, [...ABSENT_STATUSES]);

  const percentage = roundToDefault(
    guardNaN(calculatePercentage(present, total), "calculateAttendance"),
  );

  return {
    percentage,
    present,
    total,
    absent,
    category: getCategory(present, total),
    statusLevel: getStatusLevel(percentage),
  };
}

export function calculateSubjectAttendance(input: SubjectAttendanceInput): AttendanceResult {
  const { records, subjectId } = input;

  const subjectRecords = records.filter((r) => r.subjectId === subjectId);

  if (subjectRecords.length === 0) {
    return {
      percentage: 0,
      present: 0,
      total: 0,
      absent: 0,
      category: AttendanceCategory.Uncounted,
      statusLevel: AttendanceStatusLevel.Critical,
    };
  }

  return calculateAttendance({ records: subjectRecords });
}

export function calculateAttendanceFromCounts(present: number, total: number): AttendanceResult {
  const safePresent = safeNumber(present, 0);
  const safeTotal = safeNumber(total, 0);

  const absent = Math.max(0, safeTotal - safePresent);

  const percentage = roundToDefault(
    guardNaN(calculatePercentage(safePresent, safeTotal), "calculateAttendanceFromCounts"),
  );

  return {
    percentage,
    present: safePresent,
    total: safeTotal,
    absent,
    category: getCategory(safePresent, safeTotal),
    statusLevel: getStatusLevel(percentage),
  };
}

export function calculateFutureAttendance(
  currentPresent: number,
  currentTotal: number,
  futurePresent: number,
  futureAbsent: number,
): AttendanceResult {
  const totalPresent = safeNumber(currentPresent, 0) + safeNumber(futurePresent, 0);
  const totalLectures =
    safeNumber(currentTotal, 0) + safeNumber(futurePresent, 0) + safeNumber(futureAbsent, 0);
  const totalAbsent = safeNumber(futureAbsent, 0);

  const percentage = roundToDefault(
    guardNaN(calculatePercentage(totalPresent, totalLectures), "calculateFutureAttendance"),
  );

  return {
    percentage,
    present: totalPresent,
    total: totalLectures,
    absent: totalAbsent,
    category: getCategory(totalPresent, totalLectures),
    statusLevel: getStatusLevel(percentage),
  };
}

export function countRecordsByStatus(records: readonly AttendanceRecord[], status: string): number {
  return records.filter((r) => r.status === status).length;
}

export function filterRecordsBySubject(
  records: readonly AttendanceRecord[],
  subjectId: string,
): readonly AttendanceRecord[] {
  return records.filter((r) => r.subjectId === subjectId);
}

export function filterRecordsByDateRange(
  records: readonly AttendanceRecord[],
  startDate: string,
  endDate: string,
): readonly AttendanceRecord[] {
  return records.filter((r) => r.date >= startDate && r.date <= endDate);
}
