import { describe, it, expect } from "vitest";

import {
  buildAttendanceContext,
  buildSubjectContext,
  buildSemesterContext,
  buildAnalyticsContext,
  buildFullContext,
  getEmptyContext,
} from "@/features/ai/services/context-builder";
import type {
  AttendanceSummary,
  SubjectAnalytics,
  RiskAnalysis,
  Recommendation,
  ConsistencyScore,
  DistributionData,
} from "@/features/analytics/types";

const mockSummary: AttendanceSummary = {
  overallPercentage: 75,
  goalPercentage: 85,
  difference: -10,
  status: "warning",
  semesterProgress: 60,
  totalLectures: 100,
  attended: 75,
  missed: 20,
  cancelled: 3,
  medical: 1,
  holiday: 1,
  safeBunks: 5,
  lecturesRequired: 10,
  currentStreak: 3,
  longestStreak: 7,
};

const mockSubjects: SubjectAnalytics[] = [
  {
    subjectId: "1",
    subjectName: "Mathematics",
    subjectColor: "#FF0000",
    faculty: "Dr. Smith",
    attendancePercentage: 80,
    trend: "stable",
    safeBunks: 3,
    lecturesRequired: 2,
    weeklyChange: 0,
    riskLevel: "low",
    status: "good",
    totalLectures: 30,
    attended: 24,
    missed: 6,
    credits: 4,
  },
  {
    subjectId: "2",
    subjectName: "Physics",
    subjectColor: "#00FF00",
    faculty: "Dr. Jones",
    attendancePercentage: 60,
    trend: "declining",
    safeBunks: 0,
    lecturesRequired: 8,
    weeklyChange: -5,
    riskLevel: "high",
    status: "warning",
    totalLectures: 30,
    attended: 18,
    missed: 12,
    credits: 3,
  },
];

const mockRisks: RiskAnalysis[] = [
  {
    subjectId: "2",
    subjectName: "Physics",
    riskLevel: "high",
    riskScore: 80,
    factors: ["Declining trend", "Low attendance"],
    recommendation: "Attend all remaining lectures",
  },
];

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "attend",
    subjectId: "2",
    subjectName: "Physics",
    message: "Attend Physics lectures immediately",
    urgency: "high",
    impact: 15,
  },
];

const mockConsistency: ConsistencyScore = {
  score: 70,
  label: "Good",
  description: "Consistent attendance",
  weeklyStability: 0.8,
  monthlyStability: 0.7,
};

const mockDistribution: DistributionData = {
  present: 75,
  absent: 20,
  cancelled: 3,
  medical: 1,
  holiday: 1,
  extraLectures: 0,
};

describe("Context Builder", () => {
  describe("buildAttendanceContext", () => {
    it("should build attendance context from summary", () => {
      const context = buildAttendanceContext({ summary: mockSummary });

      expect(context.overallPercentage).toBe(75);
      expect(context.goalPercentage).toBe(85);
      expect(context.safeBunks).toBe(5);
      expect(context.lecturesRequired).toBe(10);
      expect(context.status).toBe("warning");
      expect(context.currentStreak).toBe(3);
      expect(context.longestStreak).toBe(7);
    });
  });

  describe("buildSubjectContext", () => {
    it("should build subject context from analytics", () => {
      const context = buildSubjectContext(mockSubjects);

      expect(context).toHaveLength(2);
      expect(context[0].subjectName).toBe("Mathematics");
      expect(context[0].attendancePercentage).toBe(80);
      expect(context[0].riskLevel).toBe("low");
      expect(context[1].subjectName).toBe("Physics");
      expect(context[1].riskLevel).toBe("high");
    });
  });

  describe("buildSemesterContext", () => {
    it("should build semester context", () => {
      const context = buildSemesterContext({
        semesterName: "Fall 2024",
        totalLectures: 100,
        attended: 75,
        missed: 20,
        progress: 60,
        daysRemaining: 30,
      });

      expect(context.semesterName).toBe("Fall 2024");
      expect(context.totalLectures).toBe(100);
      expect(context.attended).toBe(75);
      expect(context.missed).toBe(20);
      expect(context.progress).toBe(60);
      expect(context.daysRemaining).toBe(30);
    });
  });

  describe("buildAnalyticsContext", () => {
    it("should build analytics context", () => {
      const context = buildAnalyticsContext({
        summary: mockSummary,
        subjects: mockSubjects,
        risks: mockRisks,
        recommendations: mockRecommendations,
        consistency: mockConsistency,
        distribution: mockDistribution,
      });

      expect(context.summary).toEqual(mockSummary);
      expect(context.subjects).toEqual(mockSubjects);
      expect(context.risks).toEqual(mockRisks);
      expect(context.recommendations).toEqual(mockRecommendations);
      expect(context.consistency).toEqual(mockConsistency);
      expect(context.distribution).toEqual(mockDistribution);
    });
  });

  describe("buildFullContext", () => {
    it("should build complete AI context", () => {
      const context = buildFullContext({
        summary: mockSummary,
        subjects: mockSubjects,
        semesterName: "Fall 2024",
        totalLectures: 100,
        attended: 75,
        missed: 20,
        progress: 60,
        daysRemaining: 30,
        risks: mockRisks,
        recommendations: mockRecommendations,
        consistency: mockConsistency,
        distribution: mockDistribution,
      });

      expect(context.attendance.overallPercentage).toBe(75);
      expect(context.subjects).toHaveLength(2);
      expect(context.semester.semesterName).toBe("Fall 2024");
      expect(context.analytics.recommendations).toHaveLength(1);
      expect(context.timestamp).toBeGreaterThan(0);
    });
  });

  describe("getEmptyContext", () => {
    it("should return empty context with defaults", () => {
      const context = getEmptyContext();

      expect(context.attendance.overallPercentage).toBe(0);
      expect(context.attendance.goalPercentage).toBe(85);
      expect(context.attendance.status).toBe("critical");
      expect(context.subjects).toEqual([]);
      expect(context.semester.semesterName).toBe("No Semester");
    });
  });
});
