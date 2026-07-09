import { useCallback, useEffect, useMemo, useReducer } from "react";

import { getDatabase } from "@/database/database";
import { ConversationService } from "@/features/ai/services/conversation-service";
import type { AIConversation } from "@/features/ai/types";

type ConversationsState = {
  conversations: AIConversation[];
  isLoading: boolean;
  error: string | null;
};

type ConversationsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: AIConversation[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "DELETE"; payload: string }
  | { type: "TOGGLE_PIN"; payload: string }
  | { type: "CLEAR" };

const initialState: ConversationsState = {
  conversations: [],
  isLoading: true,
  error: null,
};

function reducer(state: ConversationsState, action: ConversationsAction): ConversationsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { conversations: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "DELETE":
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.payload),
      };
    case "TOGGLE_PIN":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload ? { ...c, isPinned: !c.isPinned } : c,
        ),
      };
    case "CLEAR":
      return { ...state, conversations: [] };
    default:
      return state;
  }
}

export function useConversations() {
  const db = getDatabase();
  const service = useMemo(() => new ConversationService(db), [db]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadConversations = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const data = await service.getAllConversations();
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload: err instanceof Error ? err.message : "Failed to load conversations",
      });
    }
  }, [service]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await service.deleteConversation(id);
        dispatch({ type: "DELETE", payload: id });
      } catch (err) {
        dispatch({
          type: "LOAD_ERROR",
          payload: err instanceof Error ? err.message : "Failed to delete conversation",
        });
      }
    },
    [service],
  );

  const togglePin = useCallback(
    async (id: string) => {
      try {
        await service.togglePin(id);
        dispatch({ type: "TOGGLE_PIN", payload: id });
      } catch (err) {
        dispatch({
          type: "LOAD_ERROR",
          payload: err instanceof Error ? err.message : "Failed to toggle pin",
        });
      }
    },
    [service],
  );

  const clearAll = useCallback(async () => {
    try {
      await service.clearAllConversations();
      dispatch({ type: "CLEAR" });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload: err instanceof Error ? err.message : "Failed to clear conversations",
      });
    }
  }, [service]);

  return {
    conversations: state.conversations,
    isLoading: state.isLoading,
    error: state.error,
    deleteConversation,
    togglePin,
    clearAll,
    refresh: loadConversations,
  };
}
