import type {
  AttendanceSummary,
  SubjectAnalytics,
  Recommendation,
  RiskAnalysis,
  ConsistencyScore,
  DistributionData,
} from "@/features/analytics/types";

export type AIProviderName = "gemini" | "openai" | "anthropic" | "local" | "mock";

export type AIProviderConfig = {
  readonly name: AIProviderName;
  readonly apiKey?: string;
  readonly model?: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly streaming?: boolean;
};

export type AIMessageRole = "user" | "assistant" | "system";

export type AIMessage = {
  readonly id: string;
  readonly role: AIMessageRole;
  readonly content: string;
  readonly timestamp: number;
  readonly isStreaming?: boolean;
};

export type AIConversation = {
  readonly id: string;
  readonly title: string;
  readonly messages: readonly AIMessage[];
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly isPinned: boolean;
  readonly messageCount: number;
};

export type AIAttendanceContext = {
  readonly overallPercentage: number;
  readonly goalPercentage: number;
  readonly safeBunks: number;
  readonly lecturesRequired: number;
  readonly status: AttendanceSummary["status"];
  readonly currentStreak: number;
  readonly longestStreak: number;
};

export type AISubjectContext = {
  readonly subjectId: string;
  readonly subjectName: string;
  readonly attendancePercentage: number;
  readonly riskLevel: RiskAnalysis["riskLevel"];
  readonly safeBunks: number;
  readonly trend: SubjectAnalytics["trend"];
  readonly status: SubjectAnalytics["status"];
  readonly credits: number;
};

export type AISemesterContext = {
  readonly semesterName: string;
  readonly totalLectures: number;
  readonly attended: number;
  readonly missed: number;
  readonly progress: number;
  readonly daysRemaining: number;
};

export type AISimulatorContext = {
  readonly currentPercentage: number;
  readonly simulatedPercentage: number;
  readonly change: number;
  readonly isImprovement: boolean;
  readonly safeBunks: number;
  readonly lecturesRequired: number;
};

export type AIAnalyticsContext = {
  readonly summary: AttendanceSummary;
  readonly subjects: readonly SubjectAnalytics[];
  readonly risks: readonly RiskAnalysis[];
  readonly recommendations: readonly Recommendation[];
  readonly consistency: ConsistencyScore;
  readonly distribution: DistributionData;
};

export type AICalendarContext = {
  readonly todaySchedule: readonly CalendarEvent[];
  readonly upcomingDeadlines: readonly CalendarEvent[];
  readonly weeklyLectures: number;
};

export type CalendarEvent = {
  readonly subjectName: string;
  readonly time: string;
  readonly type: "lecture" | "lab" | "tutorial" | "exam";
  readonly day: string;
};

export type AIContext = {
  readonly attendance: AIAttendanceContext;
  readonly subjects: readonly AISubjectContext[];
  readonly semester: AISemesterContext;
  readonly simulator?: AISimulatorContext;
  readonly analytics: AIAnalyticsContext;
  readonly calendar?: AICalendarContext;
  readonly timestamp: number;
};

export type AIPromptTemplate = {
  readonly id: string;
  readonly name: string;
  readonly systemPrompt: string;
  readonly userPromptTemplate: string;
  readonly requiredContext: readonly (keyof AIContext)[];
};

export type AIPromptCategory =
  | "attendance"
  | "recovery"
  | "bunk"
  | "summary"
  | "risk"
  | "subject"
  | "study"
  | "daily"
  | "general";

export type AISettings = {
  readonly enabled: boolean;
  readonly provider: AIProviderName;
  readonly apiKey: string;
  readonly model: string;
  readonly temperature: number;
  readonly streaming: boolean;
  readonly historyEnabled: boolean;
  readonly maxHistoryMessages: number;
};

export type AIResponseCard =
  | { type: "summary"; data: AIAttendanceContext }
  | { type: "recommendation"; data: Recommendation }
  | { type: "risk"; data: RiskAnalysis }
  | { type: "recovery"; data: RecoveryPlan }
  | { type: "subjectAnalysis"; data: AISubjectContext }
  | { type: "weeklyPlan"; data: WeeklyPlan }
  | { type: "attendanceExplanation"; data: AttendanceExplanation };

export type RecoveryPlan = {
  readonly subjectName: string;
  readonly currentPercentage: number;
  readonly targetPercentage: number;
  readonly lecturesNeeded: number;
  readonly strategy: string;
};

export type WeeklyPlan = {
  readonly day: string;
  readonly subjects: readonly { name: string; priority: "high" | "medium" | "low" }[];
};

export type AttendanceExplanation = {
  readonly subjectName: string;
  readonly percentage: number;
  readonly explanation: string;
  readonly trend: string;
  readonly risk: string;
};

export type AISuggestedQuestion = {
  readonly id: string;
  readonly question: string;
  readonly category: AIPromptCategory;
  readonly icon?: string;
};

export const DEFAULT_SUGGESTED_QUESTIONS: readonly AISuggestedQuestion[] = [
  { id: "bunk-tomorrow", question: "Can I bunk tomorrow?", category: "bunk", icon: "📅" },
  {
    id: "explain-attendance",
    question: "Explain my attendance",
    category: "attendance",
    icon: "📊",
  },
  { id: "risky-subjects", question: "Which subjects are risky?", category: "risk", icon: "⚠️" },
  { id: "reach-goal", question: "How can I reach 85%?", category: "recovery", icon: "🎯" },
  { id: "weekly-summary", question: "Give me a weekly summary", category: "summary", icon: "📋" },
  { id: "today-plan", question: "What should I do today?", category: "daily", icon: "📆" },
  { id: "semester-summary", question: "Summarize my semester", category: "summary", icon: "🎓" },
  { id: "study-plan", question: "Give me a study plan", category: "study", icon: "📚" },
  { id: "recovery-plan", question: "Create a recovery plan", category: "recovery", icon: "🔄" },
  {
    id: "never-miss",
    question: "Which lecture should I never miss?",
    category: "subject",
    icon: "❗",
  },
] as const;

export const AI_PROVIDER_LABELS: Record<AIProviderName, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI",
  anthropic: "Anthropic",
  local: "Local LLM",
  mock: "Mock (Testing)",
};

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  provider: "mock",
  apiKey: "",
  model: "gemini-2.0-flash",
  temperature: 0.7,
  streaming: true,
  historyEnabled: true,
  maxHistoryMessages: 100,
};
