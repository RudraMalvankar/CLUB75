import type { DAY_OF_WEEK_VALUES, LECTURE_TYPE_VALUES } from "@/database/helpers";

export type DayOfWeek = (typeof DAY_OF_WEEK_VALUES)[number];
export type LectureType = (typeof LECTURE_TYPE_VALUES)[number];

export type TimetableDay = {
  readonly day: DayOfWeek;
  readonly label: string;
  readonly lectures: TimetableLecture[];
};

export type TimetableLecture = {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectName: string;
  readonly subjectCode: string;
  readonly subjectColor: string;
  readonly faculty: string | null;
  readonly room: string | null;
  readonly lectureType: LectureType;
  readonly startTime: string;
  readonly endTime: string;
  readonly day: DayOfWeek;
  readonly duration: number;
  readonly isCurrent: boolean;
  readonly isNext: boolean;
  readonly attendancePercentage: number | null;
};

export type TimetableFilters = {
  readonly day?: DayOfWeek;
  readonly lectureType?: LectureType;
  readonly subjectId?: string;
  readonly faculty?: string;
  readonly search?: string;
};

export type TimetableStats = {
  readonly totalSubjects: number;
  readonly totalLecturesPerWeek: number;
  readonly lecturesPerDay: Record<DayOfWeek, number>;
  readonly busiestDay: DayOfWeek | null;
  readonly lightestDay: DayOfWeek | null;
  readonly averageDuration: number;
};

export type LectureFormData = {
  readonly subjectId: string;
  readonly day: DayOfWeek;
  readonly startTime: string;
  readonly endTime: string;
  readonly room: string;
  readonly faculty: string;
  readonly lectureType: LectureType;
  readonly notes: string;
};

export type LectureConflict = {
  readonly type: "overlap" | "duplicate";
  readonly message: string;
  readonly conflictingLectureId?: string;
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const LECTURE_TYPE_LABELS: Record<LectureType, string> = {
  lecture: "Lecture",
  practical: "Practical",
  lab: "Lab",
  theory: "Theory",
  tutorial: "Tutorial",
};

export const ALL_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const WORKING_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
