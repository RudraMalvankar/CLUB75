import { describe, it, expect, beforeEach } from "vitest";

import {
  createAIProvider,
  getAIProvider,
  clearProviderCache,
} from "@/features/ai/services/provider-factory";
import { GeminiProvider } from "@/features/ai/services/gemini-provider";
import { MockProvider } from "@/features/ai/services/mock-provider";

describe("Provider Factory", () => {
  beforeEach(() => {
    clearProviderCache();
  });

  describe("createAIProvider", () => {
    it("should create Gemini provider", () => {
      const provider = createAIProvider("gemini", {
        name: "gemini",
        apiKey: "test-key",
      });

      expect(provider).toBeInstanceOf(GeminiProvider);
      expect(provider.name).toBe("gemini");
    });

    it("should create Mock provider", () => {
      const provider = createAIProvider("mock", {
        name: "mock",
      });

      expect(provider).toBeInstanceOf(MockProvider);
      expect(provider.name).toBe("mock");
    });

    it("should create OpenAI provider as Mock", () => {
      const provider = createAIProvider("openai", {
        name: "openai",
      });

      expect(provider).toBeInstanceOf(MockProvider);
    });

    it("should create Anthropic provider as Mock", () => {
      const provider = createAIProvider("anthropic", {
        name: "anthropic",
      });

      expect(provider).toBeInstanceOf(MockProvider);
    });

    it("should create Local provider as Mock", () => {
      const provider = createAIProvider("local", {
        name: "local",
      });

      expect(provider).toBeInstanceOf(MockProvider);
    });

    it("should cache providers", () => {
      const provider1 = createAIProvider("mock", { name: "mock" });
      const provider2 = createAIProvider("mock", { name: "mock" });

      expect(provider1).toBe(provider2);
    });

    it("should cache different providers separately", () => {
      const mockProvider = createAIProvider("mock", { name: "mock" });
      const geminiProvider = createAIProvider("gemini", {
        name: "gemini",
        apiKey: "test",
      });

      expect(mockProvider).not.toBe(geminiProvider);
    });
  });

  describe("getAIProvider", () => {
    it("should return same provider as createAIProvider", () => {
      const created = createAIProvider("mock", { name: "mock" });
      const retrieved = getAIProvider("mock", { name: "mock" });

      expect(created).toBe(retrieved);
    });
  });

  describe("clearProviderCache", () => {
    it("should clear cache", () => {
      const provider1 = createAIProvider("mock", { name: "mock" });
      clearProviderCache();
      const provider2 = createAIProvider("mock", { name: "mock" });

      expect(provider1).not.toBe(provider2);
    });
  });
});
