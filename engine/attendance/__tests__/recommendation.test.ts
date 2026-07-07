import { describe, it, expect } from "vitest";
import { calculateRecommendations } from "../calculators/recommendation";
import { RiskLevel } from "../types/enums";

describe("calculateRecommendations", () => {
  it("returns recommendations for below-goal attendance", () => {
    const result = calculateRecommendations({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.overallRisk).toBeDefined();
    expect(result.summary).toBeTruthy();
  });

  it("returns high urgency for critical attendance", () => {
    const result = calculateRecommendations({
      currentPresent: 50,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.overallRisk).toBe(RiskLevel.Critical);
    expect(result.priorityActions.length).toBeGreaterThan(0);
  });

  it("returns maintain action for excellent attendance", () => {
    const result = calculateRecommendations({
      currentPresent: 95,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.overallRisk).toBe(RiskLevel.None);
    const maintainActions = result.actions.filter((a) => a.type === "maintain");
    expect(maintainActions.length).toBeGreaterThan(0);
  });

  it("returns bunk action when above goal", () => {
    const result = calculateRecommendations({
      currentPresent: 90,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    const bunkActions = result.actions.filter((a) => a.type === "bunk");
    expect(bunkActions.length).toBeGreaterThan(0);
  });

  it("includes subjectId when provided", () => {
    const result = calculateRecommendations({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
      subjectId: "subj-1",
    });
    expect(result.actions[0]?.subjectId).toBe("subj-1");
  });

  it("handles zero total lectures", () => {
    const result = calculateRecommendations({
      currentPresent: 0,
      currentTotal: 0,
      goalPercentage: 75,
      totalSemesterLectures: 100,
    });
    expect(result.actions.length).toBeGreaterThan(0);
    expect(result.summary).toBeTruthy();
  });

  it("generates meaningful summary", () => {
    const result = calculateRecommendations({
      currentPresent: 70,
      currentTotal: 100,
      goalPercentage: 75,
      totalSemesterLectures: 150,
    });
    expect(result.summary.length).toBeGreaterThan(10);
  });
});
