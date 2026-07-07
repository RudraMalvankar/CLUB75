import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  baseTimestamps,
  GOAL_SCOPE_VALUES,
  GOAL_TYPE_VALUES,
  percentageCheck,
  textPrimaryKey,
} from "@/database/helpers";
import { semesters } from "@/database/schema/semester";
import { subjects } from "@/database/schema/subjects";

export const goals = sqliteTable(
  "goals",
  {
    id: textPrimaryKey(),
    name: text("name").notNull(),
    goalType: text("goal_type").notNull(),
    scope: text("scope").notNull(),
    semesterId: text("semester_id").references(() => semesters.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    subjectId: text("subject_id").references(() => subjects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    targetAttendance: integer("target_attendance").notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull(),
    notes: text("notes"),
    ...baseTimestamps,
  },
  (table) => [
    index("goals_scope_idx").on(table.scope),
    index("goals_semester_idx").on(table.semesterId),
    index("goals_subject_idx").on(table.subjectId),
    percentageCheck("target_attendance"),
  ],
);

export const insertGoalSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(120),
  goalType: z.enum(GOAL_TYPE_VALUES),
  scope: z.enum(GOAL_SCOPE_VALUES),
  semesterId: z.uuid().nullable().optional(),
  subjectId: z.uuid().nullable().optional(),
  targetAttendance: z.number().int().min(0).max(100),
  isActive: z.boolean().default(true),
  notes: z.string().trim().max(500).nullable().optional(),
});

export const updateGoalSchema = insertGoalSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one goal field is required");

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type UpdateGoal = z.infer<typeof updateGoalSchema>;
