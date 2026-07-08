import { useCallback, useEffect, useMemo, useReducer } from "react";

import { getDatabase } from "@/database/database";
import {
  SubjectRepository,
  AttendanceRepository,
  SemesterRepository,
} from "@/database/repositories";
import { calculateSimulation, calculateSafeBunks } from "@/engine/attendance";
import type {
  SimulationState,
  SimulationSubject,
  SimulationResult,
  SimulationScenario,
  SimulationInsight,
  SimulationRecommendation,
  SimulationMode,
  SimulationPreset,
} from "../types";

const initialState: SimulationState = {
  isLoading: true,
  error: null,
  semester: null,
  subjects: [],
  selectedSubjectId: null,
  mode: "overall",
  futurePresent: 0,
  futureAbsent: 0,
  result: null,
  scenarios: [],
  insights: [],
  recommendations: [],
  hasData: false,
};

function reducer(state: SimulationState, action: { type: string; payload?: any }): SimulationState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, ...action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload, futurePresent: 0, futureAbsent: 0 };
    case "SET_SUBJECT":
      return { ...state, selectedSubjectId: action.payload, futurePresent: 0, futureAbsent: 0 };
    case "SET_FUTURE_PRESENT":
      return { ...state, futurePresent: action.payload };
    case "SET_FUTURE_ABSENT":
      return { ...state, futureAbsent: action.payload };
    case "APPLY_PRESET":
      return {
        ...state,
        futurePresent: action.payload.futurePresent,
        futureAbsent: action.payload.futureAbsent,
      };
    case "RESET":
      return { ...state, futurePresent: 0, futureAbsent: 0 };
    default:
      return state;
  }
}

function getStatusFromPercentage(
  percentage: number,
): "excellent" | "good" | "safe" | "warning" | "critical" {
  if (percentage >= 90) return "excellent";
  if (percentage >= 80) return "good";
  if (percentage >= 75) return "safe";
  if (percentage >= 70) return "warning";
  return "critical";
}

function calculateSimulationResult(
  currentPresent: number,
  currentTotal: number,
  futurePresent: number,
  futureAbsent: number,
  goalPercentage: number,
): SimulationResult {
  const simResult = calculateSimulation({
    currentPresent,
    currentTotal,
    futurePresent,
    futureAbsent,
  });

  const safeBunkResult = calculateSafeBunks({
    currentPresent: currentPresent + futurePresent,
    currentTotal: currentTotal + futurePresent + futureAbsent,
    goalPercentage,
  });

  return {
    originalPercentage: simResult.originalPercentage,
    simulatedPercentage: simResult.simulatedPercentage,
    change: simResult.change,
    isImprovement: simResult.isImprovement,
    totalPresent: simResult.totalPresent,
    totalLectures: simResult.totalLectures,
    safeBunks: safeBunkResult.safeBunks,
    lecturesRequired: Math.max(0, goalPercentage - simResult.simulatedPercentage),
    goalPercentage,
    status: getStatusFromPercentage(simResult.simulatedPercentage),
  };
}

