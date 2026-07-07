import { DEFAULT_GOAL_PERCENTAGE, STATUS_LEVEL_THRESHOLDS } from "../constants";
import type { RecommendationInput } from "../types/models";
import type { RecommendationResult, RecommendationAction } from "../types/results";
import { RiskLevel } from "../types/enums";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

function getRiskLevel(percentage: number): RiskLevel {
  if (percentage >= 90) return RiskLevel.None;
  if (percentage >= 80) return RiskLevel.Low;
  if (percentage >= 75) return RiskLevel.Medium;
  if (percentage >= 70) return RiskLevel.High;
  return RiskLevel.Critical;
}

export function calculateRecommendations(input: RecommendationInput): RecommendationResult {
  const {
    currentPresent,
    currentTotal,
    goalPercentage = DEFAULT_GOAL_PERCENTAGE,
    totalSemesterLectures,
    subjectId,
  } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeGoal = safeNumber(goalPercentage, DEFAULT_GOAL_PERCENTAGE);
  const safeSemester = safeNumber(totalSemesterLectures, 0);

  const currentPercentage = roundToDefault(safeDivide(safePresent, safeTotal) * 100);

  const actions: RecommendationAction[] = [];

  const overallRisk = getRiskLevel(currentPercentage);

  const lecturesRemaining = Math.max(0, safeSemester - safeTotal);

  if (currentPercentage < safeGoal) {
    const lecturesNeeded = Math.ceil((safeGoal * safeTotal - safePresent * 100) / (100 - safeGoal));

    if (lecturesNeeded <= lecturesRemaining) {
      actions.push({
        type: "recover",
        subjectId: subjectId ?? null,
        subjectName: subjectId ?? null,
        message: `Attend the next ${lecturesNeeded} lectures to recover your attendance`,
        impact: roundToDefault(safeDivide(lecturesNeeded, lecturesRemaining) * 100),
        urgency: "high",
      });
    } else {
      actions.push({
        type: "warning",
        subjectId: subjectId ?? null,
        subjectName: subjectId ?? null,
        message: `Cannot recover attendance. Need ${lecturesNeeded} but only ${lecturesRemaining} remaining`,
        impact: 100,
        urgency: "high",
      });
    }
  } else {
    const safeBunks = Math.max(
      0,
      Math.floor((safePresent * 100 - safeGoal * safeTotal) / safeGoal),
    );

    if (safeBunks > 0) {
      actions.push({
        type: "bunk",
        subjectId: subjectId ?? null,
        subjectName: subjectId ?? null,
        message: `You can safely miss up to ${safeBunks} lectures`,
        impact: roundToDefault(safeDivide(safeBunks, lecturesRemaining) * 100),
        urgency: "low",
      });
    }

    actions.push({
      type: "maintain",
      subjectId: subjectId ?? null,
      subjectName: subjectId ?? null,
      message: "Keep maintaining your current attendance",
      impact: 0,
      urgency: "low",
    });
  }

  if (currentPercentage >= STATUS_LEVEL_THRESHOLDS.excellent) {
    actions.push({
      type: "maintain",
      subjectId: subjectId ?? null,
      subjectName: subjectId ?? null,
      message: "Excellent attendance! Keep it up",
      impact: 0,
      urgency: "low",
    });
  }

  const priorityActions = actions
    .filter((a) => a.urgency === "high")
    .sort((a, b) => b.impact - a.impact);

  const summary = buildSummary(currentPercentage, safeGoal, overallRisk, actions);

  return {
    actions,
    overallRisk,
    summary,
    priorityActions,
  };
}

function buildSummary(
  currentPercentage: number,
  goalPercentage: number,
  risk: RiskLevel,
  actions: readonly RecommendationAction[],
): string {
  if (risk === RiskLevel.Critical) {
    return `Critical: Your attendance is ${currentPercentage}% which is below ${goalPercentage}%. Immediate action required.`;
  }
  if (risk === RiskLevel.High) {
    return `Warning: Your attendance is ${currentPercentage}%. You need to attend more lectures to reach ${goalPercentage}%.`;
  }
  if (risk === RiskLevel.Medium) {
    return `Safe: Your attendance is ${currentPercentage}%. You're at the minimum goal of ${goalPercentage}%.`;
  }
  if (risk === RiskLevel.Low) {
    return `Good: Your attendance is ${currentPercentage}%. You have some buffer above ${goalPercentage}%.`;
  }
  return `Excellent: Your attendance is ${currentPercentage}%. You're doing great!`;
}
