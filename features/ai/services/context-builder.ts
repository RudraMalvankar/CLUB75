import type {
  AIContext,
  AIAttendanceContext,
  AISubjectContext,
  AISemesterContext,
  AIAnalyticsContext,
} from "@/features/ai/types";
import type {
  AttendanceSummary,
  SubjectAnalytics,
  RiskAnalysis,
  Recommendation,
  ConsistencyScore,
  DistributionData,
} from "@/features/analytics/types";

export function buildAttendanceContext(data: { summary: AttendanceSummary }): AIAttendanceContext {
  return {
    overallPercentage: data.summary.overallPercentage,
    goalPercentage: data.summary.goalPercentage,
    safeBunks: data.summary.safeBunks,
    lecturesRequired: data.summary.lecturesRequired,
    status: data.summary.status,
    currentStreak: data.summary.currentStreak,
    longestStreak: data.summary.longestStreak,
  };
}

export function buildSubjectContext(subjects: readonly SubjectAnalytics[]): AISubjectContext[] {
  return subjects.map((s) => ({
    subjectId: s.subjectId,
    subjectName: s.subjectName,
    attendancePercentage: s.attendancePercentage,
    riskLevel: s.riskLevel,
    safeBunks: s.safeBunks,
    trend: s.trend,
    status: s.status,
    credits: s.credits,
  }));
}

export function buildSemesterContext(data: {
  semesterName: string;
  totalLectures: number;
  attended: number;
  missed: number;
  progress: number;
  daysRemaining: number;
}): AISemesterContext {
  return {
    semesterName: data.semesterName,
    totalLectures: data.totalLectures,
    attended: data.attended,
    missed: data.missed,
    progress: data.progress,
    daysRemaining: data.daysRemaining,
  };
}

export function buildAnalyticsContext(data: {
  summary: AttendanceSummary;
  subjects: readonly SubjectAnalytics[];
  risks: readonly RiskAnalysis[];
  recommendations: readonly Recommendation[];
  consistency: ConsistencyScore;
  distribution: DistributionData;
}): AIAnalyticsContext {
  return {
    summary: data.summary,
    subjects: data.subjects,
    risks: data.risks,
    recommendations: data.recommendations,
    consistency: data.consistency,
    distribution: data.distribution,
  };
}

export function buildFullContext(data: {
  summary: AttendanceSummary;
  subjects: readonly SubjectAnalytics[];
  semesterName: string;
  totalLectures: number;
  attended: number;
  missed: number;
  progress: number;
  daysRemaining: number;
  risks: readonly RiskAnalysis[];
  recommendations: readonly Recommendation[];
  consistency: ConsistencyScore;
  distribution: DistributionData;
}): AIContext {
  return {
    attendance: buildAttendanceContext({ summary: data.summary }),
    subjects: buildSubjectContext(data.subjects),
    semester: buildSemesterContext({
      semesterName: data.semesterName,
      totalLectures: data.totalLectures,
      attended: data.attended,
      missed: data.missed,
      progress: data.progress,
      daysRemaining: data.daysRemaining,
    }),
    analytics: buildAnalyticsContext({
      summary: data.summary,
      subjects: data.subjects,
      risks: data.risks,
      recommendations: data.recommendations,
      consistency: data.consistency,
      distribution: data.distribution,
    }),
    timestamp: Date.now(),
  };
}

export function getEmptyContext(): AIContext {
  return {
    attendance: {
      overallPercentage: 0,
      goalPercentage: 85,
      safeBunks: 0,
      lecturesRequired: 0,
      status: "critical",
      currentStreak: 0,
      longestStreak: 0,
    },
    subjects: [],
    semester: {
      semesterName: "No Semester",
      totalLectures: 0,
      attended: 0,
      missed: 0,
      progress: 0,
      daysRemaining: 0,
    },
    analytics: {
      summary: {
        overallPercentage: 0,
        goalPercentage: 85,
        difference: -85,
        status: "critical",
        semesterProgress: 0,
        totalLectures: 0,
        attended: 0,
        missed: 0,
        cancelled: 0,
        medical: 0,
        holiday: 0,
        safeBunks: 0,
        lecturesRequired: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      subjects: [],
      risks: [],
      recommendations: [],
      consistency: {
        score: 0,
        label: "No Data",
        description: "No attendance data available",
        weeklyStability: 0,
        monthlyStability: 0,
      },
      distribution: {
        present: 0,
        absent: 0,
        cancelled: 0,
        medical: 0,
        holiday: 0,
        extraLectures: 0,
      },
    },
    timestamp: Date.now(),
  };
}
