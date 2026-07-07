import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import type { InitializationPhase, InitializationState } from "@/constants/initialization";
import {
  createInitialState,
  canRetry,
  buildInitializationSteps,
  runInitialization,
} from "@/services/initialization.service";

export function useInitialization() {
  const [state, setState] = useState<InitializationState>(createInitialState);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

  const updatePhase = useCallback((phase: InitializationPhase) => {
    startTransition(() => {
      setState((prev) => ({ ...prev, phase, error: null }));
    });
  }, []);

  const initialize = useCallback(async () => {
    if (!mountedRef.current || initializedRef.current) return;
    initializedRef.current = true;

    const steps = buildInitializationSteps({
      onFontsLoaded: () => updatePhase("theme"),
      onThemeReady: () => updatePhase("database"),
      onDatabaseReady: () => updatePhase("preferences"),
      onPreferencesLoaded: () => updatePhase("navigation"),
      onNavigationReady: () => updatePhase("complete"),
    });

    const { success, error } = await runInitialization(steps, updatePhase);

    if (!mountedRef.current) return;

    startTransition(() => {
      if (success) {
        setState((prev) => ({
          ...prev,
          phase: "complete",
          isReady: true,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: error ?? "Unknown initialization error",
        }));
      }
    });
  }, [updatePhase]);

  const retry = useCallback(() => {
    if (!mountedRef.current) return;

    initializedRef.current = false;

    startTransition(() => {
      setState((prev) => {
        if (!canRetry(prev.retryCount)) return prev;
        return {
          ...createInitialState(),
          retryCount: prev.retryCount + 1,
        };
      });
    });

    void initialize();
  }, [initialize]);

  useEffect(() => {
    mountedRef.current = true;
    void initialize();

    return () => {
      mountedRef.current = false;
    };
  }, [initialize]);

  return {
    ...state,
    retry,
    isInitializing: !state.isReady && state.error === null,
  };
}
