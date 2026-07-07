import { describe, it, expect } from "vitest";
import { calculateGoal, calculateGoalFromCounts, isGoalAchievable } from "../calculators/goal";

describe("calculateGoal", () => {
  it("calculates lectures needed to reach goal", () => {
    const result = calculateGoal({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.needed).toBeGreaterThan(0);
    expect(result.isAchievable).toBe(false);
  });

  it("returns 0 needed when already at goal", () => {
    const result = calculateGoal({
      currentPresent: 75,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.needed).toBe(0);
    expect(result.currentPercentage).toBe(75);
    expect(result.isAchievable).toBe(true);
  });

  it("returns 0 needed when above goal", () => {
    const result = calculateGoal({
      currentPresent: 80,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.needed).toBe(0);
    expect(result.isAchievable).toBe(true);
  });

  it("handles zero total", () => {
    const result = calculateGoal({
      currentPresent: 0,
      currentTotal: 0,
      goalPercentage: 75,
    });
    expect(result.currentPercentage).toBe(0);
    expect(result.isAchievable).toBe(false);
  });

  it("uses default goal of 75", () => {
    const result = calculateGoal({
      currentPresent: 70,
      currentTotal: 100,
    });
    expect(result.goalPercentage).toBe(75);
  });

  it("calculates canMiss correctly", () => {
    // 90/100, goal 75. canMiss = floor((90*100 - 75*100)/75) = floor(1500/75) = 20
    const result = calculateGoal({
      currentPresent: 90,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.canMiss).toBe(20);
  });

  it("returns 0 canMiss when below goal", () => {
    const result = calculateGoal({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.canMiss).toBe(0);
  });
});

describe("calculateGoalFromCounts", () => {
  it("works with raw counts", () => {
    const result = calculateGoalFromCounts(70, 100, 75);
    expect(result.needed).toBeGreaterThan(0);
  });
});

describe("isGoalAchievable", () => {
  it("returns false when below goal", () => {
    expect(isGoalAchievable(70, 100, 75)).toBe(false);
  });

  it("returns true when already at goal", () => {
    expect(isGoalAchievable(75, 100, 75)).toBe(true);
  });

  it("returns true when above goal", () => {
    expect(isGoalAchievable(80, 100, 75)).toBe(true);
  });
});
