import { describe, it, expect } from "vitest";
import {
  calculatePrediction,
  predictFuturePercentage,
  calculateBestCase,
  calculateWorstCase,
} from "../calculators/prediction";

describe("calculatePrediction", () => {
  it("returns prediction scenarios", () => {
    const result = calculatePrediction({
      currentPresent: 70,
      currentTotal: 100,
      totalSemesterLectures: 150,
    });
    expect(result.scenarios).toHaveLength(5);
    expect(result.currentPercentage).toBe(70);
  });

  it("best case is highest projection", () => {
    const result = calculatePrediction({
      currentPresent: 70,
      currentTotal: 100,
      totalSemesterLectures: 150,
    });
    expect(result.bestCase).toBeGreaterThanOrEqual(result.expectedCase);
    expect(result.bestCase).toBeGreaterThanOrEqual(result.worstCase);
  });

  it("worst case is lowest projection", () => {
    const result = calculatePrediction({
      currentPresent: 70,
      currentTotal: 100,
      totalSemesterLectures: 150,
    });
    expect(result.worstCase).toBeLessThanOrEqual(result.expectedCase);
    expect(result.worstCase).toBeLessThanOrEqual(result.bestCase);
  });

  it("handles zero total lectures", () => {
    const result = calculatePrediction({
      currentPresent: 0,
      currentTotal: 0,
      totalSemesterLectures: 100,
    });
    expect(result.scenarios).toHaveLength(5);
  });

  it("handles when all lectures completed", () => {
    const result = calculatePrediction({
      currentPresent: 100,
      currentTotal: 100,
      totalSemesterLectures: 100,
    });
    expect(result.bestCase).toBe(100);
    expect(result.worstCase).toBe(100);
    expect(result.expectedCase).toBe(100);
  });

  it("handles totalSemesterLectures less than currentTotal", () => {
    const result = calculatePrediction({
      currentPresent: 100,
      currentTotal: 150,
      totalSemesterLectures: 100,
    });
    expect(result.scenarios).toHaveLength(5);
  });
});

describe("predictFuturePercentage", () => {
  it("predicts percentage with given attendance rate", () => {
    const percentage = predictFuturePercentage(70, 100, 80, 150);
    expect(typeof percentage).toBe("number");
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it("predicts 100% for perfect future attendance", () => {
    const percentage = predictFuturePercentage(100, 100, 100, 150);
    expect(percentage).toBe(100);
  });

  it("predicts lower for zero future attendance", () => {
    const percentage = predictFuturePercentage(70, 100, 0, 150);
    expect(percentage).toBeLessThan(70);
  });
});

describe("calculateBestCase", () => {
  it("returns best case projection", () => {
    const bestCase = calculateBestCase(70, 100, 150);
    expect(typeof bestCase).toBe("number");
    expect(bestCase).toBeGreaterThanOrEqual(70);
  });
});

describe("calculateWorstCase", () => {
  it("returns worst case projection", () => {
    const worstCase = calculateWorstCase(70, 100, 150);
    expect(typeof worstCase).toBe("number");
    expect(worstCase).toBeLessThanOrEqual(70);
  });
});
