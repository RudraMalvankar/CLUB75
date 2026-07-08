import { getDatabase } from "@/database/database";
import {
  AttendanceRepository,
  SubjectRepository,
  SemesterRepository,
} from "@/database/repositories";
import { calculateStatistics } from "@/engine/attendance";
import type {
  AnalyticsDashboard,
  AttendanceSummary,
  SubjectAnalytics,
  AttendanceTrend,
  RiskAnalysis,
  Recommendation,
  DistributionData,
  ConsistencyScore,
  TrendDataPoint,
  AnalyticsFilter,
} from "../types";

function getStatusFromPercentage(
  percentage: number,
): "excellent" | "good" | "safe" | "warning" | "critical" {
  if (percentage >= 90) return "excellent";
  if (percentage >= 80) return "good";
  if (percentage >= 75) return "safe";
  if (percentage >= 70) return "warning";
  return "critical";
}

function getRiskLevel(percentage: number): "none" | "low" | "medium" | "high" | "critical" {
  if (percentage >= 90) return "none";
  if (percentage >= 80) return "low";
  if (percentage >= 75) return "medium";
  if (percentage >= 70) return "high";
  return "critical";
}

function calculateConsistency(dailyPercentages: number[]): ConsistencyScore {
  if (dailyPercentages.length < 2) {
    return {
      score: 100,
      label: "Excellent",
      description: "Not enough data to calculate consistency",
      weeklyStability: 100,
      monthlyStability: 100,
    };
  }

  const mean = dailyPercentages.reduce((a, b) => a + b, 0) / dailyPercentages.length;
  const variance =
    dailyPercentages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    dailyPercentages.length;
  const stdDev = Math.sqrt(variance);
  const score = Math.max(0, Math.min(100, Math.round(100 - stdDev)));

  const weeklyData = dailyPercentages.slice(-7);
  const monthlyData = dailyPercentages.slice(-30);

  const weeklyMean = weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length;
  const weeklyVariance =
    weeklyData.reduce((sum, val) => sum + Math.pow(val - weeklyMean, 2), 0) / weeklyData.length;
  const weeklyStability = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(weeklyVariance))));

  const monthlyMean = monthlyData.reduce((a, b) => a + b, 0) / monthlyData.length;
  const monthlyVariance =
    monthlyData.reduce((sum, val) => sum + Math.pow(val - monthlyMean, 2), 0) / monthlyData.length;
  const monthlyStability = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(monthlyVariance))));

  let label: string;
  let description: string;

  if (score >= 90) {
    label = "Excellent";
    description = "Your attendance has been very consistent";
  } else if (score >= 75) {
    label = "Good";
    description = "Your attendance is fairly consistent";
  } else if (score >= 60) {
    label = "Fair";
    description = "Your attendance varies somewhat";
  } else {
    label = "Poor";
    description = "Your attendance is inconsistent";
  }

  return { score, label, description, weeklyStability, monthlyStability };
}

export class AnalyticsService {
  async getDashboard(filter?: AnalyticsFilter): Promise<AnalyticsDashboard> {
    const db = getDatabase();
    const attendanceRepo = new AttendanceRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const semesterRepo = new SemesterRepository(db);

    const semesters = await semesterRepo.getAll();
    const currentSemester = semesters[0] ?? null;

    if (!currentSemester) {
      return this.getEmptyDashboard();
    }

    const subjects = await subjectRepo.getBySemester(currentSemester.id);
    const allAttendance = await attendanceRepo.getAll({ limit: 10000 });

    let filteredAttendance = allAttendance;
    if (filter?.subjectId) {
      filteredAttendance = filteredAttendance.filter((r) => r.subjectId === filter.subjectId);
    }
    if (filter?.startDate) {
      filteredAttendance = filteredAttendance.filter((r) => r.date >= filter.startDate!);
    }
    if (filter?.endDate) {
      filteredAttendance = filteredAttendance.filter((r) => r.date <= filter.endDate!);
    }

    const statistics = calculateStatistics({ records: filteredAttendance as any });

    const summary = this.buildSummary(statistics, currentSemester);
    const subjectAnalytics = this.buildSubjectAnalytics(statistics.bySubject, subjects);
    const trend = this.buildTrend(statistics.trends, statistics.dailyBreakdown);
    const risks = this.buildRisks(subjectAnalytics);
    const recommendations = this.buildRecommendations(summary, subjectAnalytics);
    const distribution = this.buildDistribution(statistics.overall);
    const consistency = this.buildConsistency(statistics.dailyBreakdown);

    return {
      summary,
      subjects: subjectAnalytics,
      trend,
      risks,
      recommendations,
      distribution,
      consistency,
      isLoading: false,
      error: null,
    };
  }

