import { AttendanceRepository } from "@/database/repositories/attendance.repository";
import { TimetableRepository } from "@/database/repositories/timetable.repository";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { SettingsRepository } from "@/database/repositories/settings.repository";
import { getDatabase } from "@/database/database";
import type {
  Notification,
  NotificationPreferences,
  NotificationType,
  NotificationGroup,
} from "../types";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../types";

export class NotificationService {
  private attendanceRepo: AttendanceRepository;
  private timetableRepo: TimetableRepository;
  private semesterRepo: SemesterRepository;
  private subjectRepo: SubjectRepository;
  private settingsRepo: SettingsRepository;

  private notifications: Notification[] = [];

  constructor() {
    const db = getDatabase();
    this.attendanceRepo = new AttendanceRepository(db);
    this.timetableRepo = new TimetableRepository(db);
    this.semesterRepo = new SemesterRepository(db);
    this.subjectRepo = new SubjectRepository(db);
    this.settingsRepo = new SettingsRepository(db);
  }

  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const settings = await this.settingsRepo.getSettings();
      if (settings?.notificationPreference) {
        const pref = settings.notificationPreference;
        return {
          enabled: pref.enabled,
          lectureReminders: pref.attendanceRemindersEnabled,
          attendanceReminders: pref.attendanceRemindersEnabled,
          lowAttendanceAlerts: pref.lowAttendanceAlertsEnabled,
          dailySummary: pref.dailySummaryEnabled,
          weeklySummary: pref.dailySummaryEnabled,
          monthlySummary: pref.dailySummaryEnabled,
          goalReminders: pref.attendanceRemindersEnabled,
          safeBunkWarnings: pref.lowAttendanceAlertsEnabled,
          semesterAlerts: pref.lowAttendanceAlertsEnabled,
          achievements: pref.attendanceRemindersEnabled,
          quietHoursEnabled: false,
          quietHoursStart: "22:00",
          quietHoursEnd: "07:00",
          weekendNotifications: true,
          reminderLeadMinutes: pref.reminderLeadMinutes,
        };
      }
      return DEFAULT_NOTIFICATION_PREFERENCES;
    } catch {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notifications;
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter((n) => n.status === "unread").length;
  }

  async markAsRead(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, status: "read" as const, readAt: Date.now() } : n,
    );
  }

  async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({
      ...n,
      status: "read" as const,
      readAt: Date.now(),
    }));
  }

  async archiveNotification(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, status: "archived" as const } : n,
    );
  }

  async deleteNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  async generateLectureReminders(): Promise<Notification[]> {
    const preferences = await this.getPreferences();
    if (!preferences.enabled || !preferences.lectureReminders) return [];

    const today = new Date();
    const timetableEntries = await this.timetableRepo.getAll();
    const subjects = await this.subjectRepo.getAll();

    const notifications: Notification[] = [];
    for (const entry of timetableEntries) {
      const subject = subjects.find((s) => s.id === entry.subjectId);
      if (!subject) continue;

      const notification: Notification = {
        id: `lecture-reminder-${entry.id}-${Date.now()}`,
        type: "lecture_reminder",
        title: `${subject.name}`,
        body: `Upcoming lecture - ${subject.faculty}`,
        priority: "medium",
        status: "unread",
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        lectureSlotId: entry.lectureSlotId,
        date: today.toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        readAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      notifications.push(notification);
    }

    this.notifications = [...notifications, ...this.notifications];
    return notifications;
  }

  async generateLowAttendanceWarnings(): Promise<Notification[]> {
    const preferences = await this.getPreferences();
    if (!preferences.enabled || !preferences.lowAttendanceAlerts) return [];

    const subjects = await this.subjectRepo.getAll();
    const settings = await this.settingsRepo.getSettings();
    const targetAttendance = settings?.targetAttendance ?? 75;

    const notifications: Notification[] = [];

    for (const subject of subjects) {
      const records = await this.attendanceRepo.getBySubject(subject.id);
      if (records.length === 0) continue;

      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const percentage = Math.round((present / total) * 100);

      if (percentage < targetAttendance) {
        const notification: Notification = {
          id: `low-attendance-${subject.id}-${Date.now()}`,
          type: "low_attendance",
          title: `Low Attendance: ${subject.name}`,
          body: `Your attendance has dropped to ${percentage}%. Attend the next lectures to improve.`,
          priority: "high",
          status: "unread",
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          lectureSlotId: null,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          readAt: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        notifications.push(notification);
      }
    }

    this.notifications = [...notifications, ...this.notifications];
    return notifications;
  }

  async generateDailySummary(): Promise<Notification[]> {
    const preferences = await this.getPreferences();
    if (!preferences.enabled || !preferences.dailySummary) return [];

    const today = new Date().toISOString().split("T")[0];
    const records = await this.attendanceRepo.getByDateRange(today, today);

    const totalLectures = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const percentage = totalLectures > 0 ? Math.round((present / totalLectures) * 100) : 0;

    const notification: Notification = {
      id: `daily-summary-${Date.now()}`,
      type: "daily_summary",
      title: "Daily Attendance Summary",
      body: `You attended ${present} out of ${totalLectures} lectures today (${percentage}%).`,
      priority: "low",
      status: "unread",
      subjectId: null,
      subjectName: null,
      subjectColor: null,
      lectureSlotId: null,
      date: today,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      readAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.notifications = [notification, ...this.notifications];
    return [notification];
  }

  async generateSafeBunkNotifications(): Promise<Notification[]> {
    const preferences = await this.getPreferences();
    if (!preferences.enabled || !preferences.safeBunkWarnings) return [];

    const subjects = await this.subjectRepo.getAll();
    const settings = await this.settingsRepo.getSettings();
    const targetAttendance = settings?.targetAttendance ?? 75;

    const notifications: Notification[] = [];

    for (const subject of subjects) {
      const records = await this.attendanceRepo.getBySubject(subject.id);
      if (records.length === 0) continue;

      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const percentage = Math.round((present / total) * 100);

      if (percentage > targetAttendance + 10) {
        const notification: Notification = {
          id: `safe-bunk-${subject.id}-${Date.now()}`,
          type: "safe_bunk",
          title: `Safe to Skip: ${subject.name}`,
          body: `Your attendance is ${percentage}%. You can safely skip some lectures.`,
          priority: "low",
          status: "unread",
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          lectureSlotId: null,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          readAt: null,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        notifications.push(notification);
      }
    }

    this.notifications = [...notifications, ...this.notifications];
    return notifications;
  }

  async generateAllNotifications(): Promise<Notification[]> {
    const allNotifications: Notification[] = [];

    const lectureReminders = await this.generateLectureReminders();
    allNotifications.push(...lectureReminders);

    const lowAttendanceWarnings = await this.generateLowAttendanceWarnings();
    allNotifications.push(...lowAttendanceWarnings);

    const dailySummary = await this.generateDailySummary();
    allNotifications.push(...dailySummary);

    const safeBunkNotifications = await this.generateSafeBunkNotifications();
    allNotifications.push(...safeBunkNotifications);

    return allNotifications;
  }

  getNotificationGroups(notifications: Notification[]): NotificationGroup[] {
    const groups = new Map<string, Notification[]>();

    for (const notification of notifications) {
      const date = notification.date;
      const existing = groups.get(date) ?? [];
      groups.set(date, [...existing, notification]);
    }

    return Array.from(groups.entries())
      .map(([date, notifs]) => ({
        date,
        label: this.formatDateLabel(date),
        notifications: notifs,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  private formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Today";
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHoursEnabled) return false;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;

    return currentTime >= preferences.quietHoursStart || currentTime < preferences.quietHoursEnd;
  }

  shouldShowNotification(type: NotificationType, preferences: NotificationPreferences): boolean {
    if (!preferences.enabled) return false;
    if (this.isQuietHours(preferences) && type !== "semester_alert") return false;

    const today = new Date().getDay();
    if (!preferences.weekendNotifications && (today === 0 || today === 6)) return false;

    switch (type) {
      case "lecture_reminder":
        return preferences.lectureReminders;
      case "attendance_reminder":
        return preferences.attendanceReminders;
      case "low_attendance":
        return preferences.lowAttendanceAlerts;
      case "daily_summary":
        return preferences.dailySummary;
      case "weekly_summary":
        return preferences.weeklySummary;
      case "monthly_summary":
        return preferences.monthlySummary;
      case "goal_reminder":
        return preferences.goalReminders;
      case "safe_bunk":
        return preferences.safeBunkWarnings;
      case "semester_alert":
        return preferences.semesterAlerts;
      case "achievement":
        return preferences.achievements;
      default:
        return true;
    }
  }
}

let notificationServiceInstance: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
}
