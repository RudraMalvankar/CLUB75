import { useCallback, useEffect, useReducer, useMemo } from "react";

import { getDatabase } from "@/database/database";
import {
  SubjectRepository,
  AttendanceRepository,
  TimetableRepository,
  LectureRepository,
  SemesterRepository,
  GoalRepository,
} from "@/database/repositories";
import { calculateStatistics, calculateSafeBunks } from "@/engine/attendance";
import type {
  DashboardState,
  DashboardSubject,
  DashboardLecture,
  DashboardInsight,
  DashboardActivity,
  DayOfWeek,
} from "./types";

const initialState: DashboardState = {
  isLoading: true,
  error: null,
  semester: null,
  subjects: [],
  todayLectures: [],
  overallAttendance: {
    percentage: 0,
    totalLectures: 0,
    attended: 0,
    missed: 0,
    safeBunks: 0,
    goalPercentage: 75,
    currentWeek: 0,
    totalWeeks: 0,
    status: "safe",
  },
  safeBunk: {
    canBunk: false,
    safeBunks: 0,
    message: "No data available",
    currentPercentage: 0,
    goalPercentage: 75,
  },
  trend: {
    direction: "stable",
    weeklyAverage: 0,
    changeRate: 0,
  },
  insights: [],
  recentActivity: [],
  hasData: false,
};

function reducer(state: DashboardState, action: { type: string; payload?: any }): DashboardState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, isLoading: false, ...action.payload };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "REFRESH":
      return { ...state, isLoading: true, error: null };
    default:
      return state;
  }
}

function getTodayDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[new Date().getDay()]!;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusFromPercentage(
  percentage: number,
  goal: number,
): "safe" | "warning" | "critical" {
  if (percentage >= goal + 5) return "safe";
  if (percentage >= goal) return "warning";
  return "critical";
}

function getSafeBunkMessage(canBunk: boolean, safeBunks: number): string {
  if (canBunk && safeBunks > 0) {
    return `You can safely skip ${safeBunks} lecture${safeBunks > 1 ? "s" : ""} today.`;
  }
  return "You should attend today's classes.";
}

