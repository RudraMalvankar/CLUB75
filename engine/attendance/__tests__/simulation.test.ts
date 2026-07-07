import { describe, it, expect } from "vitest";
import { calculateSimulation, simulateFutureAttendance } from "../calculators/simulation";
import { AttendanceStatusLevel } from "../types/enums";

describe("calculateSimulation", () => {
  it("simulates future attendance", () => {
    // (70+10)/(100+10+0) = 80/110 = 72.73
    const result = calculateSimulation({
      currentPresent: 70,
      currentTotal: 100,
      futurePresent: 10,
      futureAbsent: 0,
    });
    expect(result.originalPercentage).toBe(70);
    expect(result.simulatedPercentage).toBe(72.73);
    expect(result.isImprovement).toBe(true);
  });

  it("simulates decline in attendance", () => {
    // (70+0)/(100+0+10) = 70/110 = 63.64
    const result = calculateSimulation({
      currentPresent: 70,
      currentTotal: 100,
      futurePresent: 0,
      futureAbsent: 10,
    });
    expect(result.simulatedPercentage).toBeLessThan(70);
    expect(result.isImprovement).toBe(false);
  });

  it("detects status level change", () => {
    // (70+20)/(100+20+0) = 90/120 = 75 → safe level
    const result = calculateSimulation({
      currentPresent: 70,
      currentTotal: 100,
      futurePresent: 20,
      futureAbsent: 0,
    });
    expect(result.originalStatusLevel).toBe(AttendanceStatusLevel.Warning);
    expect(result.newStatusLevel).toBe(AttendanceStatusLevel.Safe);
  });

  it("handles zero current lectures", () => {
    // (0+10)/(0+10+0) = 10/10 = 100
    const result = calculateSimulation({
      currentPresent: 0,
      currentTotal: 0,
      futurePresent: 10,
      futureAbsent: 0,
    });
    expect(result.originalPercentage).toBe(0);
    expect(result.simulatedPercentage).toBe(100);
  });

  it("handles all future absent", () => {
    // (80+0)/(100+0+20) = 80/120 = 66.67
    const result = calculateSimulation({
      currentPresent: 80,
      currentTotal: 100,
      futurePresent: 0,
      futureAbsent: 20,
    });
    expect(result.simulatedPercentage).toBe(66.67);
  });

  it("returns correct totals", () => {
    const result = calculateSimulation({
      currentPresent: 70,
      currentTotal: 100,
      futurePresent: 10,
      futureAbsent: 5,
    });
    expect(result.totalPresent).toBe(80);
    expect(result.totalLectures).toBe(115);
  });

  it("handles all zero inputs", () => {
    // (0+0)/(0+0+0) = 0/0 = NaN → safeDivide returns 0
    const result = calculateSimulation({
      currentPresent: 0,
      currentTotal: 0,
      futurePresent: 0,
      futureAbsent: 0,
    });
    expect(result.originalPercentage).toBe(0);
    expect(result.simulatedPercentage).toBe(0);
    expect(result.totalPresent).toBe(0);
    expect(result.totalLectures).toBe(0);
  });
});

describe("simulateFutureAttendance", () => {
  it("works as a convenience wrapper", () => {
    // (70+10)/(100+10+0) = 80/110 = 72.73
    const result = simulateFutureAttendance(70, 100, 10, 0);
    expect(result.originalPercentage).toBe(70);
    expect(result.simulatedPercentage).toBe(72.73);
  });
});
