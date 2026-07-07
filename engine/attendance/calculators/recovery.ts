import { DEFAULT_GOAL_PERCENTAGE, PERCENTAGE_MULTIPLIER } from "../constants";
import type { RecoveryInput } from "../types/models";
import type { RecoveryResult } from "../types/results";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

export function calculateRecovery(input: RecoveryInput): RecoveryResult {
  const {
    currentPresent,
    currentTotal,
    goalPercentage = DEFAULT_GOAL_PERCENTAGE,
    totalSemesterLectures,
  } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeGoal = safeNumber(goalPercentage, DEFAULT_GOAL_PERCENTAGE);
  const safeSemester = safeNumber(totalSemesterLectures, 0);

  const currentPercentage = roundToDefault(
    safeDivide(safePresent, safeTotal) * PERCENTAGE_MULTIPLIER,
  );

  const lecturesRemaining = Math.max(0, safeSemester - safeTotal);

  const lecturesNeeded = Math.ceil(
    (safeGoal * safeTotal - safePresent * PERCENTAGE_MULTIPLIER) /
      (PERCENTAGE_MULTIPLIER - safeGoal),
  );

  const isRecoverable = lecturesNeeded <= lecturesRemaining && lecturesNeeded > 0;

  const consecutiveRequired = isRecoverable ? lecturesNeeded : 0;

  const maximumPossible = roundToDefault(
    safeDivide(safePresent + lecturesRemaining, safeSemester) * PERCENTAGE_MULTIPLIER,
  );

  return {
    lecturesNeeded: Math.max(0, lecturesNeeded),
    consecutiveRequired,
    isRecoverable,
    currentPercentage,
    goalPercentage: safeGoal,
    lecturesRemaining,
    maximumPossible,
  };
}

export function calculateRecoveryFromCounts(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
  totalSemesterLectures: number,
): RecoveryResult {
  return calculateRecovery({
    currentPresent,
    currentTotal,
    goalPercentage,
    totalSemesterLectures,
  });
}

export function isRecoverable(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
  totalSemesterLectures: number,
): boolean {
  const result = calculateRecovery({
    currentPresent,
    currentTotal,
    goalPercentage,
    totalSemesterLectures,
  });
  return result.isRecoverable;
}
