import { eq } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  appPreferences,
  notificationPreferences,
  themePreferences,
  updateAppPreferenceSchema,
  updateNotificationPreferenceSchema,
  updateThemePreferenceSchema,
} from "@/database/schema/preferences";
import {
  insertSettingsSchema,
  settings,
  updateSettingsSchema,
  type InsertSettings,
  type UpdateSettings,
} from "@/database/schema/settings";
import type { Club75Database } from "@/database/types";

export class SettingsRepository {
  constructor(private readonly db: Club75Database) {}

  async getSettings() {
    try {
      const [row] = await this.db.select().from(settings).limit(1);
      if (!row) return null;

      const [themePreference] = await this.db
        .select()
        .from(themePreferences)
        .where(eq(themePreferences.id, row.themePreferenceId))
        .limit(1);
      const [notificationPreference] = await this.db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.id, row.notificationPreferenceId))
        .limit(1);
      const [appPreference] = await this.db
        .select()
        .from(appPreferences)
        .where(eq(appPreferences.id, row.appPreferenceId))
        .limit(1);

      return {
        ...row,
        themePreference,
        notificationPreference,
        appPreference,
      };
    } catch (error) {
      throw toRepositoryError(error, "Failed to load settings");
    }
  }

  async upsert(payload: InsertSettings) {
    const validated = validateOrThrow(insertSettingsSchema, payload, "Invalid settings payload");

    try {
      return await this.db.transaction(async (tx) => {
        const [themeRow] = await tx
          .insert(themePreferences)
          .values({
            id: validated.themePreference.id ?? createId(),
            ...validated.themePreference,
            ...touchTimestamps(),
          })
          .returning();
        const [notificationRow] = await tx
          .insert(notificationPreferences)
          .values({
            id: validated.notificationPreference.id ?? createId(),
            ...validated.notificationPreference,
            ...touchTimestamps(),
          })
          .returning();
        const [appRow] = await tx
          .insert(appPreferences)
          .values({
            id: validated.appPreference.id ?? createId(),
            ...validated.appPreference,
            ...touchTimestamps(),
          })
          .returning();

        const existing = await tx.select().from(settings).limit(1);

        if (existing[0]) {
          const [updated] = await tx
            .update(settings)
            .set({
              defaultSemesterId: validated.defaultSemesterId ?? null,
              targetAttendance: validated.targetAttendance,
              themePreferenceId: themeRow.id,
              notificationPreferenceId: notificationRow.id,
              appPreferenceId: appRow.id,
              ...updatedTimestamp(),
            })
            .where(eq(settings.id, existing[0].id))
            .returning();
          return updated;
        }

        const [created] = await tx
          .insert(settings)
          .values({
            id: validated.id ?? createId(),
            defaultSemesterId: validated.defaultSemesterId ?? null,
            targetAttendance: validated.targetAttendance,
            themePreferenceId: themeRow.id,
            notificationPreferenceId: notificationRow.id,
            appPreferenceId: appRow.id,
            ...touchTimestamps(),
          })
          .returning();

        return created;
      });
    } catch (error) {
      throw toRepositoryError(error, "Failed to upsert settings");
    }
  }

  async update(payload: UpdateSettings) {
    const validated = validateOrThrow(
      updateSettingsSchema,
      payload,
      "Invalid settings update payload",
    );

    try {
      return await this.db.transaction(async (tx) => {
        const [existing] = await tx.select().from(settings).limit(1);
        if (!existing) return null;

        if (validated.themePreference) {
          const themePayload = validateOrThrow(
            updateThemePreferenceSchema,
            validated.themePreference,
            "Invalid theme preference update",
          );
          await tx
            .update(themePreferences)
            .set({ ...themePayload, ...updatedTimestamp() })
            .where(eq(themePreferences.id, existing.themePreferenceId));
        }

        if (validated.notificationPreference) {
          const notificationPayload = validateOrThrow(
            updateNotificationPreferenceSchema,
            validated.notificationPreference,
            "Invalid notification preference update",
          );
          await tx
            .update(notificationPreferences)
            .set({ ...notificationPayload, ...updatedTimestamp() })
            .where(eq(notificationPreferences.id, existing.notificationPreferenceId));
        }

        if (validated.appPreference) {
          const appPayload = validateOrThrow(
            updateAppPreferenceSchema,
            validated.appPreference,
            "Invalid app preference update",
          );
          await tx
            .update(appPreferences)
            .set({ ...appPayload, ...updatedTimestamp() })
            .where(eq(appPreferences.id, existing.appPreferenceId));
        }

        const [updated] = await tx
          .update(settings)
          .set({
            ...(validated.defaultSemesterId !== undefined
              ? { defaultSemesterId: validated.defaultSemesterId }
              : {}),
            ...(validated.targetAttendance !== undefined
              ? { targetAttendance: validated.targetAttendance }
              : {}),
            ...updatedTimestamp(),
          })
          .where(eq(settings.id, existing.id))
          .returning();

        return updated ?? null;
      });
    } catch (error) {
      throw toRepositoryError(error, "Failed to update settings");
    }
  }
}
