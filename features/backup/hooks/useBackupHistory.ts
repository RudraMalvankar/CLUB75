import { useCallback, useEffect, useMemo, useReducer } from "react";

import { BackupService } from "../services/backup-service";
import type { BackupMetadata } from "../types";

type HistoryState = {
  history: { name: string; metadata: BackupMetadata }[];
  isLoading: boolean;
  error: string | null;
};

type HistoryAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { name: string; metadata: BackupMetadata }[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "DELETE"; payload: number };

const initialState: HistoryState = {
  history: [],
  isLoading: true,
  error: null,
};

function reducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { history: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "DELETE":
      return {
        ...state,
        history: state.history.filter((h) => h.metadata.createdAt !== action.payload),
      };
    default:
      return state;
  }
}

export function useBackupHistory() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const service = useMemo(() => new BackupService(), []);

  const loadHistory = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const data = await service.getBackupHistory();
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload: err instanceof Error ? err.message : "Failed to load backup history",
      });
    }
  }, [service]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const deleteBackup = useCallback(
    async (createdAt: number) => {
      try {
        await service.deleteBackupHistory(createdAt);
        dispatch({ type: "DELETE", payload: createdAt });
      } catch (err) {
        dispatch({
          type: "LOAD_ERROR",
          payload: err instanceof Error ? err.message : "Failed to delete backup",
        });
      }
    },
    [service],
  );

  return {
    history: state.history,
    isLoading: state.isLoading,
    error: state.error,
    deleteBackup,
    refresh: loadHistory,
  };
}
