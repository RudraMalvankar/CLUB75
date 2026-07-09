import { useCallback, useMemo, useReducer } from "react";

import { BackupService } from "../services/backup-service";
import { RestoreService } from "../services/restore-service";
import { ResetService } from "../services/reset-service";
import type { BackupData, BackupValidationError } from "../types";
import { isBackupData, generateBackupName } from "../utils/backup-validator";

type BackupState = {
  isCreating: boolean;
  isRestoring: boolean;
  isResetting: boolean;
  lastBackup: BackupData | null;
  error: BackupValidationError | string | null;
  recordsRestored: number;
};

type BackupAction =
  | { type: "CREATE_START" }
  | { type: "CREATE_SUCCESS"; payload: BackupData }
  | { type: "CREATE_ERROR"; payload: string }
  | { type: "RESTORE_START" }
  | { type: "RESTORE_SUCCESS"; payload: number }
  | { type: "RESTORE_ERROR"; payload: BackupValidationError }
  | { type: "RESET_START" }
  | { type: "RESET_SUCCESS" }
  | { type: "RESET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

const initialState: BackupState = {
  isCreating: false,
  isRestoring: false,
  isResetting: false,
  lastBackup: null,
  error: null,
  recordsRestored: 0,
};

function reducer(state: BackupState, action: BackupAction): BackupState {
  switch (action.type) {
    case "CREATE_START":
      return { ...state, isCreating: true, error: null };
    case "CREATE_SUCCESS":
      return { ...state, isCreating: false, lastBackup: action.payload, error: null };
    case "CREATE_ERROR":
      return { ...state, isCreating: false, error: action.payload };
    case "RESTORE_START":
      return { ...state, isRestoring: true, error: null, recordsRestored: 0 };
    case "RESTORE_SUCCESS":
      return { ...state, isRestoring: false, recordsRestored: action.payload, error: null };
    case "RESTORE_ERROR":
      return { ...state, isRestoring: false, error: action.payload };
    case "RESET_START":
      return { ...state, isResetting: true, error: null };
    case "RESET_SUCCESS":
      return { ...state, isResetting: false, error: null };
    case "RESET_ERROR":
      return { ...state, isResetting: false, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function useBackup() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const backupService = useMemo(() => new BackupService(), []);
  const restoreService = useMemo(() => new RestoreService(), []);
  const resetService = useMemo(() => new ResetService(), []);

  const createBackup = useCallback(async () => {
    dispatch({ type: "CREATE_START" });
    try {
      const backup = await backupService.createBackup();
      const name = generateBackupName(backup.metadata);
      await backupService.saveBackupHistory(backup.metadata, name);
      dispatch({ type: "CREATE_SUCCESS", payload: backup });
      return backup;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create backup";
      dispatch({ type: "CREATE_ERROR", payload: message });
      return null;
    }
  }, [backupService]);

  const exportBackup = useCallback(async () => {
    const backup = await createBackup();
    if (!backup) return null;

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${generateBackupName(backup.metadata)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return backup;
  }, [createBackup]);

  const importBackup = useCallback(
    async (file: File): Promise<BackupData | null> => {
      try {
        const text = await file.text();
        const data = JSON.parse(text) as unknown;

        if (!isBackupData(data)) {
          dispatch({
            type: "RESTORE_ERROR",
            payload: { code: "INVALID_JSON", message: "Invalid backup file format" },
          });
          return null;
        }

        const validationError = await restoreService.validateBackup(data);
        if (validationError) {
          dispatch({ type: "RESTORE_ERROR", payload: validationError });
          return null;
        }

        return data;
      } catch {
        dispatch({
          type: "RESTORE_ERROR",
          payload: { code: "INVALID_JSON", message: "Failed to parse backup file" },
        });
        return null;
      }
    },
    [restoreService],
  );

  const restoreBackup = useCallback(
    async (data: BackupData) => {
      dispatch({ type: "RESTORE_START" });
      try {
        const result = await restoreService.restoreFromBackup(data);
        if (result.success) {
          dispatch({ type: "RESTORE_SUCCESS", payload: result.recordsRestored });
        } else if (result.error) {
          dispatch({ type: "RESTORE_ERROR", payload: result.error });
        }
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to restore backup";
        dispatch({ type: "RESTORE_ERROR", payload: { code: "CORRUPTED_DATA", message } });
        return { success: false, recordsRestored: 0 };
      }
    },
    [restoreService],
  );

  const resetApplication = useCallback(async () => {
    dispatch({ type: "RESET_START" });
    try {
      const result = await resetService.resetApplication();
      if (result.success) {
        dispatch({ type: "RESET_SUCCESS" });
      } else if (result.error) {
        dispatch({ type: "RESET_ERROR", payload: result.error });
      }
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset application";
      dispatch({ type: "RESET_ERROR", payload: message });
      return { success: false, error: message };
    }
  }, [resetService]);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return {
    isCreating: state.isCreating,
    isRestoring: state.isRestoring,
    isResetting: state.isResetting,
    lastBackup: state.lastBackup,
    error: state.error,
    recordsRestored: state.recordsRestored,
    createBackup,
    exportBackup,
    importBackup,
    restoreBackup,
    resetApplication,
    clearError,
  };
}
