import type { AIProviderConfig, AIMessage, AIContext } from "@/features/ai/types";

export type AIStreamChunk = {
  readonly text: string;
  readonly done: boolean;
};

export interface AIProvider {
  readonly name: string;
  readonly isAvailable: boolean;

  chat(
    messages: readonly AIMessage[],
    context: AIContext,
    config?: Partial<AIProviderConfig>,
  ): Promise<string>;

  chatStream(
    messages: readonly AIMessage[],
    context: AIContext,
    onChunk: (chunk: AIStreamChunk) => void,
    config?: Partial<AIProviderConfig>,
  ): Promise<string>;

  validate(): Promise<boolean>;
}
