import { describe, it, expect } from "vitest";

import { MockProvider } from "@/features/ai/services/mock-provider";
import { getEmptyContext } from "@/features/ai/services/context-builder";
import type { AIMessage } from "@/features/ai/types";

describe("MockProvider", () => {
  const provider = new MockProvider();
  const context = getEmptyContext();

  const createUserMessage = (content: string): AIMessage => ({
    id: "1",
    role: "user",
    content,
    timestamp: Date.now(),
  });

  describe("basic properties", () => {
    it("should have correct name", () => {
      expect(provider.name).toBe("mock");
    });

    it("should always be available", () => {
      expect(provider.isAvailable).toBe(true);
    });

    it("should always validate", async () => {
      const result = await provider.validate();
      expect(result).toBe(true);
    });
  });

  describe("chat", () => {
    it("should respond to bunk questions", async () => {
      const message = createUserMessage("Can I bunk tomorrow?");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(typeof response).toBe("string");
    });

    it("should respond to attendance explanation", async () => {
      const message = createUserMessage("Explain my attendance");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response).toContain("attendance");
    });

    it("should respond to risk questions", async () => {
      const message = createUserMessage("Which subjects are risky?");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
    });

    it("should respond to goal questions", async () => {
      const message = createUserMessage("How can I reach 85%?");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response).toContain("85%");
    });

    it("should respond to weekly summary", async () => {
      const message = createUserMessage("Give me a weekly summary");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response).toContain("Weekly");
    });

    it("should respond to daily briefing", async () => {
      const message = createUserMessage("What should I do today?");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
    });

    it("should respond to semester summary", async () => {
      const message = createUserMessage("Summarize my semester");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response).toContain("Semester");
    });

    it("should respond to study plan", async () => {
      const message = createUserMessage("Give me a study plan");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response).toContain("Study");
    });

    it("should respond to recovery plan", async () => {
      const message = createUserMessage("Create a recovery plan");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
      expect(response.toLowerCase()).toContain("recovery");
    });

    it("should respond to never miss question", async () => {
      const message = createUserMessage("Which lecture should I never miss?");
      const response = await provider.chat([message], context);

      expect(response).toBeTruthy();
    });

    it("should handle empty messages", async () => {
      const response = await provider.chat([], context);

      expect(response).toBeTruthy();
    });
  });

  describe("chatStream", () => {
    it("should stream response chunks", async () => {
      const message = createUserMessage("Can I bunk?");
      const chunks: string[] = [];

      const response = await provider.chatStream([message], context, (chunk) => {
        chunks.push(chunk.text);
      });

      expect(response).toBeTruthy();
      expect(chunks.length).toBeGreaterThan(0);
    });
  });
});
