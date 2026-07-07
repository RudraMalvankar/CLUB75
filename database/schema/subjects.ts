import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  baseTimestamps,
  hexColorSchema,
  percentageCheck,
  textPrimaryKey,
} from "@/database/helpers";
import { semesters } from "@/database/schema/semester";

export const subjects = sqliteTable(
  "subjects",
  {
    id: textPrimaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    faculty: text("faculty").notNull(),
    color: text("color").notNull(),
    credit: integer("credit").notNull(),
    minimumAttendance: integer("minimum_attendance").notNull(),
    isLab: integer("is_lab", { mode: "boolean" }).notNull(),
    semesterId: text("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...baseTimestamps,
  },
  (table) => [
    index("subjects_semester_idx").on(table.semesterId),
    uniqueIndex("subjects_semester_code_unique").on(table.semesterId, table.code),
    percentageCheck("minimum_attendance"),
  ],
);

export const insertSubjectSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(120),
  code: z.string().trim().min(1).max(32),
  faculty: z.string().trim().min(1).max(120),
  color: hexColorSchema,
  credit: z.number().int().min(0).max(20),
  minimumAttendance: z.number().int().min(0).max(100).default(75),
  isLab: z.boolean(),
  semesterId: z.uuid(),
});

export const updateSubjectSchema = insertSubjectSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one subject field is required");

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type UpdateSubject = z.infer<typeof updateSubjectSchema>;
