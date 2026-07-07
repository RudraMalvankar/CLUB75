import { useCallback, useEffect, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

export type AppStateValue = "active" | "background" | "inactive";

export function useAppState() {
  const [appState, setAppState] = useState<AppStateValue>(
    () => AppState.currentState as AppStateValue,
  );
  const [previousState, setPreviousState] = useState<AppStateValue>(appState);

  const handleChange = useCallback(
    (nextState: AppStateStatus) => {
      const mapped =
        nextState === "active" ? "active" : nextState === "background" ? "background" : "inactive";
      setPreviousState(appState);
      setAppState(mapped);
    },
    [appState],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleChange);
    return () => subscription.remove();
  }, [handleChange]);

  return {
    appState,
    previousState,
    isActive: appState === "active",
    isBackground: appState === "background",
  };
}
