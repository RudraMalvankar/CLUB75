import React, { createContext, useContext, useMemo } from "react";

import type { AIProvider } from "@/features/ai/services/ai-provider";
import { getAIProvider } from "@/features/ai/services/provider-factory";
import type { AISettings, AIProviderName } from "@/features/ai/types";

type AIProviderContextValue = {
  readonly provider: AIProvider | null;
  readonly isLoading: boolean;
  readonly isAvailable: boolean;
  readonly refresh: () => void;
};

const AIProviderContext = createContext<AIProviderContextValue>({
  provider: null,
  isLoading: false,
  isAvailable: false,
  refresh: () => {},
});

type AIProviderContextProps = {
  readonly settings: AISettings;
  readonly children: React.ReactNode;
};

export function AIProviderProvider({ settings, children }: AIProviderContextProps) {
  const provider = useMemo(() => {
    if (!settings.enabled) return null;
    try {
      return getAIProvider(settings.provider as AIProviderName, {
        name: settings.provider as AIProviderName,
        apiKey: settings.apiKey,
        model: settings.model,
        temperature: settings.temperature,
        streaming: settings.streaming,
      });
    } catch {
      return null;
    }
  }, [
    settings.enabled,
    settings.provider,
    settings.apiKey,
    settings.model,
    settings.temperature,
    settings.streaming,
  ]);

  const value: AIProviderContextValue = useMemo(
    () => ({
      provider,
      isLoading: false,
      isAvailable: provider?.isAvailable ?? false,
      refresh: () => {},
    }),
    [provider],
  );

  return <AIProviderContext.Provider value={value}>{children}</AIProviderContext.Provider>;
}

export function useAIProvider(): AIProviderContextValue {
  return useContext(AIProviderContext);
}
