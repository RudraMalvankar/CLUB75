export * from "./types";

export { AIProviderProvider, useAIProvider } from "./providers/AIProviderContext";
export { useChat } from "./hooks/useChat";
export { useConversations } from "./hooks/useConversations";
export { useAISettings } from "./hooks/useAISettings";

export {
  buildAttendanceContext,
  buildSubjectContext,
  buildSemesterContext,
  buildAnalyticsContext,
  buildFullContext,
  getEmptyContext,
} from "./services/context-builder";

export {
  ATTENDANCE_EXPLANATION_PROMPT,
  ATTENDANCE_RECOVERY_PROMPT,
  SAFE_BUNK_ADVICE_PROMPT,
  WEEKLY_SUMMARY_PROMPT,
  SEMESTER_SUMMARY_PROMPT,
  RISK_ANALYSIS_PROMPT,
  SUBJECT_ANALYSIS_PROMPT,
  STUDY_SUGGESTIONS_PROMPT,
  DAILY_BRIEFING_PROMPT,
  ALL_PROMPTS,
  getPromptByCategory,
  buildSystemPrompt,
} from "./prompts/templates";

export type { AIProvider } from "./services/ai-provider";
export { createAIProvider, getAIProvider, clearProviderCache } from "./services/provider-factory";
export { GeminiProvider } from "./services/gemini-provider";
export { MockProvider } from "./services/mock-provider";
export { AISettingsService } from "./services/ai-settings-service";
export { ConversationService } from "./services/conversation-service";

export { ChatScreen } from "./components/ChatScreen";
export { MessageBubble } from "./components/MessageBubble";
export { TypingIndicator } from "./components/TypingIndicator";
export { SuggestedQuestions } from "./components/SuggestedQuestions";
export { ResponseCard } from "./components/ResponseCards";
export { ChatInput } from "./components/ChatInput";
export { ConversationList } from "./components/ConversationList";

export { AIAssistantScreen } from "./screens/AIAssistantScreen";
export { AISettingsScreen } from "./screens/AISettingsScreen";
