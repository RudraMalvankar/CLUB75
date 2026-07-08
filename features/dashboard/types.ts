import type { subjects, semesters } from "@/database/schema";

type Subject = typeof subjects.$inferSelect;
type Semester = typeof semesters.$inferSelect;

export type DayOfWeek =
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type DashboardSubject = Subject & {
  attendancePercentage: number;
  safeBunks: number;
  totalLectures: number;
  attended: number;
  missed: number;
};

export type DashboardLecture = {
  id: string;
  subjectName: string;
  subjectCode: string;
  subjectColor: string;
  faculty: string | null;
  room: string | null;
  startTime: string;
  endTime: string;
  lectureType: string;
  attendancePercentage: number;
  status: "upcoming" | "ongoing" | "completed";
};

export type DashboardOverallAttendance = {
  percentage: number;
  totalLectures: number;
  attended: number;
  missed: number;
  safeBunks: number;
  goalPercentage: number;
  currentWeek: number;
  totalWeeks: number;
  status: "safe" | "warning" | "critical";
};

export type DashboardSafeBunk = {
  canBunk: boolean;
  safeBunks: number;
  message: string;
  currentPercentage: number;
  goalPercentage: number;
};

export type DashboardTrend = {
  direction: "improving" | "declining" | "stable";
  weeklyAverage: number;
  changeRate: number;
};

export type DashboardInsight = {
  id: string;
  type: "warning" | "success" | "info" | "danger";
  message: string;
  subjectId?: string;
};

export type DashboardActivity = {
  id: string;
  type: "attendance" | "timetable" | "goal" | "subject";
  message: string;
  timestamp: Date;
  subjectId?: string;
};

export type DashboardState = {
  isLoading: boolean;
  error: string | null;
  semester: Semester | null;
  subjects: DashboardSubject[];
  todayLectures: DashboardLecture[];
  overallAttendance: DashboardOverallAttendance;
  safeBunk: DashboardSafeBunk;
  trend: DashboardTrend;
  insights: DashboardInsight[];
  recentActivity: DashboardActivity[];
  hasData: boolean;
};

export type DashboardAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Omit<DashboardState, "isLoading" | "error"> }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "REFRESH" };
