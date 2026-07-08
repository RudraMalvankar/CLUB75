import { useCallback, useEffect, useReducer, useMemo } from "react";

import { AnalyticsService } from "../services/analytics.service";
import type { AnalyticsDashboard, AnalyticsFilter, AnalyticsTimeRange } from "../types";

type AnalyticsState = {
  readonly dashboard: AnalyticsDashboard;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly timeRange: AnalyticsTimeRange;
  readonly filter: AnalyticsFilter;
};

type AnalyticsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: AnalyticsDashboard }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SET_TIME_RANGE"; payload: AnalyticsTimeRange }
  | { type: "SET_FILTER"; payload: AnalyticsFilter };

const initialState: AnalyticsState = {
  dashboard: {
    summary: {
      overallPercentage: 0,
      goalPercentage: 75,
      difference: -75,
      status: "critical",
      semesterProgress: 0,
      totalLectures: 0,
      attended: 0,
      missed: 0,
      cancelled: 0,
      medical: 0,
      holiday: 0,
      safeBunks: 0,
      lecturesRequired: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
    subjects: [],
    trend: {
      direction: "stable",
      weeklyAverage: 0,
      monthlyAverage: 0,
      changeRate: 0,
      dataPoints: [],
    },
    risks: [],
    recommendations: [],
    distribution: {
      present: 0,
      absent: 0,
      cancelled: 0,
      medical: 0,
      holiday: 0,
      extraLectures: 0,
    },
    consistency: {
      score: 0,
      label: "No Data",
      description: "No attendance data available",
      weeklyStability: 0,
      monthlyStability: 0,
    },
    isLoading: true,
    error: null,
  },
  isLoading: true,
  error: null,
  timeRange: "semester",
  filter: {},
};

function reducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, dashboard: action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_TIME_RANGE":
      return { ...state, timeRange: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

type UseAnalyticsResult = {
  readonly dashboard: AnalyticsDashboard;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly timeRange: AnalyticsTimeRange;
  readonly setTimeRange: (range: AnalyticsTimeRange) => void;
  readonly setFilter: (filter: AnalyticsFilter) => void;
  readonly refresh: () => Promise<void>;
};

export function useAnalytics(): UseAnalyticsResult {
  const [state, dispatch] = useReducer(reducer, initialState);
  const service = useMemo(() => new AnalyticsService(), []);

  const fetchData = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    try {
      const filter: {
        subjectId?: string;
        startDate?: string;
        endDate?: string;
        lectureType?: string;
        status?: string;
      } = { ...state.filter };

      if (state.timeRange === "7days") {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        filter.startDate = date.toISOString().split("T")[0];
      } else if (state.timeRange === "30days") {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        filter.startDate = date.toISOString().split("T")[0];
      }

      const dashboard = await service.getDashboard(filter as AnalyticsFilter);
      dispatch({ type: "LOAD_SUCCESS", payload: dashboard });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load analytics";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, [state.timeRange, state.filter, service]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const setTimeRange = useCallback((range: AnalyticsTimeRange) => {
    dispatch({ type: "SET_TIME_RANGE", payload: range });
  }, []);

  const setFilter = useCallback((filter: AnalyticsFilter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  return {
    dashboard: state.dashboard,
    isLoading: state.isLoading,
    error: state.error,
    timeRange: state.timeRange,
    setTimeRange,
    setFilter,
    refresh: fetchData,
  };
}
