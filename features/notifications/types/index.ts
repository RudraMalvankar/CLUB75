export type NotificationType =
  | "lecture_reminder"
  | "attendance_reminder"
  | "low_attendance"
  | "daily_summary"
  | "weekly_summary"
  | "monthly_summary"
  | "safe_bunk"
  | "goal_reminder"
  | "recovery_reminder"
  | "semester_alert"
  | "achievement"
  | "system";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type NotificationStatus = "unread" | "read" | "archived" | "deleted";

export type Notification = {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly priority: NotificationPriority;
  readonly status: NotificationStatus;
  readonly subjectId: string | null;
  readonly subjectName: string | null;
  readonly subjectColor: string | null;
  readonly lectureSlotId: string | null;
  readonly date: string;
  readonly time: string;
  readonly readAt: number | null;
  readonly createdAt: number;
  readonly updatedAt: number;
};

export type NotificationPreferences = {
  readonly enabled: boolean;
  readonly lectureReminders: boolean;
  readonly attendanceReminders: boolean;
  readonly lowAttendanceAlerts: boolean;
  readonly dailySummary: boolean;
  readonly weeklySummary: boolean;
  readonly monthlySummary: boolean;
  readonly goalReminders: boolean;
  readonly safeBunkWarnings: boolean;
  readonly semesterAlerts: boolean;
  readonly achievements: boolean;
  readonly quietHoursEnabled: boolean;
  readonly quietHoursStart: string;
  readonly quietHoursEnd: string;
  readonly weekendNotifications: boolean;
  readonly reminderLeadMinutes: number;
};

export type ScheduledNotification = {
  readonly id: string;
  readonly notificationType: NotificationType;
  readonly scheduledTime: number;
  readonly data: Record<string, unknown>;
  readonly isRecurring: boolean;
  readonly recurringDays: readonly number[];
};

export type NotificationAction = {
  readonly id: string;
  readonly label: string;
  readonly action: string;
  readonly icon?: string;
};

export type NotificationGroup = {
  readonly date: string;
  readonly label: string;
  readonly notifications: Notification[];
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  lecture_reminder: "Lecture Reminder",
  attendance_reminder: "Attendance Reminder",
  low_attendance: "Low Attendance",
  daily_summary: "Daily Summary",
  weekly_summary: "Weekly Summary",
  monthly_summary: "Monthly Summary",
  safe_bunk: "Safe Bunk",
  goal_reminder: "Goal Reminder",
  recovery_reminder: "Recovery Reminder",
  semester_alert: "Semester Alert",
  achievement: "Achievement",
  system: "System",
};

export const NOTIFICATION_PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: "#6B7280",
  medium: "#3B82F6",
  high: "#F59E0B",
  urgent: "#EF4444",
};

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  lecture_reminder: "📚",
  attendance_reminder: "✅",
  low_attendance: "⚠️",
  daily_summary: "📋",
  weekly_summary: "📊",
  monthly_summary: "📈",
  safe_bunk: "🎯",
  goal_reminder: "🏆",
  recovery_reminder: "🔄",
  semester_alert: "📅",
  achievement: "🏅",
  system: "⚙️",
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  lectureReminders: true,
  attendanceReminders: true,
  lowAttendanceAlerts: true,
  dailySummary: false,
  weeklySummary: true,
  monthlySummary: true,
  goalReminders: true,
  safeBunkWarnings: true,
  semesterAlerts: true,
  achievements: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  weekendNotifications: true,
  reminderLeadMinutes: 15,
};

export const REMINDER_LEAD_OPTIONS: { value: number; label: string }[] = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
];
