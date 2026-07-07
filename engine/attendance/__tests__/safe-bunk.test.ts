import { describe, it, expect } from "vitest";
import {
  calculateSafeBunks,
  calculateSafeBunksWithGoal,
  calculateMaxBunks,
} from "../calculators/safe-bunk";

describe("calculateSafeBunks", () => {
  it("calculates safe bunks when above goal", () => {
    // 80/100 = 80%, goal 75%. Safe to miss: floor((80*100 - 75*100)/75) = floor(500/75) = 6
    const result = calculateSafeBunks({
      currentPresent: 80,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.safeBunks).toBe(6);
    expect(result.isAtGoal).toBe(true);
    expect(result.isAboveGoal).toBe(true);
  });

  it("returns 0 safe bunks when at goal", () => {
    const result = calculateSafeBunks({
      currentPresent: 75,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.safeBunks).toBe(0);
    expect(result.isAtGoal).toBe(true);
  });

  it("returns 0 safe bunks when below goal", () => {
    const result = calculateSafeBunks({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.safeBunks).toBe(0);
    expect(result.isAtGoal).toBe(false);
    expect(result.isAboveGoal).toBe(false);
  });

  it("handles zero total", () => {
    const result = calculateSafeBunks({
      currentPresent: 0,
      currentTotal: 0,
      goalPercentage: 75,
    });
    expect(result.safeBunks).toBe(0);
    expect(result.currentPercentage).toBe(0);
  });

  it("handles 100% attendance", () => {
    // 100/100 = 100%, goal 75%. floor((100*100 - 75*100)/75) = floor(3333/75) = 33
    const result = calculateSafeBunks({
      currentPresent: 100,
      currentTotal: 100,
      goalPercentage: 75,
    });
    expect(result.safeBunks).toBe(33);
    expect(result.currentPercentage).toBe(100);
  });

  it("uses default goal of 75 when not specified", () => {
    const result = calculateSafeBunks({
      currentPresent: 80,
      currentTotal: 100,
    });
    expect(result.goalPercentage).toBe(75);
  });

  it("considers future lectures for maxBunks", () => {
    const withFuture = calculateSafeBunks({
      currentPresent: 80,
      currentTotal: 100,
      goalPercentage: 75,
      futureLectures: 20,
    });
    const withoutFuture = calculateSafeBunks({
      currentPresent: 80,
      currentTotal: 100,
      goalPercentage: 75,
      futureLectures: 0,
    });
    expect(withFuture.maxBunks).toBeLessThanOrEqual(withoutFuture.maxBunks);
  });

  it("handles 100% attendance with future lectures", () => {
    const result = calculateSafeBunks({
      currentPresent: 100,
      currentTotal: 100,
      goalPercentage: 75,
      futureLectures: 10,
    });
    expect(result.safeBunks).toBe(33);
    expect(result.maxBunks).toBeGreaterThanOrEqual(0);
  });
});

describe("calculateSafeBunksWithGoal", () => {
  it("returns safe bunks count", () => {
    const bunks = calculateSafeBunksWithGoal(80, 100, 75);
    expect(typeof bunks).toBe("number");
    expect(bunks).toBe(6);
  });
});

describe("calculateMaxBunks", () => {
  it("returns max bunks count", () => {
    const maxBunks = calculateMaxBunks(80, 100, 75);
    expect(typeof maxBunks).toBe("number");
    expect(maxBunks).toBeGreaterThanOrEqual(0);
  });

  it("returns 0 when below goal", () => {
    const maxBunks = calculateMaxBunks(70, 100, 75);
    expect(maxBunks).toBe(0);
  });
});
