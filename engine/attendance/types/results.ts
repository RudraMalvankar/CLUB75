import type {
  AttendanceCategory,
  AttendanceStatus,
  AttendanceStatusLevel,
  RiskLevel,
} from "./enums";

export interface AttendanceResult {
  readonly percentage: number;
  readonly present: number;
  readonly total: number;
  readonly absent: number;
  readonly category: AttendanceCategory;
  readonly statusLevel: AttendanceStatusLevel;
}

export interface SafeBunkResult {
  readonly safeBunks: number;
  readonly maxBunks: number;
  readonly currentPercentage: number;
  readonly goalPercentage: number;
  readonly lecturesUntilDanger: number;
  readonly isAtGoal: boolean;
  readonly isAboveGoal: boolean;
}

export interface GoalResult {
  readonly needed: number;
  readonly neededPercentage: number;
  readonly canMiss: number;
  readonly isAchievable: boolean;
  readonly currentPercentage: number;
  readonly goalPercentage: number;
  readonly lecturesRequired: number;
  readonly lecturesRemaining: number;
}

export interface PredictionResult {
  readonly bestCase: number;
  readonly worstCase: number;
  readonly expectedCase: number;
  readonly currentPercentage: number;
  readonly totalLectures: number;
  readonly scenarios: readonly PredictionScenario[];
}

export interface PredictionScenario {
  readonly label: string;
  readonly attendanceRate: number;
  readonly projectedPercentage: number;
}

export interface RecoveryResult {
  readonly lecturesNeeded: number;
  readonly consecutiveRequired: number;
  readonly isRecoverable: boolean;
  readonly currentPercentage: number;
  readonly goalPercentage: number;
  readonly lecturesRemaining: number;
  readonly maximumPossible: number;
}

export interface StatisticsResult {
  readonly overall: OverallStatistics;
  readonly bySubject: readonly SubjectStatistics[];
  readonly streaks: StreakResult;
  readonly trends: TrendResult;
  readonly dailyBreakdown: readonly DailyStatistic[];
}

export interface OverallStatistics {
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly cancelled: number;
  readonly medical: number;
  readonly holiday: number;
  readonly extraLectures: number;
  readonly attendancePercentage: number;
  readonly averageDailyAttendance: number;
}

export interface SubjectStatistics {
  readonly subjectId: string;
  readonly subjectName: string;
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly attendancePercentage: number;
  readonly statusLevel: AttendanceStatusLevel;
  readonly risk: RiskLevel;
  readonly credits: number;
}

export interface StreakResult {
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly currentAbsentStreak: number;
  readonly longestAbsentStreak: number;
}

export interface TrendResult {
  readonly direction: "improving" | "declining" | "stable";
  readonly weeklyAverage: number;
  readonly monthlyAverage: number;
  readonly changeRate: number;
}

export interface DailyStatistic {
  readonly date: string;
  readonly total: number;
  readonly attended: number;
  readonly percentage: number;
}

export interface RecommendationResult {
  readonly actions: readonly RecommendationAction[];
  readonly overallRisk: RiskLevel;
  readonly summary: string;
  readonly priorityActions: readonly RecommendationAction[];
}

export interface RecommendationAction {
  readonly type: "attend" | "bunk" | "recover" | "maintain" | "warning";
  readonly subjectId: string | null;
  readonly subjectName: string | null;
  readonly message: string;
  readonly impact: number;
  readonly urgency: "high" | "medium" | "low";
}

export interface SimulationResult {
  readonly originalPercentage: number;
  readonly simulatedPercentage: number;
  readonly change: number;
  readonly newStatusLevel: AttendanceStatusLevel;
  readonly originalStatusLevel: AttendanceStatusLevel;
  readonly isImprovement: boolean;
  readonly totalPresent: number;
  readonly totalLectures: number;
}
