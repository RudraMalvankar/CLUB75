import type { InitializationPhase, InitializationState } from "@/constants/initialization";
import { INITIALIZATION_PHASES, MAX_RETRY_COUNT } from "@/constants/initialization";

export type InitializationStep = {
  readonly phase: InitializationPhase;
  readonly execute: () => Promise<void>;
};

export function createInitialState(): InitializationState {
  return {
    phase: "fonts",
    isReady: false,
    error: null,
    retryCount: 0,
  };
}

export function getNextPhase(current: InitializationPhase): InitializationPhase {
  const currentIndex = INITIALIZATION_PHASES.indexOf(current);
  if (currentIndex < 0 || currentIndex >= INITIALIZATION_PHASES.length - 1) {
    return "complete";
  }
  return INITIALIZATION_PHASES[currentIndex + 1]!;
}

export function canRetry(retryCount: number): boolean {
  return retryCount < MAX_RETRY_COUNT;
}

export function buildInitializationSteps(
  callbacks: {
    onFontsLoaded?: () => void;
    onThemeReady?: () => void;
    onDatabaseReady?: () => void;
    onPreferencesLoaded?: () => void;
    onNavigationReady?: () => void;
  } = {},
): readonly InitializationStep[] {
  return [
    {
      phase: "fonts",
      execute: async () => {
        callbacks.onFontsLoaded?.();
      },
    },
    {
      phase: "theme",
      execute: async () => {
        callbacks.onThemeReady?.();
      },
    },
    {
      phase: "database",
      execute: async () => {
        callbacks.onDatabaseReady?.();
      },
    },
    {
      phase: "preferences",
      execute: async () => {
        callbacks.onPreferencesLoaded?.();
      },
    },
    {
      phase: "navigation",
      execute: async () => {
        callbacks.onNavigationReady?.();
      },
    },
  ];
}

export async function runInitialization(
  steps: readonly InitializationStep[],
  onPhaseChange?: (phase: InitializationPhase) => void,
): Promise<{ success: boolean; error: string | null }> {
  try {
    await Promise.resolve();

    for (const step of steps) {
      onPhaseChange?.(step.phase);
      await step.execute();
    }
    return { success: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Initialization failed";
    return { success: false, error: message };
  }
}
