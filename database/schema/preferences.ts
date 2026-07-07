import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  baseTimestamps,
  LANGUAGE_VALUES,
  THEME_PREFERENCE_VALUES,
  textPrimaryKey,
} from "@/database/helpers";

export const themePreferences = sqliteTable(
  "theme_preferences",
  {
    id: textPrimaryKey(),
    theme: text("theme").notNull(),
    followSystem: integer("follow_system", { mode: "boolean" }).notNull(),
    accentColor: text("accent_color").notNull(),
    ...baseTimestamps,
  },
  (table) => [index("theme_preferences_theme_idx").on(table.theme)],
);

export const notificationPreferences = sqliteTable("notification_preferences", {
  id: textPrimaryKey(),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
  attendanceRemindersEnabled: integer("attendance_reminders_enabled", {
    mode: "boolean",
  }).notNull(),
  lowAttendanceAlertsEnabled: integer("low_attendance_alerts_enabled", {
    mode: "boolean",
  }).notNull(),
  dailySummaryEnabled: integer("daily_summary_enabled", { mode: "boolean" }).notNull(),
  reminderLeadMinutes: integer("reminder_lead_minutes").notNull(),
  ...baseTimestamps,
});

export const appPreferences = sqliteTable(
  "app_preferences",
  {
    id: textPrimaryKey(),
    language: text("language").notNull(),
    hapticsEnabled: integer("haptics_enabled", { mode: "boolean" }).notNull(),
    analyticsOptIn: integer("analytics_opt_in", { mode: "boolean" }).notNull(),
    reducedMotion: integer("reduced_motion", { mode: "boolean" }).notNull(),
    ...baseTimestamps,
  },
  (table) => [index("app_preferences_language_idx").on(table.language)],
);

export const insertThemePreferenceSchema = z.object({
  id: z.uuid().optional(),
  theme: z.enum(THEME_PREFERENCE_VALUES),
  followSystem: z.boolean(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/u),
});

export const updateThemePreferenceSchema = insertThemePreferenceSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one theme preference field is required",
  );

export const insertNotificationPreferenceSchema = z.object({
  id: z.uuid().optional(),
  enabled: z.boolean(),
  attendanceRemindersEnabled: z.boolean(),
  lowAttendanceAlertsEnabled: z.boolean(),
  dailySummaryEnabled: z.boolean(),
  reminderLeadMinutes: z.number().int().min(0).max(1_440),
});

export const updateNotificationPreferenceSchema = insertNotificationPreferenceSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one notification preference field is required",
  );

export const insertAppPreferenceSchema = z.object({
  id: z.uuid().optional(),
  language: z.enum(LANGUAGE_VALUES),
  hapticsEnabled: z.boolean(),
  analyticsOptIn: z.boolean(),
  reducedMotion: z.boolean(),
});

export const updateAppPreferenceSchema = insertAppPreferenceSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one app preference field is required",
  );

export type InsertThemePreference = z.infer<typeof insertThemePreferenceSchema>;
export type UpdateThemePreference = z.infer<typeof updateThemePreferenceSchema>;
export type InsertNotificationPreference = z.infer<typeof insertNotificationPreferenceSchema>;
export type UpdateNotificationPreference = z.infer<typeof updateNotificationPreferenceSchema>;
export type InsertAppPreference = z.infer<typeof insertAppPreferenceSchema>;
export type UpdateAppPreference = z.infer<typeof updateAppPreferenceSchema>;
