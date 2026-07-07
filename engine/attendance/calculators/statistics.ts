import {
  ABSENT_STATUSES,
  COUNTED_STATUSES,
  DEFAULT_GOAL_PERCENTAGE,
  PERCENTAGE_MULTIPLIER,
  PRESENT_STATUSES,
  STATUS_LEVEL_THRESHOLDS,
} from "../constants";
import type { StatisticsInput, AttendanceRecord } from "../types/models";
import type {
  StatisticsResult,
  OverallStatistics,
  SubjectStatistics,
  StreakResult,
  TrendResult,
  DailyStatistic,
} from "../types/results";
import { AttendanceStatusLevel, RiskLevel } from "../types/enums";
import { calculatePercentage, countStatuses, roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

function getStatusLevel(percentage: number): AttendanceStatusLevel {
  if (percentage >= STATUS_LEVEL_THRESHOLDS.excellent) return AttendanceStatusLevel.Excellent;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.good) return AttendanceStatusLevel.Good;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.safe) return AttendanceStatusLevel.Safe;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.warning) return AttendanceStatusLevel.Warning;
  return AttendanceStatusLevel.Critical;
}

function getRiskLevel(percentage: number): RiskLevel {
  if (percentage >= 90) return RiskLevel.None;
  if (percentage >= 80) return RiskLevel.Low;
  if (percentage >= 75) return RiskLevel.Medium;
  if (percentage >= 70) return RiskLevel.High;
  return RiskLevel.Critical;
}

function calculateOverall(records: readonly AttendanceRecord[]): OverallStatistics {
  const statuses = records.map((r) => r.status);
  const attended = countStatuses(statuses, [...PRESENT_STATUSES]);
  const total = countStatuses(statuses, [...COUNTED_STATUSES]);
  const missed = countStatuses(statuses, [...ABSENT_STATUSES]);
  const cancelled = countStatuses(statuses, ["cancelled"]);
  const medical = countStatuses(statuses, ["medical"]);
  const holiday = countStatuses(statuses, ["holiday"]);
  const extraLectures = countStatuses(statuses, ["extraLecture"]);

  const attendancePercentage = roundToDefault(calculatePercentage(attended, total));

  const uniqueDates = [...new Set(records.map((r) => r.date))];
  const averageDailyAttendance = roundToDefault(safeDivide(total, uniqueDates.length));

  return {
    totalLectures: total,
    attended,
    missed,
    cancelled,
    medical,
    holiday,
    extraLectures,
    attendancePercentage,
    averageDailyAttendance,
  };
}

function calculateBySubject(records: readonly AttendanceRecord[]): readonly SubjectStatistics[] {
  const subjectMap = new Map<string, AttendanceRecord[]>();
  for (const record of records) {
    const existing = subjectMap.get(record.subjectId) ?? [];
    existing.push(record);
    subjectMap.set(record.subjectId, existing);
  }

  const results: SubjectStatistics[] = [];
  for (const [subjectId, subjectRecords] of subjectMap) {
    const statuses = subjectRecords.map((r) => r.status);
    const attended = countStatuses(statuses, [...PRESENT_STATUSES]);
    const total = countStatuses(statuses, [...COUNTED_STATUSES]);
    const missed = countStatuses(statuses, [...ABSENT_STATUSES]);
    const percentage = roundToDefault(calculatePercentage(attended, total));

    results.push({
      subjectId,
      subjectName: subjectId,
      totalLectures: total,
      attended,
      missed,
      attendancePercentage: percentage,
      statusLevel: getStatusLevel(percentage),
      risk: getRiskLevel(percentage),
      credits: 0,
    });
  }

  return results;
}

