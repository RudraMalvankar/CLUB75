import { useCallback, useEffect, useReducer } from "react";

import { getDatabase } from "@/database/database";
import { SubjectRepository, AttendanceRepository } from "@/database/repositories";
import { calculateSafeBunks } from "@/engine/attendance";
import type {
  AttendanceSubject,
  AttendanceRecordWithSubject,
  SubjectDetailState,
  AttendanceStats,
} from "../types";

const initialState: SubjectDetailState = {
  isLoading: true,
  error: null,
  subject: null,
  records: [],
  stats: {
    totalLectures: 0,
    attended: 0,
    missed: 0,
    percentage: 0,
    safeBunks: 0,
    goalPercentage: 75,
  },
};

function reducer(
  state: SubjectDetailState,
  action: { type: string; payload?: any },
): SubjectDetailState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, ...action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function useSubjectDetail(subjectId: string | null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    if (!subjectId) {
      dispatch({ type: "LOAD_ERROR", payload: "No subject ID provided" });
      return;
    }

    dispatch({ type: "LOAD_START" });
    try {
      const db = getDatabase();
      const subjectRepo = new SubjectRepository(db);
      const attendanceRepo = new AttendanceRepository(db);

      const subject = await subjectRepo.getById(subjectId);
      if (!subject) {
        dispatch({ type: "LOAD_ERROR", payload: "Subject not found" });
        return;
      }

      const records = await attendanceRepo.getBySubject(subjectId);

      let totalPresent = 0;
      let totalLectures = 0;
      for (const record of records) {
        if (
          record.status === "cancelled" ||
          record.status === "medical" ||
          record.status === "holiday"
        ) {
          continue;
        }
        totalLectures++;
        if (record.status === "present" || record.status === "extraLecture") {
          totalPresent++;
        }
      }

      const percentage = totalLectures > 0 ? Math.round((totalPresent / totalLectures) * 100) : 0;
      const safeBunkResult = calculateSafeBunks({
        currentPresent: totalPresent,
        currentTotal: totalLectures,
        goalPercentage: subject.minimumAttendance,
      });

      const recordsWithSubject: AttendanceRecordWithSubject[] = records.map((record) => ({
        ...record,
        subjectName: subject.name,
        subjectCode: subject.code,
        subjectColor: subject.color,
      }));

      const subjectData: AttendanceSubject = {
        ...subject,
        attendancePercentage: percentage,
        safeBunks: safeBunkResult.safeBunks,
        totalLectures,
        attended: totalPresent,
        missed: totalLectures - totalPresent,
        risk:
          percentage >= 90
            ? "none"
            : percentage >= 80
              ? "low"
              : percentage >= 75
                ? "medium"
                : percentage >= 70
                  ? "high"
                  : "critical",
        lastUpdated: records.length > 0 ? new Date(records[0]!.date) : null,
      };

      const stats: AttendanceStats = {
        totalLectures,
        attended: totalPresent,
        missed: totalLectures - totalPresent,
        percentage,
        safeBunks: safeBunkResult.safeBunks,
        goalPercentage: subject.minimumAttendance,
      };

      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          subject: subjectData,
          records: recordsWithSubject,
          stats,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load subject";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, [subjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refresh: fetchData,
  };
}
