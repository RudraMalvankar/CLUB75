export type InitializationPhase =
  "fonts" | "theme" | "database" | "preferences" | "navigation" | "complete";

export interface InitializationState {
  readonly phase: InitializationPhase;
  readonly isReady: boolean;
  readonly error: string | null;
  readonly retryCount: number;
}

export const INITIALIZATION_PHASES: readonly InitializationPhase[] = [
  "fonts",
  "theme",
  "database",
  "preferences",
  "navigation",
  "complete",
] as const;

export const MAX_RETRY_COUNT = 3;
export const INITIALIZATION_TIMEOUT_MS = 10_000;
