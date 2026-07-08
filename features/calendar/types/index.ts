import type { DayOfWeek } from "@/database/helpers";
import type { AttendanceStatus } from "@/database/schema/attendance";

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarEventType =
  "lecture" | "lab" | "tutorial" | "holiday" | "exam" | "assignment" | "reminder" | "semester";

export type CalendarEventColor = {
  readonly present: string;
  readonly absent: string;
  readonly cancelled: string;
  readonly medical: string;
  readonly holiday: string;
  readonly extraLecture: string;
  readonly lecture: string;
  readonly lab: string;
  readonly tutorial: string;
  readonly exam: string;
  readonly assignment: string;
  readonly reminder: string;
  readonly semester: string;
};

export type CalendarDay = {
  readonly date: string;
  readonly dayOfMonth: number;
  readonly dayOfWeek: DayOfWeek;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly events: CalendarEvent[];
  readonly attendanceSummary: AttendanceSummary | null;
};

export type CalendarWeek = {
  readonly startDate: string;
  readonly endDate: string;
  readonly days: CalendarDay[];
};

export type CalendarMonth = {
  readonly year: number;
  readonly month: number;
  readonly name: string;
  readonly weeks: CalendarWeek[];
  readonly totalDays: number;
};

export type CalendarEvent = {
  readonly id: string;
  readonly type: CalendarEventType;
  readonly title: string;
  readonly subjectId: string | null;
  readonly subjectName: string | null;
  readonly subjectColor: string | null;
  readonly date: string;
  readonly startTime: string | null;
  readonly endTime: string | null;
  readonly room: string | null;
  readonly faculty: string | null;
  readonly lectureType: string | null;
  readonly status: AttendanceStatus | null;
  readonly notes: string | null;
  readonly attendanceId: string | null;
  readonly timetableEntryId: string | null;
  readonly lectureSlotId: string | null;
};

export type AttendanceSummary = {
  readonly date: string;
  readonly totalLectures: number;
  readonly present: number;
  readonly absent: number;
  readonly cancelled: number;
  readonly medical: number;
  readonly holiday: number;
  readonly extraLecture: number;
  readonly attendancePercentage: number;
};

export type CalendarDaySummary = {
  readonly date: string;
  readonly dayOfWeek: DayOfWeek;
  readonly totalEvents: number;
  readonly lectures: number;
  readonly attendance: AttendanceSummary | null;
  readonly events: CalendarEvent[];
};

export type CalendarMonthSummary = {
  readonly year: number;
  readonly month: number;
  readonly totalLectures: number;
  readonly totalPresent: number;
  readonly totalAbsent: number;
  readonly totalCancelled: number;
  readonly totalMedical: number;
  readonly totalHoliday: number;
  readonly attendancePercentage: number;
  readonly workingDays: number;
};

export type CalendarWeekSummary = {
  readonly startDate: string;
  readonly endDate: string;
  readonly totalLectures: number;
  readonly totalPresent: number;
  readonly totalAbsent: number;
  readonly attendancePercentage: number;
  readonly bestDay: string | null;
  readonly worstDay: string | null;
};

export type AgendaItem = {
  readonly date: string;
  readonly events: CalendarEvent[];
  readonly summary: AttendanceSummary | null;
};

export type CalendarFilter = {
  readonly subjectIds: readonly string[];
  readonly eventTypes: readonly CalendarEventType[];
  readonly statuses: readonly AttendanceStatus[];
};

export type CalendarNavigation = {
  readonly currentDate: Date;
  readonly selectedDate: string | null;
  readonly view: CalendarView;
};

export const CALENDAR_EVENT_COLORS: CalendarEventColor = {
  present: "#22C55E",
  absent: "#EF4444",
  cancelled: "#A855F7",
  medical: "#EAB308",
  holiday: "#6B7280",
  extraLecture: "#3B82F6",
  lecture: "#6366F1",
  lab: "#EC4899",
  tutorial: "#14B8A6",
  exam: "#F97316",
  assignment: "#8B5CF6",
  reminder: "#06B6D4",
  semester: "#64748B",
};

export const DEFAULT_CALENDAR_FILTER: CalendarFilter = {
  subjectIds: [],
  eventTypes: [],
  statuses: [],
};