export function useDashboardData() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    try {
      const db = getDatabase();
      const subjectRepo = new SubjectRepository(db);
      const attendanceRepo = new AttendanceRepository(db);
      const timetableRepo = new TimetableRepository(db);
      const lectureRepo = new LectureRepository(db);
      const semesterRepo = new SemesterRepository(db);
      const goalRepo = new GoalRepository(db);

      const semesters = await semesterRepo.getAll();
      const currentSemester = semesters[0] ?? null;

      if (!currentSemester) {
        dispatch({
          type: "LOAD_SUCCESS",
          payload: {
            semester: null,
            subjects: [],
            todayLectures: [],
            overallAttendance: initialState.overallAttendance,
            safeBunk: initialState.safeBunk,
            trend: initialState.trend,
            insights: [],
            recentActivity: [],
            hasData: false,
          },
        });
        return;
      }

      const subjects = await subjectRepo.getBySemester(currentSemester.id);
      const allAttendance = await attendanceRepo.getAll({ limit: 1000 });
      const todayDay = getTodayDayOfWeek();
      const todaySlots = await lectureRepo.findByDay(currentSemester.id, todayDay);
      const allTimetable = await timetableRepo.getAll({ limit: 500 });

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

      let totalPresent = 0;
      let totalLectures = 0;
      const dashboardSubjects: DashboardSubject[] = subjects.map((subject) => {
        const stats = subjectStats.get(subject.id) ?? { present: 0, total: 0 };
        const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        const safeBunkResult = calculateSafeBunks({
          currentPresent: stats.present,
          currentTotal: stats.total,
          goalPercentage: subject.minimumAttendance,
        });

        totalPresent += stats.present;
        totalLectures += stats.total;

        return {
          ...subject,
          attendancePercentage: percentage,
          safeBunks: safeBunkResult.safeBunks,
          totalLectures: stats.total,
          attended: stats.present,
          missed: stats.total - stats.present,
        };
      });

      const overallPercentage =
        totalLectures > 0 ? Math.round((totalPresent / totalLectures) * 100) : 0;
      const overallSafeBunk = calculateSafeBunks({
        currentPresent: totalPresent,
        currentTotal: totalLectures,
        goalPercentage: currentSemester.minimumAttendance,
      });

      const todayLectures: DashboardLecture[] = todaySlots
        .map((slot) => {
          const timetableEntry = allTimetable.find((t) => t.lectureSlotId === slot.id);
          const subject = subjects.find((s) => s.id === timetableEntry?.subjectId);
          if (!subject || !timetableEntry) return null;

          const stats = subjectStats.get(subject.id) ?? { present: 0, total: 0 };
          const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

          const lecture: DashboardLecture = {
            id: slot.id,
            subjectName: subject.name,
            subjectCode: subject.code,
            subjectColor: subject.color,
            faculty: timetableEntry.faculty ?? slot.label,
            room: timetableEntry.room,
            startTime: slot.startTime,
            endTime: slot.endTime,
            lectureType: timetableEntry.lectureType,
            attendancePercentage: percentage,
            status: "upcoming",
          };
          return lecture;
        })
        .filter((lecture): lecture is DashboardLecture => lecture !== null)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      const statistics = calculateStatistics({ records: allAttendance as any });

      const goals = await goalRepo.getActive();
      const insights: DashboardInsight[] = [];

      if (statistics.trends.direction === "declining") {
        insights.push({
          id: "trend-declining",
          type: "warning",
          message: "Your attendance trend is declining. Consider attending more classes.",
        });
      } else if (statistics.trends.direction === "improving") {
        insights.push({
          id: "trend-improving",
          type: "success",
          message: "Great job! Your attendance is improving.",
        });
      }

      if (overallSafeBunk.safeBunks > 0) {
        insights.push({
          id: "safe-bunk-info",
          type: "info",
          message: `You can safely miss ${overallSafeBunk.safeBunks} more lectures.`,
        });
      }

      const criticalSubjects = dashboardSubjects.filter(
        (s) => s.attendancePercentage < currentSemester.minimumAttendance,
      );
      for (const subject of criticalSubjects) {
        insights.push({
          id: `critical-${subject.id}`,
          type: "danger",
          message: `${subject.name} attendance is critical at ${subject.attendancePercentage}%.`,
          subjectId: subject.id,
        });
      }

      if (goals.length > 0) {
        const overallGoal = goals.find((g) => g.scope === "overall");
        if (overallGoal && overallPercentage < overallGoal.targetAttendance) {
          insights.push({
            id: "goal-warning",
            type: "warning",
            message: `You need ${overallGoal.targetAttendance - overallPercentage}% more to reach your goal.`,
          });
        }
      }

      const recentActivity: DashboardActivity[] = allAttendance
        .slice(0, 5)
        .map((record) => {
          const subject = subjects.find((s) => s.id === record.subjectId);
          return {
            id: record.id,
            type: "attendance" as const,
            message: `Marked ${subject?.name ?? "Unknown"} ${record.status}`,
            timestamp: new Date(record.createdAt),
            subjectId: record.subjectId,
          };
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          semester: currentSemester,
          subjects: dashboardSubjects,
          todayLectures,
          overallAttendance: {
            percentage: overallPercentage,
            totalLectures,
            attended: totalPresent,
            missed: totalLectures - totalPresent,
            safeBunks: overallSafeBunk.safeBunks,
            goalPercentage: currentSemester.minimumAttendance,
            currentWeek: currentSemester.currentWeek,
            totalWeeks: Math.ceil(
              (new Date(currentSemester.endDate).getTime() -
                new Date(currentSemester.startDate).getTime()) /
                (7 * 24 * 60 * 60 * 1000),
            ),
            status: getStatusFromPercentage(overallPercentage, currentSemester.minimumAttendance),
          },
          safeBunk: {
            canBunk: overallSafeBunk.safeBunks > 0,
            safeBunks: overallSafeBunk.safeBunks,
            message: getSafeBunkMessage(overallSafeBunk.safeBunks > 0, overallSafeBunk.safeBunks),
            currentPercentage: overallSafeBunk.currentPercentage,
            goalPercentage: overallSafeBunk.goalPercentage,
          },
          trend: {
            direction: statistics.trends.direction,
            weeklyAverage: statistics.trends.weeklyAverage,
            changeRate: statistics.trends.changeRate,
          },
          insights,
          recentActivity,
          hasData: totalLectures > 0,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load dashboard data";
      dispatch({ type: "LOAD_ERROR", payload: message });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    dispatch({ type: "REFRESH" });
    fetchData();
  }, [fetchData]);

  const greeting = useMemo(() => getGreeting(), []);
  const date = useMemo(() => formatDate(new Date()), []);

  return {
    ...state,
    greeting,
    date,
    refresh,
  };
}
