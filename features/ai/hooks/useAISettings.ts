import { useCallback, useEffect, useMemo, useReducer } from "react";

import { getDatabase } from "@/database/database";
import { AISettingsService } from "@/features/ai/services/ai-settings-service";
import type { AISettings } from "@/features/ai/types";
import { DEFAULT_AI_SETTINGS } from "@/features/ai/types";

type SettingsState = {
  settings: AISettings;
  isLoading: boolean;
  error: string | null;
};

type SettingsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: AISettings }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "UPDATE_SUCCESS"; payload: AISettings }
  | { type: "RESET" };

const initialState: SettingsState = {
  settings: DEFAULT_AI_SETTINGS,
  isLoading: true,
  error: null,
};

function reducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { settings: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "UPDATE_SUCCESS":
      return { settings: action.payload, isLoading: false, error: null };
    case "RESET":
      return { settings: DEFAULT_AI_SETTINGS, isLoading: false, error: null };
    default:
      return state;
  }
}

export function useAISettings() {
  const db = getDatabase();
  const service = useMemo(() => new AISettingsService(db), [db]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadSettings = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const data = await service.getSettings();
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload: err instanceof Error ? err.message : "Failed to load AI settings",
      });
    }
  }, [service]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(
    async (updates: Partial<AISettings>) => {
      try {
        const updated = await service.updateSettings(updates);
        dispatch({ type: "UPDATE_SUCCESS", payload: updated });
      } catch (err) {
        dispatch({
          type: "LOAD_ERROR",
          payload: err instanceof Error ? err.message : "Failed to update AI settings",
        });
      }
    },
    [service],
  );

  const resetSettings = useCallback(async () => {
    try {
      await service.deleteSettings();
      dispatch({ type: "RESET" });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload: err instanceof Error ? err.message : "Failed to reset AI settings",
      });
    }
  }, [service]);

  return {
    settings: state.settings,
    isLoading: state.isLoading,
    error: state.error,
    updateSettings,
    resetSettings,
    refresh: loadSettings,
  };
}
