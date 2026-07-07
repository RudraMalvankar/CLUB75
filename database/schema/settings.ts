import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { baseTimestamps, textPrimaryKey } from "@/database/helpers";
import {
  appPreferences,
  insertAppPreferenceSchema,
  insertNotificationPreferenceSchema,
  insertThemePreferenceSchema,
  notificationPreferences,
  themePreferences,
  updateAppPreferenceSchema,
  updateNotificationPreferenceSchema,
  updateThemePreferenceSchema,
} from "@/database/schema/preferences";
import { semesters } from "@/database/schema/semester";

export const settings = sqliteTable("settings", {
  id: textPrimaryKey(),
  defaultSemesterId: text("default_semester_id").references(() => semesters.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  targetAttendance: integer("target_attendance").notNull(),
  themePreferenceId: text("theme_preference_id")
    .notNull()
    .references(() => themePreferences.id, { onDelete: "restrict", onUpdate: "cascade" }),
  notificationPreferenceId: text("notification_preference_id")
    .notNull()
    .references(() => notificationPreferences.id, { onDelete: "restrict", onUpdate: "cascade" }),
  appPreferenceId: text("app_preference_id")
    .notNull()
    .references(() => appPreferences.id, { onDelete: "restrict", onUpdate: "cascade" }),
  ...baseTimestamps,
});

export const insertSettingsSchema = z.object({
  id: z.uuid().optional(),
  defaultSemesterId: z.uuid().nullable().optional(),
  targetAttendance: z.number().int().min(0).max(100),
  themePreference: insertThemePreferenceSchema,
  notificationPreference: insertNotificationPreferenceSchema,
  appPreference: insertAppPreferenceSchema,
});

export const updateSettingsSchema = z.object({
  defaultSemesterId: z.uuid().nullable().optional(),
  targetAttendance: z.number().int().min(0).max(100).optional(),
  themePreference: updateThemePreferenceSchema.optional(),
  notificationPreference: updateNotificationPreferenceSchema.optional(),
  appPreference: updateAppPreferenceSchema.optional(),
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
