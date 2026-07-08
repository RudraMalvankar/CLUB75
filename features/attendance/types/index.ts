import type { attendanceRecords, subjects } from "@/database/schema";

type AttendanceRecord = typeof attendanceRecords.$inferSelect;
type Subject = typeof subjects.$inferSelect;

export type AttendanceStatus =
  "present" | "absent" | "cancelled" | "medical" | "holiday" | "extraLecture";
export type LectureType = "lecture" | "practical" | "lab" | "theory" | "tutorial";
export type SortOption =
  "percentage" | "alphabetical" | "lastUpdated" | "safeBunks" | "highestRisk";
export type FilterStatus = "all" | "safe" | "warning" | "critical";

export type AttendanceSubject = Subject & {
  attendancePercentage: number;
  safeBunks: number;
  totalLectures: number;
  attended: number;
  missed: number;
  risk: "none" | "low" | "medium" | "high" | "critical";
  lastUpdated: Date | null;
};

export type AttendanceRecordWithSubject = AttendanceRecord & {
  subjectName: string;
  subjectCode: string;
  subjectColor: string;
};

export type AttendanceFormData = {
  subjectId: string;
  status: AttendanceStatus;
  date: string;
  lectureNumber: number | null;
  notes: string | null;
};

export type AttendanceFilter = {
  status: FilterStatus;
  subjectId: string | null;
  dateRange: { start: string; end: string } | null;
  lectureType: LectureType | null;
};

export type AttendanceStats = {
  totalLectures: number;
  attended: number;
  missed: number;
  percentage: number;
  safeBunks: number;
  goalPercentage: number;
};

export type AttendanceScreenState = {
  isLoading: boolean;
  error: string | null;
  subjects: AttendanceSubject[];
  searchQuery: string;
  filter: AttendanceFilter;
  sort: SortOption;
};

export type SubjectDetailState = {
  isLoading: boolean;
  error: string | null;
  subject: AttendanceSubject | null;
  records: AttendanceRecordWithSubject[];
  stats: AttendanceStats;
};

export type HistoryGroup = {
  label: string;
  data: AttendanceRecordWithSubject[];
};

export type AddAttendancePayload = AttendanceFormData;
export type UpdateAttendancePayload = Partial<AttendanceFormData>;
