import { DEFAULT_GOAL_PERCENTAGE, PERCENTAGE_MULTIPLIER } from "../constants";
import type { GoalInput } from "../types/models";
import type { GoalResult } from "../types/results";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

export function calculateGoal(input: GoalInput): GoalResult {
  const { currentPresent, currentTotal, goalPercentage = DEFAULT_GOAL_PERCENTAGE } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeGoal = safeNumber(goalPercentage, DEFAULT_GOAL_PERCENTAGE);

  const currentPercentage = roundToDefault(
    safeDivide(safePresent, safeTotal) * PERCENTAGE_MULTIPLIER,
  );

  // lecturesRequired = consecutive attendances needed to reach goal from current state
  // Formula: (present + x) / (total + x) >= goal/100
  //          100(present + x) >= goal(total + x)
  //          100*present + 100*x >= goal*total + goal*x
  //          x(100 - goal) >= goal*total - 100*present
  //          x >= (goal*total - 100*present) / (100 - goal)
  const lecturesRequired =
    safeGoal < PERCENTAGE_MULTIPLIER
      ? Math.max(
          0,
          Math.ceil(
            (safeGoal * safeTotal - safePresent * PERCENTAGE_MULTIPLIER) /
              (PERCENTAGE_MULTIPLIER - safeGoal),
          ),
        )
      : 0;

  // isAchievable: already at/above goal, or formula says achievable
  const isAchievable = currentPercentage >= safeGoal;

  const needed = lecturesRequired;

  const neededPercentage =
    needed > 0
      ? roundToDefault(safeDivide(needed, safeTotal + needed) * PERCENTAGE_MULTIPLIER)
      : currentPercentage;

  // canMiss = how many more absences before dropping below goal
  const canMiss =
    safeGoal > 0
      ? Math.max(
          0,
          Math.floor((safePresent * PERCENTAGE_MULTIPLIER - safeGoal * safeTotal) / safeGoal),
        )
      : 0;

  return {
    needed,
    neededPercentage,
    canMiss,
    isAchievable,
    currentPercentage,
    goalPercentage: safeGoal,
    lecturesRequired: needed,
    lecturesRemaining: safeTotal,
  };
}

export function calculateGoalFromCounts(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
): GoalResult {
  return calculateGoal({
    currentPresent,
    currentTotal,
    goalPercentage,
  });
}

export function isGoalAchievable(
  currentPresent: number,
  currentTotal: number,
  goalPercentage: number,
): boolean {
  const result = calculateGoal({
    currentPresent,
    currentTotal,
    goalPercentage,
  });
  return result.isAchievable;
}
