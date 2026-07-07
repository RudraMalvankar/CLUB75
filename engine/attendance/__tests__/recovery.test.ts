import { describe, it, expect } from "vitest";
import {
  calculateRecovery,
  calculateRecoveryFromCounts,
  isRecoverable,
} from "../calculators/recovery";

describe("calculateRecovery", () => {
  it("calculates recovery lectures needed", () => {
    const result = calculateRecovery({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.lecturesNeeded).toBeGreaterThan(0);
    expect(result.isRecoverable).toBe(true);
  });

  it("returns 0 needed when already at goal", () => {
    const result = calculateRecovery({
      currentPresent: 75,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.lecturesNeeded).toBe(0);
  });

  it("detects unrecoverable when not enough lectures remain", () => {
    const result = calculateRecovery({
      currentPresent: 50,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 105,
    });
    expect(result.isRecoverable).toBe(false);
  });

  it("handles zero total lectures", () => {
    const result = calculateRecovery({
      currentPresent: 0,
      currentTotal: 0,
      goalPercentage: 75,
      totalSemesterLectures: 100,
    });
    expect(result.lecturesNeeded).toBe(0);
    expect(result.lecturesRemaining).toBe(100);
    expect(result.maximumPossible).toBe(100);
  });

  it("calculates lecturesRemaining", () => {
    const result = calculateRecovery({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.lecturesRemaining).toBe(50);
  });

  it("calculates maximumPossible", () => {
    const result = calculateRecovery({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.maximumPossible).toBeGreaterThanOrEqual(70);
  });

  it("consecutiveRequired equals lecturesNeeded when recoverable", () => {
    const result = calculateRecovery({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    if (result.isRecoverable) {
      expect(result.consecutiveRequired).toBe(result.lecturesNeeded);
    }
  });
});

describe("calculateRecoveryFromCounts", () => {
  it("works with raw counts", () => {
    const result = calculateRecoveryFromCounts(70, 100, 75, 150);
    expect(result.lecturesNeeded).toBeGreaterThan(0);
  });
});

describe("isRecoverable", () => {
  it("returns true when recoverable", () => {
    expect(isRecoverable(70, 100, 75, 150)).toBe(true);
  });

  it("returns false when not recoverable", () => {
    expect(isRecoverable(50, 100, 75, 105)).toBe(false);
  });
});
