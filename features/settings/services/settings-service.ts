import { getDatabase } from "@/database/database";
import { SettingsRepository } from "@/database/repositories/settings.repository";
import type { AppearanceSettings, AttendanceGoalSettings, NotificationSettings } from "../types";

const DEFAULT_ATTENDANCE_GOAL: AttendanceGoalSettings = {
  targetAttendance: 75,
  safeBuffer: 5,
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "system",
  followSystem: true,
  accentColor: "#6366F1",
  reducedMotion: false,
  highContrast: false,
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: true,
  attendanceReminders: true,
  lowAttendanceAlerts: true,
  dailySummary: false,
  reminderLeadMinutes: 15,
};

export async function getAttendanceGoal(): Promise<AttendanceGoalSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    const settings = await repository.getSettings();
    if (settings) {
      return {
        targetAttendance: settings.targetAttendance,
        safeBuffer: 5,
      };
    }
    return DEFAULT_ATTENDANCE_GOAL;
  } catch {
    return DEFAULT_ATTENDANCE_GOAL;
  }
}

export async function updateAttendanceGoal(
  settings: AttendanceGoalSettings,
): Promise<AttendanceGoalSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    await repository.update({ targetAttendance: settings.targetAttendance });
  } catch {
    // Silently fail in case of DB errors
  }
  return settings;
}

export async function getAppearance(): Promise<AppearanceSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    const settings = await repository.getSettings();
    if (settings?.themePreference) {
      return {
        theme: settings.themePreference.theme as AppearanceSettings["theme"],
        followSystem: settings.themePreference.followSystem,
        accentColor: settings.themePreference.accentColor,
        reducedMotion: settings.appPreference?.reducedMotion ?? false,
        highContrast: false,
      };
    }
    return DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export async function updateAppearance(settings: AppearanceSettings): Promise<AppearanceSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    await repository.update({
      themePreference: {
        theme: settings.theme,
        followSystem: settings.followSystem,
        accentColor: settings.accentColor,
      },
      appPreference: {
        reducedMotion: settings.reducedMotion,
        hapticsEnabled: true,
        analyticsOptIn: false,
        language: "en",
      },
    });
  } catch {
    // Silently fail in case of DB errors
  }
  return settings;
}

export async function getNotifications(): Promise<NotificationSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    const settings = await repository.getSettings();
    if (settings?.notificationPreference) {
      return {
        enabled: settings.notificationPreference.enabled,
        attendanceReminders: settings.notificationPreference.attendanceRemindersEnabled,
        lowAttendanceAlerts: settings.notificationPreference.lowAttendanceAlertsEnabled,
        dailySummary: settings.notificationPreference.dailySummaryEnabled,
        reminderLeadMinutes: settings.notificationPreference.reminderLeadMinutes,
      };
    }
    return DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export async function updateNotifications(
  settings: NotificationSettings,
): Promise<NotificationSettings> {
  try {
    const db = getDatabase();
    const repository = new SettingsRepository(db);
    await repository.update({
      notificationPreference: {
        enabled: settings.enabled,
        attendanceRemindersEnabled: settings.attendanceReminders,
        lowAttendanceAlertsEnabled: settings.lowAttendanceAlerts,
        dailySummaryEnabled: settings.dailySummary,
        reminderLeadMinutes: settings.reminderLeadMinutes,
      },
    });
  } catch {
    // Silently fail in case of DB errors
  }
  return settings;
}