  private buildSummary(statistics: any, semester: any): AttendanceSummary {
    const { overall, streaks, trends } = statistics;
    const percentage = overall.attendancePercentage;
    const goal = semester.minimumAttendance ?? 75;

    const totalWeeks = Math.ceil(
      (new Date(semester.endDate).getTime() - new Date(semester.startDate).getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    const weeksPassed = Math.ceil(
      (Date.now() - new Date(semester.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    const semesterProgress = Math.min(100, Math.round((weeksPassed / totalWeeks) * 100));

    const safeBunks = Math.max(
      0,
      Math.floor((overall.attended * 100 - goal * overall.totalLectures) / goal),
    );

    const lecturesRequired =
      percentage < goal
        ? Math.ceil((goal * overall.totalLectures - overall.attended * 100) / (100 - goal))
        : 0;

    return {
      overallPercentage: percentage,
      goalPercentage: goal,
      difference: percentage - goal,
      status: getStatusFromPercentage(percentage),
      semesterProgress,
      totalLectures: overall.totalLectures,
      attended: overall.attended,
      missed: overall.missed,
      cancelled: overall.cancelled,
      medical: overall.medical,
      holiday: overall.holiday,
      safeBunks,
      lecturesRequired,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
    };
  }

  private buildSubjectAnalytics(subjectStats: readonly any[], subjects: any[]): SubjectAnalytics[] {
    return subjectStats.map((stat) => {
      const subject = subjects.find((s) => s.id === stat.subjectId);
      const percentage = stat.attendancePercentage;

      return {
        subjectId: stat.subjectId,
        subjectName: subject?.name ?? stat.subjectName,
        subjectColor: subject?.color ?? "#6366F1",
        faculty: subject?.faculty ?? "",
        attendancePercentage: percentage,
        trend: "stable" as const,
        safeBunks: Math.max(0, Math.floor((stat.attended * 100 - 75 * stat.totalLectures) / 75)),
        lecturesRequired:
          percentage < 75
            ? Math.ceil((75 * stat.totalLectures - stat.attended * 100) / (100 - 75))
            : 0,
        weeklyChange: 0,
        riskLevel: getRiskLevel(percentage),
        status: getStatusFromPercentage(percentage),
        totalLectures: stat.totalLectures,
        attended: stat.attended,
        missed: stat.missed,
        credits: subject?.credit ?? 0,
      };
    });
  }

  private buildTrend(trends: any, dailyBreakdown: readonly any[]): AttendanceTrend {
    const dataPoints: TrendDataPoint[] = dailyBreakdown.map((day) => ({
      date: day.date,
      percentage: day.percentage,
      lectures: day.total,
      attended: day.attended,
    }));

    return {
      direction: trends.direction,
      weeklyAverage: trends.weeklyAverage,
      monthlyAverage: trends.monthlyAverage,
      changeRate: trends.changeRate,
      dataPoints,
    };
  }

  private buildRisks(subjects: SubjectAnalytics[]): RiskAnalysis[] {
    return subjects
      .filter((s) => s.riskLevel !== "none")
      .map((subject) => {
        const factors: string[] = [];
        if (subject.attendancePercentage < 75) factors.push("Below minimum attendance");
        if (subject.missed > 3) factors.push("Multiple lectures missed");
        if (subject.riskLevel === "critical") factors.push("Immediate action required");

        let recommendation: string;
        if (subject.riskLevel === "critical") {
          recommendation = `Attend all upcoming ${subject.subjectName} lectures immediately`;
        } else if (subject.riskLevel === "high") {
          recommendation = `Increase ${subject.subjectName} attendance to avoid risk`;
        } else {
          recommendation = `Monitor ${subject.subjectName} attendance closely`;
        }

        return {
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          riskLevel: subject.riskLevel,
          riskScore:
            subject.riskLevel === "critical"
              ? 100
              : subject.riskLevel === "high"
                ? 75
                : subject.riskLevel === "medium"
                  ? 50
                  : 25,
          factors,
          recommendation,
        };
      });
  }

  private buildRecommendations(
    summary: AttendanceSummary,
    subjects: SubjectAnalytics[],
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (summary.lecturesRequired > 0) {
      recommendations.push({
        id: "recover-attendance",
        type: "recover",
        subjectId: null,
        subjectName: null,
        message: `Attend the next ${summary.lecturesRequired} lectures to reach your goal`,
        urgency: "high",
        impact: 100,
      });
    }

    const criticalSubjects = subjects.filter((s) => s.riskLevel === "critical");
    for (const subject of criticalSubjects) {
      recommendations.push({
        id: `critical-${subject.subjectId}`,
        type: "warning",
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        message: `Urgent: ${subject.subjectName} attendance is critical at ${subject.attendancePercentage}%`,
        urgency: "high",
        impact: 100,
      });
    }

    if (summary.safeBunks > 0) {
      recommendations.push({
        id: "safe-bunk",
        type: "bunk",
        subjectId: null,
        subjectName: null,
        message: `You can safely miss ${summary.safeBunks} more lectures`,
        urgency: "low",
        impact: 0,
      });
    }

    const excellentSubjects = subjects.filter((s) => s.status === "excellent");
    for (const subject of excellentSubjects) {
      recommendations.push({
        id: `maintain-${subject.subjectId}`,
        type: "maintain",
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        message: `Great job on ${subject.subjectName}! Keep it up`,
        urgency: "low",
        impact: 0,
      });
    }

    return recommendations;
  }

  private buildDistribution(overall: any): DistributionData {
    return {
      present: overall.attended,
      absent: overall.missed,
      cancelled: overall.cancelled,
      medical: overall.medical,
      holiday: overall.holiday,
      extraLectures: overall.extraLectures,
    };
  }

  private buildConsistency(dailyBreakdown: readonly any[]): ConsistencyScore {
    const dailyPercentages = dailyBreakdown.map((day) => day.percentage);
    return calculateConsistency(dailyPercentages);
  }

  private getEmptyDashboard(): AnalyticsDashboard {
    return {
      summary: {
        overallPercentage: 0,
        goalPercentage: 75,
        difference: -75,
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
      trend: {
        direction: "stable",
        weeklyAverage: 0,
        monthlyAverage: 0,
        changeRate: 0,
        dataPoints: [],
      },
      risks: [],
      recommendations: [],
      distribution: {
        present: 0,
        absent: 0,
        cancelled: 0,
        medical: 0,
        holiday: 0,
        extraLectures: 0,
      },
      consistency: {
        score: 0,
        label: "No Data",
        description: "No attendance data available",
        weeklyStability: 0,
        monthlyStability: 0,
      },
      isLoading: false,
      error: null,
    };
  }
}
