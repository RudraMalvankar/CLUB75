import type { AttendanceStatus, DayOfWeek, LectureType } from "./enums";

export interface AttendanceRecord {
  readonly id: string;
  readonly subjectId: string;
  readonly date: string;
  readonly status: AttendanceStatus;
  readonly lectureNumber: number;
  readonly remarks: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Subject {
  readonly id: string;
  readonly name: string;
  readonly faculty: string | null;
  readonly credits: number;
  readonly minimumAttendance: number;
  readonly color: string;
  readonly isLab: boolean;
  readonly semesterId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TimetableEntry {
  readonly id: string;
  readonly dayOfWeek: DayOfWeek;
  readonly subjectId: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly room: string | null;
  readonly type: LectureType;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LectureSlot {
  readonly id: string;
  readonly subjectId: string;
  readonly date: string;
  readonly lectureNumber: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly type: LectureType;
  readonly room: string | null;
  readonly isCancelled: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Semester {
  readonly id: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly minimumAttendance: number;
  readonly workingDays: readonly DayOfWeek[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface Goal {
  readonly id: string;
  readonly subjectId: string | null;
  readonly targetPercentage: number;
  readonly scope: "overall" | "semester" | "subject";
  readonly type: "attendance";
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface AttendanceInput {
  readonly records: readonly AttendanceRecord[];
}

export interface SubjectAttendanceInput {
  readonly subjectId: string;
  readonly records: readonly AttendanceRecord[];
  readonly totalLectures: number;
}

export interface SafeBunkInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly goalPercentage?: number;
  readonly futureLectures?: number;
}

export interface GoalInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly goalPercentage?: number;
}

export interface PredictionInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly totalSemesterLectures: number;
}

export interface RecoveryInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly goalPercentage: number;
  readonly totalSemesterLectures: number;
}

export interface SimulationInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly futurePresent: number;
  readonly futureAbsent: number;
}

export interface StatisticsInput {
  readonly records: readonly AttendanceRecord[];
  readonly subjectId?: string;
  readonly startDate?: string;
  readonly endDate?: string;
}

export interface RecommendationInput {
  readonly currentPresent: number;
  readonly currentTotal: number;
  readonly goalPercentage: number;
  readonly totalSemesterLectures: number;
  readonly subjectId?: string;
}
