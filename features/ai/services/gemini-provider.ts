import type { AIProviderConfig, AIMessage, AIContext } from "@/features/ai/types";
import type { AIProvider, AIStreamChunk } from "./ai-provider";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private apiKey: string;
  private model: string;
  private temperature: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey ?? "";
    this.model = config.model ?? "gemini-2.0-flash";
    this.temperature = config.temperature ?? 0.7;
  }

  get isAvailable(): boolean {
    return this.apiKey.length > 0;
  }

  async validate(): Promise<boolean> {
    if (!this.isAvailable) return false;
    try {
      const response = await fetch(`${GEMINI_API_BASE}/models/${this.model}?key=${this.apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async chat(
    messages: readonly AIMessage[],
    context: AIContext,
    config?: Partial<AIProviderConfig>,
  ): Promise<string> {
    if (!this.isAvailable) {
      throw new Error("Gemini API key is not configured");
    }

    const model = config?.model ?? this.model;
    const temperature = config?.temperature ?? this.temperature;

    const systemInstruction = this.buildSystemPrompt(context);
    const contents = this.buildContents(messages);

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature,
            maxOutputTokens: config?.maxTokens ?? 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }
    return text;
  }

  async chatStream(
    messages: readonly AIMessage[],
    context: AIContext,
    onChunk: (chunk: AIStreamChunk) => void,
    config?: Partial<AIProviderConfig>,
  ): Promise<string> {
    if (!this.isAvailable) {
      throw new Error("Gemini API key is not configured");
    }

    const model = config?.model ?? this.model;
    const temperature = config?.temperature ?? this.temperature;

    const systemInstruction = this.buildSystemPrompt(context);
    const contents = this.buildContents(messages);

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${model}:streamGenerateContent?alt=sse&key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature,
            maxOutputTokens: config?.maxTokens ?? 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            if (text) {
              fullText += text;
              onChunk({ text, done: false });
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    onChunk({ text: "", done: true });
    return fullText;
  }

  private buildSystemPrompt(context: AIContext): string {
    return `You are an AI attendance coach for a college student. You help them understand and manage their attendance.

RULES:
- NEVER calculate attendance percentages, safe bunks, predictions, or recovery numbers yourself
- The Attendance Engine is the single source of truth for all calculations
- ONLY explain, summarize, recommend, and answer questions based on the provided context
- Be supportive, encouraging, and helpful
- Keep responses concise and actionable
- Use the context data to give personalized advice

CURRENT ATTENDANCE CONTEXT:
- Overall: ${context.attendance.overallPercentage}% (Goal: ${context.attendance.goalPercentage}%)
- Status: ${context.attendance.status}
- Safe bunks remaining: ${context.attendance.safeBunks}
- Lectures required: ${context.attendance.lecturesRequired}
- Current streak: ${context.attendance.currentStreak} days
- Best streak: ${context.attendance.longestStreak} days

SEMESTER:
- ${context.semester.semesterName}
- Progress: ${context.semester.progress}%
- Lectures: ${context.semester.attended}/${context.semester.totalLectures}
- Days remaining: ${context.semester.daysRemaining}

SUBJECTS:
${context.subjects.map((s) => `- ${s.subjectName}: ${s.attendancePercentage}% (${s.status}, ${s.riskLevel} risk, trend: ${s.trend})`).join("\n")}

${context.analytics ? `RECOMMENDATIONS:\n${context.analytics.recommendations.map((r) => `- ${r.message}`).join("\n")}` : ""}

Respond in a helpful, concise manner. Do not repeat the data back unless asked. Focus on actionable advice.`;
  }

  private buildContents(
    messages: readonly AIMessage[],
  ): { role: string; parts: { text: string }[] }[] {
    return messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
  }
}
