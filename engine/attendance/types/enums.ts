export const AttendanceStatus = {
  Present: "present",
  Absent: "absent",
  Cancelled: "cancelled",
  Medical: "medical",
  Holiday: "holiday",
  ExtraLecture: "extraLecture",
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const AttendanceStatusValues: readonly AttendanceStatus[] = Object.values(
  AttendanceStatus,
) as AttendanceStatus[];

export const AttendanceCategory = {
  Counted: "counted",
  Uncounted: "uncounted",
} as const;

export type AttendanceCategory = (typeof AttendanceCategory)[keyof typeof AttendanceCategory];

export const LectureType = {
  Lecture: "lecture",
  Practical: "practical",
  Lab: "lab",
  Theory: "theory",
  Tutorial: "tutorial",
} as const;

export type LectureType = (typeof LectureType)[keyof typeof LectureType];

export const LectureTypeValues: readonly LectureType[] = Object.values(
  LectureType,
) as LectureType[];

export const DayOfWeek = {
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday",
  Sunday: "sunday",
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export const DayOfWeekValues: readonly DayOfWeek[] = Object.values(DayOfWeek) as DayOfWeek[];

export const GoalScope = {
  Overall: "overall",
  Semester: "semester",
  Subject: "subject",
} as const;

export type GoalScope = (typeof GoalScope)[keyof typeof GoalScope];

export const GoalScopeValues: readonly GoalScope[] = Object.values(GoalScope) as GoalScope[];

export const AttendanceStatusLevel = {
  Excellent: "excellent",
  Good: "good",
  Safe: "safe",
  Warning: "warning",
  Critical: "critical",
} as const;

export type AttendanceStatusLevel =
  (typeof AttendanceStatusLevel)[keyof typeof AttendanceStatusLevel];

export const DayType = {
  WorkingDay: "working_day",
  NonWorkingDay: "non_working_day",
  Holiday: "holiday",
} as const;

export type DayType = (typeof DayType)[keyof typeof DayType];

export const RiskLevel = {
  None: "none",
  Low: "low",
  Medium: "medium",
  High: "high",
  Critical: "critical",
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];
