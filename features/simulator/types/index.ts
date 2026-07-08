import type { subjects, semesters } from "@/database/schema";

type Subject = typeof subjects.$inferSelect;
type Semester = typeof semesters.$inferSelect;

export type SimulationMode = "overall" | "subject" | "theory" | "lab";

export type SimulationPreset = {
  id: string;
  label: string;
  description: string;
  futurePresent: number;
  futureAbsent: number;
};

export type SimulationResult = {
  originalPercentage: number;
  simulatedPercentage: number;
  change: number;
  isImprovement: boolean;
  totalPresent: number;
  totalLectures: number;
  safeBunks: number;
  lecturesRequired: number;
  goalPercentage: number;
  status: "excellent" | "good" | "safe" | "warning" | "critical";
};

export type SimulationScenario = {
  id: string;
  label: string;
  result: SimulationResult;
};

export type SimulationInsight = {
  id: string;
  type: "warning" | "success" | "info" | "danger";
  message: string;
};

export type SimulationRecommendation = {
  id: string;
  message: string;
  urgency: "high" | "medium" | "low";
};

export type SimulationState = {
  isLoading: boolean;
  error: string | null;
  semester: Semester | null;
  subjects: SimulationSubject[];
  selectedSubjectId: string | null;
  mode: SimulationMode;
  futurePresent: number;
  futureAbsent: number;
  result: SimulationResult | null;
  scenarios: SimulationScenario[];
  insights: SimulationInsight[];
  recommendations: SimulationRecommendation[];
  hasData: boolean;
};

export type SimulationSubject = Subject & {
  currentPresent: number;
  currentTotal: number;
  currentPercentage: number;
  safeBunks: number;
};

export type SimulationAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Omit<SimulationState, "isLoading" | "error"> }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SET_MODE"; payload: SimulationMode }
  | { type: "SET_SUBJECT"; payload: string | null }
  | { type: "SET_FUTURE_PRESENT"; payload: number }
  | { type: "SET_FUTURE_ABSENT"; payload: number }
  | { type: "APPLY_PRESET"; payload: SimulationPreset }
  | { type: "RESET" };

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: "skip-today",
    label: "Skip Today",
    description: "Miss 1 lecture today",
    futurePresent: 0,
    futureAbsent: 1,
  },
  {
    id: "skip-week",
    label: "Skip This Week",
    description: "Miss 5 lectures this week",
    futurePresent: 0,
    futureAbsent: 5,
  },
  {
    id: "attend-week",
    label: "Attend All Week",
    description: "Attend 5 lectures this week",
    futurePresent: 5,
    futureAbsent: 0,
  },
  {
    id: "exam-prep",
    label: "Exam Preparation",
    description: "Attend 10 lectures",
    futurePresent: 10,
    futureAbsent: 0,
  },
  {
    id: "recover",
    label: "Recover Attendance",
    description: "Attend 15 lectures to recover",
    futurePresent: 15,
    futureAbsent: 0,
  },
];
