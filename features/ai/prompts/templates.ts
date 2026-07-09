import type { AIPromptTemplate, AIPromptCategory, AIContext } from "@/features/ai/types";

export const ATTENDANCE_EXPLANATION_PROMPT: AIPromptTemplate = {
  id: "attendance-explanation",
  name: "Attendance Explanation",
  systemPrompt: `You are an attendance coach. Explain the student's attendance in simple terms.
Focus on:
- Current standing vs goal
- Key strengths
- Areas needing improvement
- Actionable advice

NEVER calculate percentages yourself. Use the provided context data.`,
  userPromptTemplate: "Explain my attendance in detail. What's working and what needs improvement?",
  requiredContext: ["attendance", "subjects"],
};

export const ATTENDANCE_RECOVERY_PROMPT: AIPromptTemplate = {
  id: "attendance-recovery",
  name: "Attendance Recovery",
  systemPrompt: `You are an attendance recovery specialist. Help students plan their recovery.
Focus on:
- Which subjects need urgent attention
- How many lectures to attend
- Realistic timeline
- Step-by-step plan

NEVER calculate recovery numbers. Use engine data only.`,
  userPromptTemplate:
    "Help me create a plan to recover my attendance. Which subjects should I focus on?",
  requiredContext: ["attendance", "subjects", "analytics"],
};

export const SAFE_BUNK_ADVICE_PROMPT: AIPromptTemplate = {
  id: "safe-bunk-advice",
  name: "Safe Bunk Advice",
  systemPrompt: `You are an attendance advisor. Give advice on whether skipping is safe.
Focus on:
- Safe bunks remaining
- Impact of skipping
- Risk assessment
- Recommendation

NEVER calculate safe bunks. Use the engine's data.`,
  userPromptTemplate: "Can I bunk tomorrow? Is it safe?",
  requiredContext: ["attendance", "subjects"],
};

export const WEEKLY_SUMMARY_PROMPT: AIPromptTemplate = {
  id: "weekly-summary",
  name: "Weekly Summary",
  systemPrompt: `You are an attendance analyst. Provide a weekly summary.
Focus on:
- Week's attendance performance
- Subject-wise highlights
- What went well / what didn't
- Next week's focus areas

Keep it concise and actionable.`,
  userPromptTemplate: "Give me a summary of my attendance this week.",
  requiredContext: ["attendance", "subjects", "analytics"],
};

export const SEMESTER_SUMMARY_PROMPT: AIPromptTemplate = {
  id: "semester-summary",
  name: "Semester Summary",
  systemPrompt: `You are an academic advisor. Provide a semester summary.
Focus on:
- Overall semester progress
- Key achievements
- Challenges faced
- What to focus on next

Be encouraging but honest.`,
  userPromptTemplate: "Summarize my semester attendance so far.",
  requiredContext: ["semester", "attendance", "subjects"],
};

export const RISK_ANALYSIS_PROMPT: AIPromptTemplate = {
  id: "risk-analysis",
  name: "Risk Analysis",
  systemPrompt: `You are an attendance risk analyst. Identify and explain risky subjects.
Focus on:
- Which subjects are at risk
- Why they're risky
- Trend direction
- Mitigation strategies

Be specific and actionable.`,
  userPromptTemplate: "Which of my subjects are at risk?",
  requiredContext: ["subjects", "analytics"],
};

export const SUBJECT_ANALYSIS_PROMPT: AIPromptTemplate = {
  id: "subject-analysis",
  name: "Subject Analysis",
  systemPrompt: `You are a subject-specific attendance advisor. Analyze a particular subject.
Focus on:
- Current attendance status
- Trend analysis
- Risk factors
- Improvement plan

Use the subject's context data.`,
  userPromptTemplate: "Analyze my attendance for my weakest subject.",
  requiredContext: ["subjects"],
};

export const STUDY_SUGGESTIONS_PROMPT: AIPromptTemplate = {
  id: "study-suggestions",
  name: "Study Suggestions",
  systemPrompt: `You are an academic coach. Provide study and attendance suggestions.
Focus on:
- Which lectures to prioritize
- Study schedule recommendations
- Attendance-efficient strategies
- Long-term planning

Be practical and encouraging.`,
  userPromptTemplate: "Give me suggestions for studying and maintaining attendance.",
  requiredContext: ["attendance", "subjects"],
};

export const DAILY_BRIEFING_PROMPT: AIPromptTemplate = {
  id: "daily-briefing",
  name: "Daily Briefing",
  systemPrompt: `You are a daily attendance coach. Give today's briefing.
Focus on:
- Today's schedule (if available)
- Which lectures to prioritize
- Current streak motivation
- Quick tips for the day

Keep it brief and motivating.`,
  userPromptTemplate: "What should I do today to maintain my attendance?",
  requiredContext: ["attendance", "subjects"],
};

export const ALL_PROMPTS: readonly AIPromptTemplate[] = [
  ATTENDANCE_EXPLANATION_PROMPT,
  ATTENDANCE_RECOVERY_PROMPT,
  SAFE_BUNK_ADVICE_PROMPT,
  WEEKLY_SUMMARY_PROMPT,
  SEMESTER_SUMMARY_PROMPT,
  RISK_ANALYSIS_PROMPT,
  SUBJECT_ANALYSIS_PROMPT,
  STUDY_SUGGESTIONS_PROMPT,
  DAILY_BRIEFING_PROMPT,
];

export function getPromptByCategory(category: AIPromptCategory): AIPromptTemplate {
  const promptMap: Record<AIPromptCategory, AIPromptTemplate> = {
    attendance: ATTENDANCE_EXPLANATION_PROMPT,
    recovery: ATTENDANCE_RECOVERY_PROMPT,
    bunk: SAFE_BUNK_ADVICE_PROMPT,
    summary: WEEKLY_SUMMARY_PROMPT,
    risk: RISK_ANALYSIS_PROMPT,
    subject: SUBJECT_ANALYSIS_PROMPT,
    study: STUDY_SUGGESTIONS_PROMPT,
    daily: DAILY_BRIEFING_PROMPT,
    general: ATTENDANCE_EXPLANATION_PROMPT,
  };
  return promptMap[category] ?? ATTENDANCE_EXPLANATION_PROMPT;
}

export function buildSystemPrompt(template: AIPromptTemplate, context: AIContext): string {
  const contextStr = formatContextForPrompt(context);
  return `${template.systemPrompt}\n\nCONTEXT:\n${contextStr}`;
}

function formatContextForPrompt(context: AIContext): string {
  const parts: string[] = [];

  parts.push(
    `Attendance: ${context.attendance.overallPercentage}% (Goal: ${context.attendance.goalPercentage}%)`,
  );
  parts.push(`Status: ${context.attendance.status}`);
  parts.push(`Safe Bunks: ${context.attendance.safeBunks}`);
  parts.push(`Lectures Required: ${context.attendance.lecturesRequired}`);
  parts.push(`Streak: ${context.attendance.currentStreak} days`);

  if (context.semester) {
    parts.push(
      `Semester: ${context.semester.semesterName} (${context.semester.progress}% complete)`,
    );
  }

  if (context.subjects.length > 0) {
    parts.push("\nSubjects:");
    for (const s of context.subjects) {
      parts.push(
        `- ${s.subjectName}: ${s.attendancePercentage}% (${s.status}, ${s.riskLevel} risk, trend: ${s.trend})`,
      );
    }
  }

  if (context.analytics?.recommendations?.length) {
    parts.push("\nRecommendations:");
    for (const r of context.analytics.recommendations) {
      parts.push(`- ${r.message}`);
    }
  }

  return parts.join("\n");
}