function calculateStreaks(records: readonly AttendanceRecord[]): StreakResult {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  let currentStreak = 0;
  let longestStreak = 0;
  let currentAbsentStreak = 0;
  let longestAbsentStreak = 0;

  let tempPresentStreak = 0;
  let tempAbsentStreak = 0;

  for (const record of sorted) {
    const isPresent = [...PRESENT_STATUSES].includes(record.status as any);
    const isCounted = [...COUNTED_STATUSES].includes(record.status as any);

    if (!isCounted) continue;

    if (isPresent) {
      tempPresentStreak++;
      tempAbsentStreak = 0;
    } else {
      tempAbsentStreak++;
      tempPresentStreak = 0;
    }

    longestStreak = Math.max(longestStreak, tempPresentStreak);
    longestAbsentStreak = Math.max(longestAbsentStreak, tempAbsentStreak);
  }

  const lastRecords = sorted.filter((r) => [...COUNTED_STATUSES].includes(r.status as any));

  for (let i = lastRecords.length - 1; i >= 0; i--) {
    const isPresent = [...PRESENT_STATUSES].includes(lastRecords[i]!.status as any);
    if (isPresent) {
      currentStreak++;
    } else {
      break;
    }
  }

  for (let i = lastRecords.length - 1; i >= 0; i--) {
    const isPresent = [...PRESENT_STATUSES].includes(lastRecords[i]!.status as any);
    if (!isPresent) {
      currentAbsentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    currentAbsentStreak,
    longestAbsentStreak,
  };
}

function calculateTrends(records: readonly AttendanceRecord[]): TrendResult {
  const sorted = [...records]
    .filter((r) => [...COUNTED_STATUSES].includes(r.status as any))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    return {
      direction: "stable",
      weeklyAverage: 0,
      monthlyAverage: 0,
      changeRate: 0,
    };
  }

  const dailyMap = new Map<string, { present: number; total: number }>();
  for (const record of sorted) {
    const existing = dailyMap.get(record.date) ?? { present: 0, total: 0 };
    existing.total++;
    if ([...PRESENT_STATUSES].includes(record.status as any)) {
      existing.present++;
    }
    dailyMap.set(record.date, existing);
  }

  const dailyPercentages = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, counts]) => calculatePercentage(counts.present, counts.total));

  const weeklyAverage = roundToDefault(
    dailyPercentages.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, dailyPercentages.length),
  );

  const monthlyAverage = roundToDefault(
    dailyPercentages.slice(-30).reduce((a, b) => a + b, 0) / Math.min(30, dailyPercentages.length),
  );

  let direction: "improving" | "declining" | "stable" = "stable";
  if (dailyPercentages.length >= 2) {
    const recent = dailyPercentages.slice(-5);
    const earlier = dailyPercentages.slice(-10, -5);

    if (recent.length > 0 && earlier.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
      const diff = recentAvg - earlierAvg;

      if (diff > 2) direction = "improving";
      else if (diff < -2) direction = "declining";
    }
  }

  const changeRate = roundToDefault(
    dailyPercentages.length >= 2
      ? dailyPercentages[dailyPercentages.length - 1]! -
          dailyPercentages[dailyPercentages.length - 2]!
      : 0,
  );

  return {
    direction,
    weeklyAverage,
    monthlyAverage,
    changeRate,
  };
}

function calculateDailyBreakdown(records: readonly AttendanceRecord[]): readonly DailyStatistic[] {
  const dateMap = new Map<string, { present: number; total: number }>();

  for (const record of records) {
    const existing = dateMap.get(record.date) ?? { present: 0, total: 0 };
    if ([...COUNTED_STATUSES].includes(record.status as any)) {
      existing.total++;
      if ([...PRESENT_STATUSES].includes(record.status as any)) {
        existing.present++;
      }
    }
    dateMap.set(record.date, existing);
  }

  return [...dateMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date,
      total: counts.total,
      attended: counts.present,
      percentage: roundToDefault(calculatePercentage(counts.present, counts.total)),
    }));
}

export function calculateStatistics(input: StatisticsInput): StatisticsResult {
  const { records, subjectId, startDate, endDate } = input;

  let filtered = records;
  if (subjectId) {
    filtered = filtered.filter((r) => r.subjectId === subjectId);
  }
  if (startDate) {
    filtered = filtered.filter((r) => r.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((r) => r.date <= endDate);
  }

  return {
    overall: calculateOverall(filtered),
    bySubject: calculateBySubject(filtered),
    streaks: calculateStreaks(filtered),
    trends: calculateTrends(filtered),
    dailyBreakdown: calculateDailyBreakdown(filtered),
  };
}
