import { useCallback, useEffect, useMemo, useReducer } from "react";

import { TimetableService } from "../services/timetable.service";
import type {
  DayOfWeek,
  TimetableDay,
  TimetableFilters,
  TimetableLecture,
  TimetableStats,
} from "../types";

type TimetableState = {
  readonly days: TimetableDay[];
  readonly selectedDay: DayOfWeek;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly filters: TimetableFilters;
  readonly searchResults: TimetableLecture[];
};

type TimetableAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: TimetableDay[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SET_DAY"; payload: DayOfWeek }
  | { type: "SET_FILTERS"; payload: TimetableFilters }
  | { type: "SET_SEARCH_RESULTS"; payload: TimetableLecture[] };

const initialState: TimetableState = {
  days: [],
  selectedDay: (() => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return dayNames[new Date().getDay()] as DayOfWeek;
  })(),
  isLoading: true,
  error: null,
  filters: {},
  searchResults: [],
};

function reducer(state: TimetableState, action: TimetableAction): TimetableState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, days: action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_DAY":
      return { ...state, selectedDay: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
}

type UseTimetableResult = {
  readonly days: TimetableDay[];
  readonly currentDay: TimetableDay | null;
  readonly selectedDay: DayOfWeek;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly stats: TimetableStats;
  readonly filteredLectures: TimetableLecture[];
  readonly searchResults: TimetableLecture[];
  readonly selectDay: (day: DayOfWeek) => void;
  readonly setFilters: (filters: TimetableFilters) => void;
  readonly search: (query: string) => void;
  readonly clearSearch: () => void;
  readonly refresh: () => Promise<void>;
};

export function useTimetable(semesterId: string | null): UseTimetableResult {
  const [state, dispatch] = useReducer(reducer, initialState);

  const service = useMemo(() => new TimetableService(), []);

  const fetchData = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    if (!semesterId) {
      dispatch({ type: "LOAD_SUCCESS", payload: [] });
      return;
    }

    try {
      const data = await service.getAllLectures(semesterId);
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load timetable";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, [semesterId, service]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const currentDay = useMemo(
    () => state.days.find((d) => d.day === state.selectedDay) ?? null,
    [state.days, state.selectedDay],
  );

  const allLectures = useMemo(() => state.days.flatMap((d) => d.lectures), [state.days]);

  const filteredLectures = useMemo(
    () => service.filterLectures(allLectures, state.filters),
    [allLectures, state.filters, service],
  );

  const search = useCallback(
    async (query: string) => {
      if (!semesterId || !query.trim()) {
        dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
        return;
      }
      const results = await service.searchLectures(semesterId, query);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
    },
    [semesterId, service],
  );

  const clearSearch = useCallback(() => {
    dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
  }, []);

  const stats = useMemo(() => service.getStats(state.days), [state.days, service]);

  return {
    days: state.days,
    currentDay,
    selectedDay: state.selectedDay,
    isLoading: state.isLoading,
    error: state.error,
    stats,
    filteredLectures,
    searchResults: state.searchResults,
    selectDay: (day) => dispatch({ type: "SET_DAY", payload: day }),
    setFilters: (filters) => dispatch({ type: "SET_FILTERS", payload: filters }),
    search,
    clearSearch,
    refresh: fetchData,
  };
}
