import { useCallback, useEffect, useReducer } from "react";

import { getCalendarService } from "../services/calendar-service";
import type {
  CalendarEvent,
  CalendarView,
  CalendarFilter,
  AttendanceSummary,
  AgendaItem,
  CalendarMonthSummary,
  CalendarWeekSummary,
} from "../types";

type CalendarState = {
  currentDate: Date;
  selectedDate: string | null;
  view: CalendarView;
  events: CalendarEvent[];
  monthSummary: CalendarMonthSummary | null;
  weekSummary: CalendarWeekSummary | null;
  agenda: AgendaItem[];
  selectedDayEvents: CalendarEvent[];
  selectedDaySummary: AttendanceSummary | null;
  isLoading: boolean;
  error: string | null;
};

type CalendarAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Partial<CalendarState> }
  | { type: "LOAD_FAILURE"; payload: string }
  | { type: "SET_VIEW"; payload: CalendarView }
  | { type: "SET_SELECTED_DATE"; payload: string | null }
  | { type: "SET_CURRENT_DATE"; payload: Date }
  | { type: "NAVIGATE_MONTH"; payload: number }
  | { type: "NAVIGATE_WEEK"; payload: number }
  | { type: "NAVIGATE_DAY"; payload: number }
  | { type: "GO_TO_TODAY" };

const initialState: CalendarState = {
  currentDate: new Date(),
  selectedDate: null,
  view: "month",
  events: [],
  monthSummary: null,
  weekSummary: null,
  agenda: [],
  selectedDayEvents: [],
  selectedDaySummary: null,
  isLoading: true,
  error: null,
};

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, ...action.payload, isLoading: false };
    case "LOAD_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_CURRENT_DATE":
      return { ...state, currentDate: action.payload };
    case "NAVIGATE_MONTH": {
      const newDate = new Date(state.currentDate);
      newDate.setMonth(newDate.getMonth() + action.payload);
      return { ...state, currentDate: newDate };
    }
    case "NAVIGATE_WEEK": {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() + action.payload * 7);
      return { ...state, currentDate: newDate };
    }
    case "NAVIGATE_DAY": {
      const newDate = new Date(state.currentDate);
      newDate.setDate(newDate.getDate() + action.payload);
      return { ...state, currentDate: newDate };
    }
    case "GO_TO_TODAY":
      return {
        ...state,
        currentDate: new Date(),
        selectedDate: getCalendarService().formatDate(new Date()),
      };
    default:
      return state;
  }
}

export function useCalendar(filter?: CalendarFilter) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const calendarService = getCalendarService();

  const formatDate = useCallback(
    (date: Date) => calendarService.formatDate(date),
    [calendarService],
  );

  const loadMonthEvents = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const year = state.currentDate.getFullYear();
      const month = state.currentDate.getMonth();
      const [events, monthSummary] = await Promise.all([
        calendarService.getMonthEvents(year, month, filter),
        calendarService.getMonthSummary(year, month),
      ]);
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { events, monthSummary },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload: error instanceof Error ? error.message : "Failed to load calendar",
      });
    }
  }, [state.currentDate, calendarService, filter]);

  const loadWeekEvents = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const startDate = calendarService.getWeekStart(formatDate(state.currentDate));
      const endDate = calendarService.getWeekEnd(formatDate(state.currentDate));
      const [events, weekSummary] = await Promise.all([
        calendarService.getWeekEvents(startDate, endDate, filter),
        calendarService.getWeekSummary(startDate, endDate),
      ]);
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { events, weekSummary },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload: error instanceof Error ? error.message : "Failed to load calendar",
      });
    }
  }, [state.currentDate, calendarService, filter, formatDate]);

  const loadDayEvents = useCallback(
    async (date: string) => {
      dispatch({ type: "LOAD_START" });
      try {
        const [events, summary] = await Promise.all([
          calendarService.getDayEvents(date, filter),
          calendarService.getAttendanceSummary(date),
        ]);
        dispatch({
          type: "LOAD_SUCCESS",
          payload: { selectedDayEvents: events, selectedDaySummary: summary, selectedDate: date },
        });
      } catch (error) {
        dispatch({
          type: "LOAD_FAILURE",
          payload: error instanceof Error ? error.message : "Failed to load day events",
        });
      }
    },
    [calendarService, filter],
  );

  const loadAgenda = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const startDate = formatDate(state.currentDate);
      const agenda = await calendarService.getAgendaEvents(startDate, 14);
      dispatch({
        type: "LOAD_SUCCESS",
        payload: { agenda },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FAILURE",
        payload: error instanceof Error ? error.message : "Failed to load agenda",
      });
    }
  }, [state.currentDate, calendarService, formatDate]);

  const refresh = useCallback(async () => {
    if (state.view === "month") await loadMonthEvents();
    else if (state.view === "week") await loadWeekEvents();
    else if (state.view === "agenda") await loadAgenda();
  }, [state.view, loadMonthEvents, loadWeekEvents, loadAgenda]);

  const setView = useCallback((view: CalendarView) => {
    dispatch({ type: "SET_VIEW", payload: view });
  }, []);

  const setSelectedDate = useCallback((date: string | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  }, []);

  const navigateMonth = useCallback((delta: number) => {
    dispatch({ type: "NAVIGATE_MONTH", payload: delta });
  }, []);

  const navigateWeek = useCallback((delta: number) => {
    dispatch({ type: "NAVIGATE_WEEK", payload: delta });
  }, []);

  const navigateDay = useCallback((delta: number) => {
    dispatch({ type: "NAVIGATE_DAY", payload: delta });
  }, []);

  const goToToday = useCallback(() => {
    dispatch({ type: "GO_TO_TODAY" });
  }, []);

  useEffect(() => {
    void refresh();
  }, [state.currentDate, state.view, refresh]);

  return {
    ...state,
    setView,
    setSelectedDate,
    navigateMonth,
    navigateWeek,
    navigateDay,
    goToToday,
    refresh,
    loadDayEvents,
    formatDate,
    isToday: calendarService.isToday,
    getMonthName: calendarService.getMonthName,
    getDayName: calendarService.getDayName,
  };
}