export function useSimulation() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const db = getDatabase();
      const subjectRepo = new SubjectRepository(db);
      const attendanceRepo = new AttendanceRepository(db);
      const semesterRepo = new SemesterRepository(db);

      const semesters = await semesterRepo.getAll();
      const currentSemester = semesters[0] ?? null;

      if (!currentSemester) {
        dispatch({
          type: "LOAD_SUCCESS",
          payload: {
            semester: null,
            subjects: [],
            hasData: false,
            result: null,
            scenarios: [],
            insights: [],
            recommendations: [],
          },
        });
        return;
      }

      const subjects = await subjectRepo.getBySemester(currentSemester.id);
      const allAttendance = await attendanceRepo.getAll({ limit: 2000 });

      const subjectStats = new Map<string, { present: number; total: number }>();
      for (const record of allAttendance) {
        if (
          record.status === "cancelled" ||
          record.status === "medical" ||
          record.status === "holiday"
        ) {
          continue;
        }
        const existing = subjectStats.get(record.subjectId) ?? { present: 0, total: 0 };
        existing.total++;
        if (record.status === "present" || record.status === "extraLecture") {
          existing.present++;
        }
        subjectStats.set(record.subjectId, existing);
      }

      const simulationSubjects: SimulationSubject[] = subjects.map((subject) => {
        const stats = subjectStats.get(subject.id) ?? { present: 0, total: 0 };
        const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        const safeBunkResult = calculateSafeBunks({
          currentPresent: stats.present,
          currentTotal: stats.total,
          goalPercentage: subject.minimumAttendance,
        });

        return {
          ...subject,
          currentPresent: stats.present,
          currentTotal: stats.total,
          currentPercentage: percentage,
          safeBunks: safeBunkResult.safeBunks,
        };
      });

      let totalLectures = 0;
      for (const subject of simulationSubjects) {
        totalLectures += subject.currentTotal;
      }

      const hasData = totalLectures > 0;

      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          semester: currentSemester,
          subjects: simulationSubjects,
          hasData,
          result: null,
          scenarios: [],
          insights: [],
          recommendations: [],
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load simulation data";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setMode = useCallback((mode: SimulationMode) => {
    dispatch({ type: "SET_MODE", payload: mode });
  }, []);

  const setSubject = useCallback((subjectId: string | null) => {
    dispatch({ type: "SET_SUBJECT", payload: subjectId });
  }, []);

  const setFuturePresent = useCallback((value: number) => {
    dispatch({ type: "SET_FUTURE_PRESENT", payload: Math.max(0, value) });
  }, []);

  const setFutureAbsent = useCallback((value: number) => {
    dispatch({ type: "SET_FUTURE_ABSENT", payload: Math.max(0, value) });
  }, []);

  const applyPreset = useCallback((preset: SimulationPreset) => {
    dispatch({ type: "APPLY_PRESET", payload: preset });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const simulationResult = useMemo(() => {
    if (!state.semester || state.subjects.length === 0) return null;

    let currentPresent = 0;
    let currentTotal = 0;
    let goalPercentage = state.semester.minimumAttendance;

    if (state.mode === "overall") {
      for (const subject of state.subjects) {
        currentPresent += subject.currentPresent;
        currentTotal += subject.currentTotal;
      }
    } else {
      const subject = state.subjects.find((s) => s.id === state.selectedSubjectId);
      if (subject) {
        currentPresent = subject.currentPresent;
        currentTotal = subject.currentTotal;
        goalPercentage = subject.minimumAttendance;
      } else {
        return null;
      }
    }

    return calculateSimulationResult(
      currentPresent,
      currentTotal,
      state.futurePresent,
      state.futureAbsent,
      goalPercentage,
    );
  }, [
    state.semester,
    state.subjects,
    state.mode,
    state.selectedSubjectId,
    state.futurePresent,
    state.futureAbsent,
  ]);

  const scenarios = useMemo(() => {
    if (!simulationResult) return [];

    const currentScenario: SimulationScenario = {
      id: "current",
      label: "Current",
      result: simulationResult,
    };

    const skipToday: SimulationScenario = {
      id: "skip-today",
      label: "Skip Today",
      result: calculateSimulationResult(
        simulationResult.totalPresent - simulationResult.change,
        simulationResult.totalLectures - state.futurePresent - state.futureAbsent,
        state.futurePresent,
        state.futureAbsent + 1,
        simulationResult.goalPercentage,
      ),
    };

    const attendAll: SimulationScenario = {
      id: "attend-all",
      label: "Attend All",
      result: calculateSimulationResult(
        simulationResult.totalPresent - simulationResult.change,
        simulationResult.totalLectures - state.futurePresent - state.futureAbsent,
        state.futurePresent + 5,
        state.futureAbsent,
        simulationResult.goalPercentage,
      ),
    };

    return [currentScenario, skipToday, attendAll];
  }, [simulationResult, state.futurePresent, state.futureAbsent]);

  const insights = useMemo(() => {
    if (!simulationResult) return [];

    const result: SimulationInsight[] = [];

    if (simulationResult.isImprovement) {
      result.push({
        id: "improvement",
        type: "success",
        message: `Your attendance will improve by ${simulationResult.change}%`,
      });
    } else if (simulationResult.change < 0) {
      result.push({
        id: "decline",
        type: "warning",
        message: `Your attendance will drop by ${Math.abs(simulationResult.change)}%`,
      });
    }

    if (simulationResult.simulatedPercentage < simulationResult.goalPercentage) {
      result.push({
        id: "below-goal",
        type: "danger",
        message: `You will be below your ${simulationResult.goalPercentage}% goal`,
      });
    }

    if (simulationResult.safeBunks > 0) {
      result.push({
        id: "safe-bunks",
        type: "info",
        message: `You can still safely miss ${simulationResult.safeBunks} more lectures`,
      });
    }

    return result;
  }, [simulationResult]);

  const recommendations = useMemo(() => {
    if (!simulationResult || !state.semester) return [];

    const result: SimulationRecommendation[] = [];

    if (simulationResult.simulatedPercentage < simulationResult.goalPercentage) {
      const lecturesNeeded = Math.ceil(
        (simulationResult.goalPercentage * simulationResult.totalLectures -
          simulationResult.totalPresent * 100) /
          (100 - simulationResult.goalPercentage),
      );
      result.push({
        id: "recover",
        message: `Attend the next ${lecturesNeeded} lectures to recover`,
        urgency: "high",
      });
    }

    if (simulationResult.safeBunks > 0 && simulationResult.isImprovement) {
      result.push({
        id: "safe-to-bunk",
        message: `You can safely miss ${simulationResult.safeBunks} lectures`,
        urgency: "low",
      });
    }

    return result;
  }, [simulationResult, state.semester]);

  useEffect(() => {
    if (simulationResult) {
      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          result: simulationResult,
          scenarios,
          insights,
          recommendations,
        },
      });
    }
  }, [simulationResult, scenarios, insights, recommendations]);

  return {
    ...state,
    setMode,
    setSubject,
    setFuturePresent,
    setFutureAbsent,
    applyPreset,
    reset,
    refresh: fetchData,
  };
}
