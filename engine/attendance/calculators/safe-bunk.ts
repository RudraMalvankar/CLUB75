import { DEFAULT_GOAL_PERCENTAGE, PERCENTAGE_MULTIPLIER } from "../constants";
import type { SafeBunkInput } from "../types/models";
import type { SafeBunkResult } from "../types/results";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

export function calculateSafeBunks(input: SafeBunkInput): SafeBunkResult {
  const {
    currentPresent,
    currentTotal,
    goalPercentage = DEFAULT_GOAL_PERCENTAGE,
    futureLectures = 0,
  } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeGoal = safeNumber(goalPercentage, DEFAULT_GOAL_PERCENTAGE);
  const safeFuture = safeNumber(futureLectures, 0);

  const currentPercentage = roundToDefault(
    safeDivide(safePresent, safeTotal) * PERCENTAGE_MULTIPLIER,
  );

  const isAtGoal = currentPercentage >= safeGoal;
  const isAboveGoal = currentPercentage > safeGoal;

  // safeBunks = how many more lectures can be missed without dropping below goal
  // Formula: present / (total + b) >= goal/100
  //          present * 100 >= goal * (total + b)
  //          b <= (present * 100 - goal * total) / goal
  const safeBunks =
    safeGoal > 0
      ? Math.max(
          0,
          Math.floor((safePresent * PERCENTAGE_MULTIPLIER - safeGoal * safeTotal) / safeGoal),
        )
      : 0;

  // maxBunks = safe bunks considering future lectures already planned
  const maxBunks =
    safeGoal > 0 && safeTotal + safeFuture > 0
      ? Math.max(
          0,
          Math.floor(
            (safePresent * PERCENTAGE_MULTIPLIER - safeGoal * (safeTotal + safeFuture)) / safeGoal,
          ),
        )
      : 0;

  // lecturesUntilDanger = how many consecutive absences before dropping below goal
  // This is the same as safeBunks (from current position)
  const lecturesUntilDanger = safeBunks;

  return {
    safeBunks,
    maxBunks,
    currentPercentage,
    goalPercentage: safeGoal,
    lecturesUntilDanger,
    isAtGoal,
    isAboveGoal,
  };
}

export function calculateSafeBunksWithGoal(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
): number {
  const result = calculateSafeBunks({
    currentPresent,
    currentTotal,
    goalPercentage,
  });
  return result.safeBunks;
}

export function calculateMaxBunks(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
): number {
  const result = calculateSafeBunks({
    currentPresent,
    currentTotal,
    goalPercentage,
  });
  return result.maxBunks;
}
