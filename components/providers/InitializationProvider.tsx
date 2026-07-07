import { createContext, useContext, type ReactNode } from "react";

import { useInitialization } from "@/hooks/useInitialization";
import type { InitializationPhase } from "@/constants/initialization";

type InitializationContextValue = {
  phase: InitializationPhase;
  isReady: boolean;
  isInitializing: boolean;
  error: string | null;
  retryCount: number;
  retry: () => void;
};

const InitializationContext = createContext<InitializationContextValue | null>(null);

export function InitializationProvider({ children }: { children: ReactNode }) {
  const init = useInitialization();

  return (
    <InitializationContext.Provider
      value={{
        phase: init.phase,
        isReady: init.isReady,
        isInitializing: init.isInitializing,
        error: init.error,
        retryCount: init.retryCount,
        retry: init.retry,
      }}
    >
      {children}
    </InitializationContext.Provider>
  );
}

export function useInitializationContext() {
  const context = useContext(InitializationContext);

  if (!context) {
    throw new Error("useInitializationContext must be used within an InitializationProvider");
  }

  return context;
}
