import { useCallback, useMemo, useReducer } from "react";

import { getDatabase } from "@/database/database";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { useAISettings } from "@/features/ai/hooks/useAISettings";
import { useAIProvider } from "@/features/ai/providers/AIProviderContext";
import { buildFullContext, getEmptyContext } from "@/features/ai/services/context-builder";
import { ConversationService } from "@/features/ai/services/conversation-service";
import { getPromptByCategory } from "@/features/ai/prompts/templates";
import type { AIConversation, AIMessage, AIPromptCategory, AIContext } from "@/features/ai/types";

type ChatState = {
  conversation: AIConversation | null;
  context: AIContext;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
};

type ChatAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: { conversation: AIConversation | null; context: AIContext } }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SEND_START" }
  | { type: "SEND_SUCCESS"; payload: AIMessage }
  | { type: "SEND_ERROR"; payload: string }
  | { type: "STREAM_CHUNK"; payload: string }
  | { type: "STREAM_END" }
  | { type: "CLEAR_ERROR" };

const initialState: ChatState = {
  conversation: null,
  context: getEmptyContext(),
  isLoading: false,
  isStreaming: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        conversation: action.payload.conversation,
        context: action.payload.context,
      };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SEND_START":
      return { ...state, isStreaming: true, error: null };
    case "SEND_SUCCESS":
      if (!state.conversation) return state;
      return {
        ...state,
        isStreaming: false,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, action.payload],
          updatedAt: Date.now(),
          messageCount: state.conversation.messageCount + 1,
        },
      };
    case "SEND_ERROR":
      return { ...state, isStreaming: false, error: action.payload };
    case "STREAM_CHUNK":
      return state;
    case "STREAM_END":
      return { ...state, isStreaming: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function useChat(conversationId?: string) {
  const db = getDatabase();
  const { settings } = useAISettings();
  const { provider } = useAIProvider();
  const { dashboard, isLoading: analyticsLoading } = useAnalytics();

  const [state, dispatch] = useReducer(chatReducer, initialState);

  const conversationService = useMemo(() => new ConversationService(db), [db]);

  const context: AIContext = useMemo(() => {
    if (analyticsLoading || !dashboard) {
      return getEmptyContext();
    }
    return buildFullContext({
      summary: dashboard.summary,
      subjects: dashboard.subjects,
      semesterName: "Current Semester",
      totalLectures: dashboard.summary.totalLectures,
      attended: dashboard.summary.attended,
      missed: dashboard.summary.missed,
      progress: dashboard.summary.semesterProgress,
      daysRemaining: 30,
      risks: dashboard.risks,
      recommendations: dashboard.recommendations,
      consistency: dashboard.consistency,
      distribution: dashboard.distribution,
    });
  }, [dashboard, analyticsLoading]);

  const loadConversation = useCallback(
    async (id: string) => {
      dispatch({ type: "LOAD_START" });
      try {
        const conversation = await conversationService.getConversation(id);
        dispatch({
          type: "LOAD_SUCCESS",
          payload: { conversation: conversation!, context },
        });
      } catch (error) {
        dispatch({
          type: "LOAD_ERROR",
          payload: error instanceof Error ? error.message : "Failed to load conversation",
        });
      }
    },
    [conversationService, context],
  );

  const sendMessage = useCallback(
    async (content: string, category?: AIPromptCategory) => {
      if (!content.trim()) return;

      dispatch({ type: "SEND_START" });

      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      let currentConversation = state.conversation;
      if (!currentConversation) {
        currentConversation = conversationService.createNewConversation(content);
      }

      const updatedConversation: AIConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: Date.now(),
        messageCount: currentConversation.messageCount + 1,
      };

      await conversationService.saveConversation(updatedConversation);

      dispatch({ type: "SEND_SUCCESS", payload: userMessage });

      if (!provider || !settings.enabled) {
        const offlineMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "AI is currently unavailable. Please check your settings and internet connection.",
          timestamp: Date.now(),
        };
        dispatch({ type: "SEND_SUCCESS", payload: offlineMessage });
        return;
      }

      try {
        const promptTemplate = category
          ? getPromptByCategory(category)
          : getPromptByCategory("general");

        const messages: AIMessage[] = [
          {
            id: "system",
            role: "system",
            content: promptTemplate.systemPrompt,
            timestamp: Date.now(),
          },
          ...updatedConversation.messages.filter((m) => m.role !== "system"),
        ];

        const response = await provider.chat(messages, context, {
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: 2048,
        });

        const assistantMessage: AIMessage = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: response,
          timestamp: Date.now(),
        };

        dispatch({ type: "SEND_SUCCESS", payload: assistantMessage });
        await conversationService.addMessage(updatedConversation.id, assistantMessage);
      } catch (error) {
        dispatch({
          type: "SEND_ERROR",
          payload: error instanceof Error ? error.message : "Failed to get AI response",
        });
      }
    },
    [state.conversation, provider, settings, context, conversationService],
  );

  const clearChat = useCallback(() => {
    dispatch({ type: "LOAD_SUCCESS", payload: { conversation: null, context } });
  }, [context]);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return {
    conversation: state.conversation,
    context,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    error: state.error,
    sendMessage,
    loadConversation,
    clearChat,
    clearError,
  };
}
