import { describe, it, expect, vi } from "vitest";

import { AISettingsService } from "@/features/ai/services/ai-settings-service";
import { DEFAULT_AI_SETTINGS } from "@/features/ai/types";

function createMockDb(rows: unknown[] = []) {
  const limitResult = Promise.resolve(rows);
  const whereLike = {
    limit: vi.fn().mockReturnValue(limitResult),
    then: (resolve: (value: unknown) => void) => resolve(rows),
  };
  const chain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnValue(whereLike),
    limit: vi.fn().mockReturnValue(limitResult),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return chain;
}

describe("AISettingsService", () => {
  describe("getSettings", () => {
    it("should return default settings when no rows exist", async () => {
      const mockDb = createMockDb([]);
      const service = new AISettingsService(mockDb as never);

      const settings = await service.getSettings();

      expect(settings).toEqual(DEFAULT_AI_SETTINGS);
    });

    it("should return parsed settings from database", async () => {
      const mockRows = [
        { key: "enabled", value: "true" },
        { key: "provider", value: "gemini" },
        { key: "apiKey", value: "test-key" },
        { key: "model", value: "gemini-2.0-flash" },
        { key: "temperature", value: "0.7" },
        { key: "streaming", value: "true" },
        { key: "historyEnabled", value: "true" },
        { key: "maxHistoryMessages", value: "100" },
      ];
      const mockDb = createMockDb(mockRows);
      const service = new AISettingsService(mockDb as never);

      const settings = await service.getSettings();

      expect(settings.enabled).toBe(true);
      expect(settings.provider).toBe("gemini");
      expect(settings.apiKey).toBe("test-key");
      expect(settings.model).toBe("gemini-2.0-flash");
      expect(settings.temperature).toBe(0.7);
      expect(settings.streaming).toBe(true);
    });
  });

  describe("updateSettings", () => {
    it("should merge with current settings", async () => {
      const mockDb = createMockDb([]);
      const service = new AISettingsService(mockDb as never);

      const updated = await service.updateSettings({ provider: "openai" });

      expect(updated).toBeDefined();
      expect(updated.provider).toBeDefined();
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe("deleteSettings", () => {
    it("should delete all settings", async () => {
      const mockDb = createMockDb([]);
      const service = new AISettingsService(mockDb as never);

      await service.deleteSettings();

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
