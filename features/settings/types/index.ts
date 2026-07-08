export type ThemeOption = "light" | "dark" | "amoled" | "system";

export type AccentColor = {
  readonly name: string;
  readonly value: string;
};

export type SettingsSection = {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly route: string;
};

export type AttendanceGoalSettings = {
  readonly targetAttendance: number;
  readonly safeBuffer: number;
};

export type AppearanceSettings = {
  readonly theme: ThemeOption;
  readonly followSystem: boolean;
  readonly accentColor: string;
  readonly reducedMotion: boolean;
  readonly highContrast: boolean;
};

export type NotificationSettings = {
  readonly enabled: boolean;
  readonly attendanceReminders: boolean;
  readonly lowAttendanceAlerts: boolean;
  readonly dailySummary: boolean;
  readonly reminderLeadMinutes: number;
};

export type DataManagementInfo = {
  readonly databaseSize: string;
  readonly subjectsCount: number;
  readonly attendanceRecords: number;
  readonly timetableEntries: number;
};

export type AboutInfo = {
  readonly version: string;
  readonly buildNumber: string;
  readonly developer: string;
  readonly github: string;
};

export const THEME_OPTIONS: { value: ThemeOption; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "amoled", label: "AMOLED" },
];

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Purple", value: "#A855F7" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
];

export const REMINDER_OPTIONS: { value: number; label: string }[] = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: "attendance", title: "Attendance Goal", icon: "🎯", route: "/settings/attendance" },
  { id: "appearance", title: "Appearance", icon: "🎨", route: "/settings/appearance" },
  { id: "semester", title: "Semester", icon: "📅", route: "/settings/semester" },
  { id: "notifications", title: "Notifications", icon: "🔔", route: "/settings/notifications" },
  { id: "data", title: "Data Management", icon: "💾", route: "/settings/data" },
  { id: "about", title: "About", icon: "ℹ️", route: "/settings/about" },
];
