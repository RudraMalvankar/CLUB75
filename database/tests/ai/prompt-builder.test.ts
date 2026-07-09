import { describe, it, expect } from "vitest";

import {
  ALL_PROMPTS,
  getPromptByCategory,
  buildSystemPrompt,
} from "@/features/ai/prompts/templates";
import { getEmptyContext } from "@/features/ai/services/context-builder";
import type { AIPromptCategory } from "@/features/ai/types";

describe("Prompt Builder", () => {
  describe("ALL_PROMPTS", () => {
    it("should have all required prompts", () => {
      expect(ALL_PROMPTS).toHaveLength(9);

      const ids = ALL_PROMPTS.map((p) => p.id);
      expect(ids).toContain("attendance-explanation");
      expect(ids).toContain("attendance-recovery");
      expect(ids).toContain("safe-bunk-advice");
      expect(ids).toContain("weekly-summary");
      expect(ids).toContain("semester-summary");
      expect(ids).toContain("risk-analysis");
      expect(ids).toContain("subject-analysis");
      expect(ids).toContain("study-suggestions");
      expect(ids).toContain("daily-briefing");
    });

    it("should have valid structure for each prompt", () => {
      for (const prompt of ALL_PROMPTS) {
        expect(prompt.id).toBeTruthy();
        expect(prompt.name).toBeTruthy();
        expect(prompt.systemPrompt).toBeTruthy();
        expect(prompt.userPromptTemplate).toBeTruthy();
        expect(Array.isArray(prompt.requiredContext)).toBe(true);
      }
    });
  });

  describe("getPromptByCategory", () => {
    it("should return correct prompt for each category", () => {
      const categories: AIPromptCategory[] = [
        "attendance",
        "recovery",
        "bunk",
        "summary",
        "risk",
        "subject",
        "study",
        "daily",
        "general",
      ];

      for (const category of categories) {
        const prompt = getPromptByCategory(category);
        expect(prompt).toBeDefined();
        expect(prompt.systemPrompt).toBeTruthy();
      }
    });

    it("should return attendance prompt for general category", () => {
      const prompt = getPromptByCategory("general");
      expect(prompt.id).toBe("attendance-explanation");
    });
  });

  describe("buildSystemPrompt", () => {
    it("should build system prompt with context", () => {
      const context = getEmptyContext();
      const prompt = ALL_PROMPTS[0];

      const systemPrompt = buildSystemPrompt(prompt, context);

      expect(systemPrompt).toContain(prompt.systemPrompt);
      expect(systemPrompt).toContain("CONTEXT:");
      expect(systemPrompt).toContain("Attendance:");
      expect(systemPrompt).toContain("Status:");
    });

    it("should include semester data in context", () => {
      const context = getEmptyContext();
      const prompt = ALL_PROMPTS[0];

      const systemPrompt = buildSystemPrompt(prompt, context);

      expect(systemPrompt).toContain("Semester:");
    });
  });
});
