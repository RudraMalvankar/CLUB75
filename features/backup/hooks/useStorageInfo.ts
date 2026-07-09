import { useCallback, useEffect, useMemo, useReducer } from "react";

import { ResetService } from "../services/reset-service";

type StorageState = {
  totalRecords: number;
  recordCounts: Record<string, number>;
  isLoading: boolean;
};

type StorageAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: { totalRecords: number; recordCounts: Record<string, number> };
    };

const initialState: StorageState = {
  totalRecords: 0,
  recordCounts: {},
  isLoading: true,
};

function reducer(state: StorageState, action: StorageAction): StorageState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true };
    case "LOAD_SUCCESS":
      return { ...action.payload, isLoading: false };
    default:
      return state;
  }
}

export function useStorageInfo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const service = useMemo(() => new ResetService(), []);

  const loadStorageInfo = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const info = await service.getStorageInfo();
      dispatch({ type: "LOAD_SUCCESS", payload: info });
    } catch {
      dispatch({ type: "LOAD_SUCCESS", payload: { totalRecords: 0, recordCounts: {} } });
    }
  }, [service]);

  useEffect(() => {
    void loadStorageInfo();
  }, [loadStorageInfo]);

  return {
    totalRecords: state.totalRecords,
    recordCounts: state.recordCounts,
    isLoading: state.isLoading,
    refresh: loadStorageInfo,
  };
}
