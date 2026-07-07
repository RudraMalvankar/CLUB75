import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SettingsRepository } from "@/database/repositories/settings.repository";
import type { Club75Database } from "@/database/types";

describe("SettingsRepository", () => {
  let db: Club75Database;
  let repo: SettingsRepository;

  beforeEach(() => {
    db = createTestDatabase();
    repo = new SettingsRepository(db);
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validSettings = {
    targetAttendance: 80,
    themePreference: {
      theme: "system" as const,
      followSystem: true,
      accentColor: "#4F46E5",
    },
    notificationPreference: {
      enabled: true,
      attendanceRemindersEnabled: true,
      lowAttendanceAlertsEnabled: true,
      dailySummaryEnabled: false,
      reminderLeadMinutes: 15,
    },
    appPreference: {
      language: "en" as const,
      hapticsEnabled: true,
      analyticsOptIn: false,
      reducedMotion: false,
    },
  };

  describe("getSettings", () => {
    it("returns null when no settings exist", async () => {
      const result = await repo.getSettings();
      expect(result).toBeNull();
    });
  });

  describe("upsert", () => {
    it("creates settings on first call", async () => {
      const result = await repo.upsert(validSettings);
      expect(result).toBeDefined();
      expect(result.targetAttendance).toBe(80);
    });

    it("updates settings on second call", async () => {
      await repo.upsert(validSettings);
      const updated = await repo.upsert({
        ...validSettings,
        targetAttendance: 90,
      });
      expect(updated.targetAttendance).toBe(90);
    });

    it("creates associated preference records", async () => {
      await repo.upsert(validSettings);
      const settings = await repo.getSettings();
      expect(settings).toBeDefined();
      expect(settings!.themePreference).toBeDefined();
      expect(settings!.themePreference!.theme).toBe("system");
      expect(settings!.notificationPreference).toBeDefined();
      expect(settings!.notificationPreference!.enabled).toBe(true);
      expect(settings!.appPreference).toBeDefined();
      expect(settings!.appPreference!.language).toBe("en");
    });
  });

  describe("update", () => {
    it("updates target attendance", async () => {
      await repo.upsert(validSettings);
      const updated = await repo.update({ targetAttendance: 85 });
      expect(updated).toBeDefined();
      expect(updated!.targetAttendance).toBe(85);
    });

    it("updates theme preference", async () => {
      await repo.upsert(validSettings);
      const updated = await repo.update({
        themePreference: { theme: "dark", followSystem: false, accentColor: "#FF0000" },
      });
      expect(updated).toBeDefined();
      const settings = await repo.getSettings();
      expect(settings!.themePreference!.theme).toBe("dark");
    });

    it("returns null when no settings exist", async () => {
      const result = await repo.update({ targetAttendance: 90 });
      expect(result).toBeNull();
    });

    it("updates notification preference", async () => {
      await repo.upsert(validSettings);
      await repo.update({
        notificationPreference: {
          enabled: false,
          attendanceRemindersEnabled: false,
          lowAttendanceAlertsEnabled: false,
          dailySummaryEnabled: true,
          reminderLeadMinutes: 30,
        },
      });
      const settings = await repo.getSettings();
      expect(settings!.notificationPreference!.enabled).toBe(false);
      expect(settings!.notificationPreference!.dailySummaryEnabled).toBe(true);
    });

    it("updates app preference", async () => {
      await repo.upsert(validSettings);
      await repo.update({
        appPreference: {
          language: "en",
          hapticsEnabled: false,
          analyticsOptIn: true,
          reducedMotion: true,
        },
      });
      const settings = await repo.getSettings();
      expect(settings!.appPreference!.hapticsEnabled).toBe(false);
      expect(settings!.appPreference!.reducedMotion).toBe(true);
    });
  });
});
