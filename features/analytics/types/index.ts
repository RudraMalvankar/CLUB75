export type AnalyticsTimeRange = "7days" | "30days" | "semester" | "custom";

export type AnalyticsFilter = {
  readonly subjectId?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly lectureType?: string;
  readonly status?: string;
};

export type AttendanceSummary = {
  readonly overallPercentage: number;
  readonly goalPercentage: number;
  readonly difference: number;
  readonly status: "excellent" | "good" | "safe" | "warning" | "critical";
  readonly semesterProgress: number;
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly cancelled: number;
  readonly medical: number;
  readonly holiday: number;
  readonly safeBunks: number;
  readonly lecturesRequired: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
};

export type SubjectAnalytics = {
  readonly subjectId: string;
  readonly subjectName: string;
  readonly subjectColor: string;
  readonly faculty: string;
  readonly attendancePercentage: number;
  readonly trend: "improving" | "stable" | "declining";
  readonly safeBunks: number;
  readonly lecturesRequired: number;
  readonly weeklyChange: number;
  readonly riskLevel: "none" | "low" | "medium" | "high" | "critical";
  readonly status: "excellent" | "good" | "safe" | "warning" | "critical";
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly credits: number;
};

export type TrendDataPoint = {
  readonly date: string;
  readonly percentage: number;
  readonly lectures: number;
  readonly attended: number;
};

export type AttendanceTrend = {
  readonly direction: "improving" | "stable" | "declining";
  readonly weeklyAverage: number;
  readonly monthlyAverage: number;
  readonly changeRate: number;
  readonly dataPoints: TrendDataPoint[];
};

export type RiskAnalysis = {
  readonly subjectId: string;
  readonly subjectName: string;
  readonly riskLevel: "none" | "low" | "medium" | "high" | "critical";
  readonly riskScore: number;
  readonly factors: string[];
  readonly recommendation: string;
};

export type Recommendation = {
  readonly id: string;
  readonly type: "attend" | "maintain" | "recover" | "warning" | "bunk";
  readonly subjectId: string | null;
  readonly subjectName: string | null;
  readonly message: string;
  readonly urgency: "low" | "medium" | "high";
  readonly impact: number;
};

export type ChartDataPoint = {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
};

export type DistributionData = {
  readonly present: number;
  readonly absent: number;
  readonly cancelled: number;
  readonly medical: number;
  readonly holiday: number;
  readonly extraLectures: number;
};

export type ConsistencyScore = {
  readonly score: number;
  readonly label: string;
  readonly description: string;
  readonly weeklyStability: number;
  readonly monthlyStability: number;
};

export type AnalyticsDashboard = {
  readonly summary: AttendanceSummary;
  readonly subjects: SubjectAnalytics[];
  readonly trend: AttendanceTrend;
  readonly risks: RiskAnalysis[];
  readonly recommendations: Recommendation[];
  readonly distribution: DistributionData;
  readonly consistency: ConsistencyScore;
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const STATUS_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  safe: "Safe",
  warning: "Warning",
  critical: "Critical",
};

export const RISK_LABELS: Record<string, string> = {
  none: "No Risk",
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical",
};

export const TREND_LABELS: Record<string, string> = {
  improving: "Improving",
  stable: "Stable",
  declining: "Declining",
};
