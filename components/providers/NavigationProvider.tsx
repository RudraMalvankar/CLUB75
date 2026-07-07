import { createContext, useContext, type ReactNode } from "react";

import { useNavigationReady } from "@/hooks/useNavigationReady";

type NavigationContextValue = {
  isReady: boolean;
  markReady: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { isReady, markReady } = useNavigationReady();

  return (
    <NavigationContext.Provider value={{ isReady, markReady }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigationContext must be used within a NavigationProvider");
  }

  return context;
}
