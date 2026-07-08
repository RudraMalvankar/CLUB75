import { useCallback, useEffect, useReducer } from "react";

import { getDatabase } from "@/database/database";
import {
  SubjectRepository,
  AttendanceRepository,
  SemesterRepository,
} from "@/database/repositories";
import { calculateSafeBunks } from "@/engine/attendance";
import type {
  AttendanceSubject,
  AttendanceScreenState,
  AttendanceFilter,
  SortOption,
  AddAttendancePayload,
  UpdateAttendancePayload,
} from "../types";

const initialState: AttendanceScreenState = {
  isLoading: true,
  error: null,
  subjects: [],
  searchQuery: "",
  filter: {
    status: "all",
    subjectId: null,
    dateRange: null,
    lectureType: null,
  },
  sort: "percentage",
};

function reducer(
  state: AttendanceScreenState,
  action: { type: string; payload?: any },
): AttendanceScreenState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, subjects: action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTER":
      return { ...state, filter: { ...state.filter, ...action.payload } };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "OPTIMISTIC_ADD":
      return { ...state, subjects: action.payload };
    case "OPTIMISTIC_DELETE":
      return { ...state, subjects: action.payload };
    default:
      return state;
  }
}

function getRiskLevel(percentage: number): "none" | "low" | "medium" | "high" | "critical" {
  if (percentage >= 90) return "none";
  if (percentage >= 80) return "low";
  if (percentage >= 75) return "medium";
  if (percentage >= 70) return "high";
  return "critical";
}

function filterSubjects(
  subjects: AttendanceSubject[],
  searchQuery: string,
  filter: AttendanceFilter,
): AttendanceSubject[] {
  let filtered = subjects;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.faculty.toLowerCase().includes(query),
    );
  }

  if (filter.status !== "all") {
    filtered = filtered.filter((s) => {
      if (filter.status === "safe") return s.attendancePercentage >= s.minimumAttendance + 5;
      if (filter.status === "warning")
        return (
          s.attendancePercentage >= s.minimumAttendance &&
          s.attendancePercentage < s.minimumAttendance + 5
        );
      if (filter.status === "critical") return s.attendancePercentage < s.minimumAttendance;
      return true;
    });
  }

  if (filter.subjectId) {
    filtered = filtered.filter((s) => s.id === filter.subjectId);
  }

  return filtered;
}

function sortSubjects(subjects: AttendanceSubject[], sort: SortOption): AttendanceSubject[] {
  const sorted = [...subjects];
  switch (sort) {
    case "percentage":
      return sorted.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "lastUpdated":
      return sorted.sort((a, b) => {
        const aTime = a.lastUpdated?.getTime() ?? 0;
        const bTime = b.lastUpdated?.getTime() ?? 0;
        return bTime - aTime;
      });
    case "safeBunks":
      return sorted.sort((a, b) => b.safeBunks - a.safeBunks);
    case "highestRisk": {
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
      return sorted.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
    }
    default:
      return sorted;
  }
}

export function useAttendance() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const db = getDatabase();
      const subjectRepo = new SubjectRepository(db);
      const attendanceRepo = new AttendanceRepository(db);
      const semesterRepo = new SemesterRepository(db);

      const semesters = await semesterRepo.getAll();
      const currentSemester = semesters[0];

      if (!currentSemester) {
        dispatch({ type: "LOAD_SUCCESS", payload: [] });
        return;
      }

      const subjects = await subjectRepo.getBySemester(currentSemester.id);
      const allAttendance = await attendanceRepo.getAll({ limit: 2000 });

      const subjectStats = new Map<
        string,
        { present: number; total: number; lastDate: string | null }
      >();
      for (const record of allAttendance) {
        if (
          record.status === "cancelled" ||
          record.status === "medical" ||
          record.status === "holiday"
        ) {
          continue;
        }
        const existing = subjectStats.get(record.subjectId) ?? {
          present: 0,
          total: 0,
          lastDate: null,
        };
        existing.total++;
        if (record.status === "present" || record.status === "extraLecture") {
          existing.present++;
        }
        if (!existing.lastDate || record.date > existing.lastDate) {
          existing.lastDate = record.date;
        }
        subjectStats.set(record.subjectId, existing);
      }

      const dashboardSubjects: AttendanceSubject[] = subjects.map((subject) => {
        const stats = subjectStats.get(subject.id) ?? { present: 0, total: 0, lastDate: null };
        const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        const safeBunkResult = calculateSafeBunks({
          currentPresent: stats.present,
          currentTotal: stats.total,
          goalPercentage: subject.minimumAttendance,
        });

        return {
          ...subject,
          attendancePercentage: percentage,
          safeBunks: safeBunkResult.safeBunks,
          totalLectures: stats.total,
          attended: stats.present,
          missed: stats.total - stats.present,
          risk: getRiskLevel(percentage),
          lastUpdated: stats.lastDate ? new Date(stats.lastDate) : null,
        };
      });

      dispatch({ type: "LOAD_SUCCESS", payload: dashboardSubjects });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load attendance";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setSearch = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", payload: query });
  }, []);

  const setFilter = useCallback((filter: Partial<AttendanceFilter>) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  const addAttendance = useCallback(
    async (payload: AddAttendancePayload) => {
      try {
        const db = getDatabase();
        const attendanceRepo = new AttendanceRepository(db);

        await attendanceRepo.insert({
          subjectId: payload.subjectId,
          date: payload.date,
          status: payload.status,
          lectureNumber: payload.lectureNumber,
          notes: payload.notes,
        });

        await fetchData();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to add attendance";
        dispatch({ type: "LOAD_ERROR", payload: message });
      }
    },
    [fetchData],
  );

  const updateAttendance = useCallback(
    async (id: string, payload: UpdateAttendancePayload) => {
      try {
        const db = getDatabase();
        const attendanceRepo = new AttendanceRepository(db);

        await attendanceRepo.update(id, payload);
        await fetchData();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update attendance";
        dispatch({ type: "LOAD_ERROR", payload: message });
      }
    },
    [fetchData],
  );

  const deleteAttendance = useCallback(
    async (id: string) => {
      try {
        const db = getDatabase();
        const attendanceRepo = new AttendanceRepository(db);

        await attendanceRepo.delete(id);
        await fetchData();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete attendance";
        dispatch({ type: "LOAD_ERROR", payload: message });
      }
    },
    [fetchData],
  );

  const filteredSubjects = filterSubjects(state.subjects, state.searchQuery, state.filter);
  const sortedSubjects = sortSubjects(filteredSubjects, state.sort);

  return {
    ...state,
    subjects: sortedSubjects,
    setSearch,
    setFilter,
    setSort,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    refresh: fetchData,
  };
}
