import { STATUS_LEVEL_THRESHOLDS } from "../constants";
import type { SimulationInput } from "../types/models";
import type { SimulationResult } from "../types/results";
import { AttendanceStatusLevel } from "../types/enums";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

function getStatusLevel(percentage: number): AttendanceStatusLevel {
  if (percentage >= STATUS_LEVEL_THRESHOLDS.excellent) return AttendanceStatusLevel.Excellent;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.good) return AttendanceStatusLevel.Good;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.safe) return AttendanceStatusLevel.Safe;
  if (percentage >= STATUS_LEVEL_THRESHOLDS.warning) return AttendanceStatusLevel.Warning;
  return AttendanceStatusLevel.Critical;
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const { currentPresent, currentTotal, futurePresent, futureAbsent } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeFuturePresent = safeNumber(futurePresent, 0);
  const safeFutureAbsent = safeNumber(futureAbsent, 0);

  const originalPercentage = roundToDefault(safeDivide(safePresent, safeTotal) * 100);

  const newTotal = safeTotal + safeFuturePresent + safeFutureAbsent;
  const newPresent = safePresent + safeFuturePresent;

  const simulatedPercentage = roundToDefault(safeDivide(newPresent, newTotal) * 100);

  const change = roundToDefault(simulatedPercentage - originalPercentage);

  return {
    originalPercentage,
    simulatedPercentage,
    change,
    newStatusLevel: getStatusLevel(simulatedPercentage),
    originalStatusLevel: getStatusLevel(originalPercentage),
    isImprovement: change > 0,
    totalPresent: newPresent,
    totalLectures: newTotal,
  };
}

export function simulateFutureAttendance(
  currentPresent: number,
  currentTotal: number,
  futurePresent: number,
  futureAbsent: number,
): SimulationResult {
  return calculateSimulation({
    currentPresent,
    currentTotal,
    futurePresent,
    futureAbsent,
  });
}
