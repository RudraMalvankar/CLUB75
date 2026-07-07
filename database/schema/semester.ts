import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  baseTimestamps,
  dateOnlySchema,
  nonNegativeCheck,
  textPrimaryKey,
} from "@/database/helpers";

export const semesters = sqliteTable(
  "semesters",
  {
    id: textPrimaryKey(),
    name: text("name").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date").notNull(),
    minimumAttendance: integer("minimum_attendance").notNull(),
    currentWeek: integer("current_week").notNull(),
    workingDays: integer("working_days").notNull(),
    ...baseTimestamps,
  },
  (table) => [
    index("semesters_name_idx").on(table.name),
    nonNegativeCheck("current_week"),
    nonNegativeCheck("working_days"),
  ],
);

export const insertSemesterSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(120),
  startDate: dateOnlySchema,
  endDate: dateOnlySchema,
  minimumAttendance: z.number().int().min(0).max(100),
  currentWeek: z.number().int().min(0),
  workingDays: z.number().int().min(0),
});

export const updateSemesterSchema = insertSemesterSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one semester field is required");

export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type UpdateSemester = z.infer<typeof updateSemesterSchema>;
