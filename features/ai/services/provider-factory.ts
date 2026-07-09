import type { AIProviderName, AIProviderConfig } from "@/features/ai/types";
import type { AIProvider } from "./ai-provider";
import { GeminiProvider } from "./gemini-provider";
import { MockProvider } from "./mock-provider";

const providers = new Map<string, AIProvider>();

export function createAIProvider(name: AIProviderName, config: AIProviderConfig): AIProvider {
  const cacheKey = `${name}-${config.apiKey ?? "no-key"}`;
  const cached = providers.get(cacheKey);
  if (cached) return cached;

  let provider: AIProvider;

  switch (name) {
    case "gemini":
      provider = new GeminiProvider(config);
      break;
    case "openai":
      provider = new MockProvider(config);
      break;
    case "anthropic":
      provider = new MockProvider(config);
      break;
    case "local":
      provider = new MockProvider(config);
      break;
    case "mock":
      provider = new MockProvider(config);
      break;
    default:
      provider = new MockProvider(config);
  }

  providers.set(cacheKey, provider);
  return provider;
}

export function getAIProvider(name: AIProviderName, config: AIProviderConfig): AIProvider {
  return createAIProvider(name, config);
}

export function clearProviderCache(): void {
  providers.clear();
}
