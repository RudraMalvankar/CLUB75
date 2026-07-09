import { and, eq } from "drizzle-orm";

import { createId, toRepositoryError, touchTimestamps, updatedTimestamp } from "@/database/helpers";
import { aiMetadata } from "@/database/schema/aiMetadata";
import type { Club75Database } from "@/database/types";
import { DEFAULT_AI_SETTINGS, type AISettings, type AIProviderName } from "@/features/ai/types";

const SETTINGS_NAMESPACE = "ai_settings";

export class AISettingsService {
  constructor(private readonly db: Club75Database) {}

  async getSettings(): Promise<AISettings> {
    try {
      const rows = await this.db
        .select()
        .from(aiMetadata)
        .where(eq(aiMetadata.namespace, SETTINGS_NAMESPACE));

      if (rows.length === 0) {
        return DEFAULT_AI_SETTINGS;
      }

      const settingsMap = new Map(rows.map((r) => [r.key, r.value]));

      return {
        enabled: settingsMap.get("enabled") === "true",
        provider: (settingsMap.get("provider") as AIProviderName) ?? DEFAULT_AI_SETTINGS.provider,
        apiKey: settingsMap.get("apiKey") ?? DEFAULT_AI_SETTINGS.apiKey,
        model: settingsMap.get("model") ?? DEFAULT_AI_SETTINGS.model,
        temperature: Number(settingsMap.get("temperature")) || DEFAULT_AI_SETTINGS.temperature,
        streaming: settingsMap.get("streaming") !== "false",
        historyEnabled: settingsMap.get("historyEnabled") !== "false",
        maxHistoryMessages:
          Number(settingsMap.get("maxHistoryMessages")) || DEFAULT_AI_SETTINGS.maxHistoryMessages,
      };
    } catch (error) {
      throw toRepositoryError(error, "Failed to load AI settings");
    }
  }

  async updateSettings(settings: Partial<AISettings>): Promise<AISettings> {
    try {
      const current = await this.getSettings();
      const merged = { ...current, ...settings };

      const entries: { key: string; value: string }[] = [
        { key: "enabled", value: String(merged.enabled) },
        { key: "provider", value: merged.provider },
        { key: "apiKey", value: merged.apiKey },
        { key: "model", value: merged.model },
        { key: "temperature", value: String(merged.temperature) },
        { key: "streaming", value: String(merged.streaming) },
        { key: "historyEnabled", value: String(merged.historyEnabled) },
        { key: "maxHistoryMessages", value: String(merged.maxHistoryMessages) },
      ];

      for (const entry of entries) {
        const [existing] = await this.db
          .select()
          .from(aiMetadata)
          .where(and(eq(aiMetadata.namespace, SETTINGS_NAMESPACE), eq(aiMetadata.key, entry.key)))
          .limit(1);

        if (existing) {
          await this.db
            .update(aiMetadata)
            .set({ value: entry.value, ...updatedTimestamp() })
            .where(eq(aiMetadata.id, existing.id));
        } else {
          await this.db.insert(aiMetadata).values({
            id: createId(),
            namespace: SETTINGS_NAMESPACE,
            key: entry.key,
            value: entry.value,
            ...touchTimestamps(),
          });
        }
      }

      return this.getSettings();
    } catch (error) {
      throw toRepositoryError(error, "Failed to update AI settings");
    }
  }

  async deleteSettings(): Promise<void> {
    try {
      await this.db.delete(aiMetadata).where(eq(aiMetadata.namespace, SETTINGS_NAMESPACE));
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete AI settings");
    }
  }
}
