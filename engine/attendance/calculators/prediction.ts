import { PERCENTAGE_MULTIPLIER } from "../constants";
import type { PredictionInput } from "../types/models";
import type { PredictionResult, PredictionScenario } from "../types/results";
import { roundToDefault, safeDivide } from "../helpers/math";
import { safeNumber } from "../helpers/validation";

interface ScenarioTemplate {
  readonly label: string;
  readonly attendanceRate: number;
}

const SCENARIOS: readonly ScenarioTemplate[] = [
  { label: "Best Case (100%)", attendanceRate: 100 },
  { label: "Good (90%)", attendanceRate: 90 },
  { label: "Average (80%)", attendanceRate: 80 },
  { label: "Poor (70%)", attendanceRate: 70 },
  { label: "Worst Case (0%)", attendanceRate: 0 },
];

export function calculatePrediction(input: PredictionInput): PredictionResult {
  const { currentPresent, currentTotal, totalSemesterLectures } = input;

  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeSemester = safeNumber(totalSemesterLectures, 0);

  const currentPercentage = roundToDefault(
    safeDivide(safePresent, safeTotal) * PERCENTAGE_MULTIPLIER,
  );

  const futureLectures = Math.max(0, safeSemester - safeTotal);

  const scenarios: PredictionScenario[] = SCENARIOS.map((scenario) => {
    const futurePresent = Math.round(
      futureLectures * (scenario.attendanceRate / PERCENTAGE_MULTIPLIER),
    );
    const totalPresent = safePresent + futurePresent;
    const projectedPercentage = roundToDefault(
      safeDivide(totalPresent, safeSemester) * PERCENTAGE_MULTIPLIER,
    );
    return {
      ...scenario,
      projectedPercentage,
    };
  });

  const bestCase = scenarios[0]?.projectedPercentage ?? currentPercentage;
  const worstCase = scenarios[4]?.projectedPercentage ?? currentPercentage;
  const expectedCase = scenarios[2]?.projectedPercentage ?? currentPercentage;

  return {
    bestCase,
    worstCase,
    expectedCase,
    currentPercentage,
    totalLectures: safeSemester,
    scenarios,
  };
}

export function predictFuturePercentage(
  currentPresent: number,
  currentTotal: number,
  futureAttendanceRate: number,
  totalSemesterLectures: number,
): number {
  const safePresent = safeNumber(currentPresent, 0);
  const safeTotal = safeNumber(currentTotal, 0);
  const safeRate = safeNumber(futureAttendanceRate, 0);
  const safeSemester = safeNumber(totalSemesterLectures, 0);

  const futureLectures = Math.max(0, safeSemester - safeTotal);
  const futurePresent = Math.round(futureLectures * (safeRate / PERCENTAGE_MULTIPLIER));

  return roundToDefault(
    safeDivide(safePresent + futurePresent, safeSemester) * PERCENTAGE_MULTIPLIER,
  );
}

export function calculateBestCase(
  currentPresent: number,
  currentTotal: number,
  totalSemesterLectures: number,
): number {
  return predictFuturePercentage(currentPresent, currentTotal, 100, totalSemesterLectures);
}

export function calculateWorstCase(
  currentPresent: number,
  currentTotal: number,
  totalSemesterLectures: number,
): number {
  return predictFuturePercentage(currentPresent, currentTotal, 0, totalSemesterLectures);
}
