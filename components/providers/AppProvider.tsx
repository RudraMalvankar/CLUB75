import { type ReactNode } from "react";

import { ThemeProvider } from "@/hooks/useTheme";
import { NavigationProvider } from "@/components/providers/NavigationProvider";
import { InitializationProvider } from "@/components/providers/InitializationProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <InitializationProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </InitializationProvider>
    </ThemeProvider>
  );
}
