import type { AIProviderConfig, AIMessage, AIContext } from "@/features/ai/types";
import type { AIProvider, AIStreamChunk } from "./ai-provider";

export class MockProvider implements AIProvider {
  readonly name = "mock";
  private delay: number;

  constructor(config?: AIProviderConfig) {
    this.delay = 500;
    void config;
  }

  get isAvailable(): boolean {
    return true;
  }

  async validate(): Promise<boolean> {
    return true;
  }

  async chat(
    messages: readonly AIMessage[],
    context: AIContext,
    config?: Partial<AIProviderConfig>,
  ): Promise<string> {
    void config;
    await this.simulateDelay();

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

    if (!lastUserMessage) {
      return "I don't have a question to respond to. How can I help you with your attendance?";
    }

    return this.generateResponse(lastUserMessage.content, context);
  }

  async chatStream(
    messages: readonly AIMessage[],
    context: AIContext,
    onChunk: (chunk: AIStreamChunk) => void,
    config?: Partial<AIProviderConfig>,
  ): Promise<string> {
    const fullResponse = await this.chat(messages, context, config);
    const words = fullResponse.split(" ");

    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? " " : "");
      onChunk({ text: word, done: false });
      await this.simulateDelay(30);
    }

    onChunk({ text: "", done: true });
    return fullResponse;
  }

  private generateResponse(question: string, context: AIContext): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("bunk") || lowerQuestion.includes("skip")) {
      return this.getBunkResponse(context);
    }
    if (lowerQuestion.includes("explain") || lowerQuestion.includes("attendance")) {
      return this.getExplanationResponse(context);
    }
    if (
      lowerQuestion.includes("risky") ||
      lowerQuestion.includes("dangerous") ||
      lowerQuestion.includes("risk")
    ) {
      return this.getRiskResponse(context);
    }
    if (
      lowerQuestion.includes("reach") ||
      lowerQuestion.includes("goal") ||
      lowerQuestion.includes("85%") ||
      lowerQuestion.includes("80%") ||
      lowerQuestion.includes("target")
    ) {
      return this.getGoalResponse(context);
    }
    if (lowerQuestion.includes("weekly") || lowerQuestion.includes("week")) {
      return this.getWeeklyResponse(context);
    }
    if (lowerQuestion.includes("today") || lowerQuestion.includes("daily")) {
      return this.getDailyResponse(context);
    }
    if (lowerQuestion.includes("semester") || lowerQuestion.includes("summary")) {
      return this.getSemesterResponse(context);
    }

    if (lowerQuestion.includes("recovery") || lowerQuestion.includes("recover")) {
      return this.getRecoveryResponse(context);
    }
    if (lowerQuestion.includes("study") || lowerQuestion.includes("plan")) {
      return this.getStudyResponse(context);
    }
    if (lowerQuestion.includes("never miss") || lowerQuestion.includes("important")) {
      return this.getImportantSubjectResponse(context);
    }

    return this.getGeneralResponse(context);
  }

  private getBunkResponse(context: AIContext): string {
    const { attendance } = context;
    if (attendance.safeBunks > 2) {
      return `You have ${attendance.safeBunks} safe bunks remaining. You can afford to skip, but I'd recommend staying consistent. Your current status is ${attendance.status}.`;
    }
    if (attendance.safeBunks > 0) {
      return `Be careful! You only have ${attendance.safeBunks} safe bunks left. I'd advise against skipping. Focus on maintaining your ${attendance.overallPercentage}% attendance.`;
    }
    return `You have no safe bunks remaining! Every lecture counts now. Your attendance is at ${attendance.overallPercentage}% and you need to attend ${attendance.lecturesRequired} more lectures to reach your goal.`;
  }

  private getExplanationResponse(context: AIContext): string {
    const { attendance, subjects } = context;
    const risky = subjects.filter((s) => s.riskLevel === "high" || s.riskLevel === "critical");
    const good = subjects.filter((s) => s.status === "excellent" || s.status === "good");

    let response = `Your overall attendance is ${attendance.overallPercentage}% against a goal of ${attendance.goalPercentage}%. `;
    response += `Status: ${attendance.status}. `;

    if (risky.length > 0) {
      response += `⚠️ Risky subjects: ${risky.map((s) => s.subjectName).join(", ")}. `;
    }
    if (good.length > 0) {
      response += `✅ Strong subjects: ${good.map((s) => s.subjectName).join(", ")}. `;
    }

    response += `You've maintained a streak of ${attendance.currentStreak} days.`;
    return response;
  }

  private getRiskResponse(context: AIContext): string {
    const { subjects } = context;
    const risky = subjects
      .filter((s) => s.riskLevel !== "none")
      .sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      });

    if (risky.length === 0) {
      return "Great news! None of your subjects are at risk. Keep up the consistent attendance!";
    }

    let response = "Here are your risky subjects:\n";
    for (const s of risky.slice(0, 5)) {
      response += `• ${s.subjectName}: ${s.attendancePercentage}% (${s.riskLevel} risk, trend: ${s.trend})\n`;
    }
    response += "\nI'd recommend prioritizing these subjects in your schedule.";
    return response;
  }

  private getGoalResponse(context: AIContext): string {
    const { attendance } = context;
    const gap = attendance.goalPercentage - attendance.overallPercentage;

    if (gap <= 0) {
      return `Excellent! You've already reached your ${attendance.goalPercentage}% goal at ${attendance.overallPercentage}%. Keep maintaining this level!`;
    }

    return `You're currently at ${attendance.overallPercentage}% and need to reach ${attendance.goalPercentage}%. That's a ${gap.toFixed(1)}% gap. You need to attend ${attendance.lecturesRequired} more lectures. Focus on consistency and don't miss any more classes.`;
  }

  private getWeeklyResponse(context: AIContext): string {
    const { subjects, attendance } = context;
    const priority = subjects
      .filter((s) => s.riskLevel === "high" || s.riskLevel === "critical")
      .map((s) => s.subjectName);

    let response = `Weekly Summary:\n`;
    response += `• Overall: ${attendance.overallPercentage}% (${attendance.status})\n`;
    response += `• Safe bunks: ${attendance.safeBunks}\n`;

    if (priority.length > 0) {
      response += `\n⚠️ Priority subjects this week: ${priority.join(", ")}`;
    } else {
      response += `\n✅ No critical subjects — maintain your routine!`;
    }

    return response;
  }

  private getDailyResponse(context: AIContext): string {
    const { attendance, subjects } = context;
    const risky = subjects.find((s) => s.riskLevel === "high" || s.riskLevel === "critical");

    let response = `Today's Advice:\n`;
    if (risky) {
      response += `❗ Don't skip ${risky.subjectName} — it's at ${risky.attendancePercentage}% (${risky.riskLevel} risk).\n`;
    }
    response += `• Current streak: ${attendance.currentStreak} days\n`;
    response += `• Keep building your attendance habit!`;
    return response;
  }

  private getSemesterResponse(context: AIContext): string {
    const { semester, attendance } = context;
    return `Semester Summary:\n• ${semester.semesterName}\n• Progress: ${semester.progress}%\n• Attended: ${semester.attended}/${semester.totalLectures} lectures\n• Overall: ${attendance.overallPercentage}%\n• Days remaining: ${semester.daysRemaining}\n• Goal: ${attendance.goalPercentage}%`;
  }

  private getStudyResponse(context: AIContext): string {
    const { subjects } = context;
    const risky = subjects
      .filter((s) => s.riskLevel !== "none")
      .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

    let response = "Study Plan Recommendation:\n";
    if (risky.length > 0) {
      response += `Focus first on: ${risky.map((s) => s.subjectName).join(", ")}\n`;
      response += `These subjects need more attendance attention.\n`;
    }
    response += "• Attend all lectures for subjects below 80%\n";
    response += "• Use safe bunks only for emergencies\n";
    response += "• Build a consistent daily routine";
    return response;
  }

  private getRecoveryResponse(context: AIContext): string {
    const { attendance, subjects } = context;
    const critical = subjects.filter((s) => s.riskLevel === "critical" || s.riskLevel === "high");

    let response = "Recovery Plan:\n";
    if (critical.length > 0) {
      response += `Urgent: ${critical.map((s) => `${s.subjectName} (${s.attendancePercentage}%)`).join(", ")} need immediate attention.\n`;
    }
    response += `• You need ${attendance.lecturesRequired} more lectures to reach your goal\n`;
    response += `• Attend every possible class from now on\n`;
    response += `• No more skips until you're above your target`;
    return response;
  }

  private getImportantSubjectResponse(context: AIContext): string {
    const { subjects } = context;
    const sorted = [...subjects].sort((a, b) => a.attendancePercentage - b.attendancePercentage);

    if (sorted.length === 0) {
      return "I don't have enough data about your subjects yet.";
    }

    const mostCritical = sorted[0];
    return `The lecture you should never miss is ${mostCritical.subjectName} at ${mostCritical.attendancePercentage}%. It has ${mostCritical.riskLevel} risk and a ${mostCritical.trend} trend. Prioritize this above all others.`;
  }

  private getGeneralResponse(context: AIContext): string {
    const { attendance } = context;
    return `Your attendance is at ${attendance.overallPercentage}% (${attendance.status}). You have ${attendance.safeBunks} safe bunks and need ${attendance.lecturesRequired} more lectures. How can I help you further?`;
  }

  private async simulateDelay(ms?: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms ?? this.delay));
  }
}
