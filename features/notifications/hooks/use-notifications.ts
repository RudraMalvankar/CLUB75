import { useCallback, useEffect, useReducer } from "react";

import { getNotificationService } from "../services/notification-service";
import type { Notification, NotificationPreferences, NotificationGroup } from "../types";

type NotificationsState = {
  notifications: Notification[];
  groups: NotificationGroup[];
  preferences: NotificationPreferences;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
};

type NotificationsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Partial<NotificationsState> }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "ADD_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "ARCHIVE_NOTIFICATION"; payload: string }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "UPDATE_PREFERENCES"; payload: NotificationPreferences };

const initialState: NotificationsState = {
  notifications: [],
  groups: [],
  preferences: {
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
  },
  unreadCount: 0,
  isLoading: true,
  error: null,
};

function notificationsReducer(
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, ...action.payload, isLoading: false };
    case "LOAD_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_NOTIFICATIONS": {
      const newNotifications = [...action.payload, ...state.notifications];
      const service = getNotificationService();
      return {
        ...state,
        notifications: newNotifications,
        groups: service.getNotificationGroups(newNotifications),
        unreadCount: newNotifications.filter((n) => n.status === "unread").length,
      };
    }
    case "MARK_AS_READ": {
      const updated = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, status: "read" as const, readAt: Date.now() } : n,
      );
      const service = getNotificationService();
      return {
        ...state,
        notifications: updated,
        groups: service.getNotificationGroups(updated),
        unreadCount: updated.filter((n) => n.status === "unread").length,
      };
    }
    case "MARK_ALL_AS_READ": {
      const updated = state.notifications.map((n) => ({
        ...n,
        status: "read" as const,
        readAt: Date.now(),
      }));
      const service = getNotificationService();
      return {
        ...state,
        notifications: updated,
        groups: service.getNotificationGroups(updated),
        unreadCount: 0,
      };
    }
    case "ARCHIVE_NOTIFICATION": {
      const updated = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, status: "archived" as const } : n,
      );
      const service = getNotificationService();
      return {
        ...state,
        notifications: updated,
        groups: service.getNotificationGroups(updated),
        unreadCount: updated.filter((n) => n.status === "unread").length,
      };
    }
    case "DELETE_NOTIFICATION": {
      const updated = state.notifications.filter((n) => n.id !== action.payload);
      const service = getNotificationService();
      return {
        ...state,
        notifications: updated,
        groups: service.getNotificationGroups(updated),
        unreadCount: updated.filter((n) => n.status === "unread").length,
      };
    }
    case "UPDATE_PREFERENCES":
      return { ...state, preferences: action.payload };
    default:
      return state;
  }
}

export function useNotifications() {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);
  const notificationService = getNotificationService();

  const loadNotifications = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const [notifications, preferences] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getPreferences(),
      ]);

      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          notifications,
          groups: notificationService.getNotificationGroups(notifications),
          preferences,
          unreadCount: notifications.filter((n) => n.status === "unread").length,
        },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload: error instanceof Error ? error.message : "Failed to load notifications",
      });
    }
  }, [notificationService]);

  const generateNotifications = useCallback(async () => {
    try {
      const newNotifications = await notificationService.generateAllNotifications();
      if (newNotifications.length > 0) {
        dispatch({ type: "ADD_NOTIFICATIONS", payload: newNotifications });
      }
    } catch (error) {
      console.error("Failed to generate notifications:", error);
    }
  }, [notificationService]);

  const markAsRead = useCallback(
    async (id: string) => {
      await notificationService.markAsRead(id);
      dispatch({ type: "MARK_AS_READ", payload: id });
    },
    [notificationService],
  );

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    dispatch({ type: "MARK_ALL_AS_READ" });
  }, [notificationService]);

  const archiveNotification = useCallback(
    async (id: string) => {
      await notificationService.archiveNotification(id);
      dispatch({ type: "ARCHIVE_NOTIFICATION", payload: id });
    },
    [notificationService],
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      await notificationService.deleteNotification(id);
      dispatch({ type: "DELETE_NOTIFICATION", payload: id });
    },
    [notificationService],
  );

  const refresh = useCallback(async () => {
    await loadNotifications();
    await generateNotifications();
  }, [loadNotifications, generateNotifications]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    refresh,
    generateNotifications,
  };
}
