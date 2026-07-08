import { useCallback, useEffect, useReducer } from "react";

import type { AppearanceSettings, AttendanceGoalSettings, NotificationSettings } from "../types";
import * as settingsService from "../services/settings-service";

type SettingsState = {
  attendanceGoal: AttendanceGoalSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  isLoading: boolean;
  error: string | null;
};

type SettingsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Partial<SettingsState> }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "UPDATE_ATTENDANCE_GOAL"; payload: AttendanceGoalSettings }
  | { type: "UPDATE_APPEARANCE"; payload: AppearanceSettings }
  | { type: "UPDATE_NOTIFICATIONS"; payload: NotificationSettings };

const initialState: SettingsState = {
  attendanceGoal: { targetAttendance: 75, safeBuffer: 5 },
  appearance: {
    theme: "system",
    followSystem: true,
    accentColor: "#6366F1",
    reducedMotion: false,
    highContrast: false,
  },
  notifications: {
    enabled: true,
    attendanceReminders: true,
    lowAttendanceAlerts: true,
    dailySummary: false,
    reminderLeadMinutes: 15,
  },
  isLoading: true,
  error: null,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, ...action.payload, isLoading: false };
    case "LOAD_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "UPDATE_ATTENDANCE_GOAL":
      return { ...state, attendanceGoal: action.payload };
    case "UPDATE_APPEARANCE":
      return { ...state, appearance: action.payload };
    case "UPDATE_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
}

export function useSettings() {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const loadSettings = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const [attendanceGoal, appearance, notifications] = await Promise.all([
        settingsService.getAttendanceGoal(),
        settingsService.getAppearance(),
        settingsService.getNotifications(),
      ]);
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { attendanceGoal, appearance, notifications },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload: error instanceof Error ? error.message : "Failed to load settings",
      });
    }
  }, []);

  const updateAttendanceGoal = useCallback(async (settings: AttendanceGoalSettings) => {
    try {
      const updated = await settingsService.updateAttendanceGoal(settings);
      dispatch({ type: "UPDATE_ATTENDANCE_GOAL", payload: updated });
    } catch (error) {
      console.error("Failed to update attendance goal:", error);
    }
  }, []);

  const updateAppearance = useCallback(async (settings: AppearanceSettings) => {
    try {
      const updated = await settingsService.updateAppearance(settings);
      dispatch({ type: "UPDATE_APPEARANCE", payload: updated });
    } catch (error) {
      console.error("Failed to update appearance:", error);
    }
  }, []);

  const updateNotifications = useCallback(async (settings: NotificationSettings) => {
    try {
      const updated = await settingsService.updateNotifications(settings);
      dispatch({ type: "UPDATE_NOTIFICATIONS", payload: updated });
    } catch (error) {
      console.error("Failed to update notifications:", error);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  return {
    ...state,
    updateAttendanceGoal,
    updateAppearance,
    updateNotifications,
    refresh: loadSettings,
  };
}
