import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  baseTimestamps,
  DAY_OF_WEEK_VALUES,
  dateOnlySchema,
  textPrimaryKey,
  timeSchema,
} from "@/database/helpers";
import { semesters } from "@/database/schema/semester";

export const lectureSlots = sqliteTable(
  "lecture_slots",
  {
    id: textPrimaryKey(),
    semesterId: text("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "cascade", onUpdate: "cascade" }),
    day: text("day").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    label: text("label"),
    activeFrom: text("active_from"),
    activeUntil: text("active_until"),
    ...baseTimestamps,
  },
  (table) => [
    index("lecture_slots_semester_day_idx").on(table.semesterId, table.day),
    uniqueIndex("lecture_slots_unique_window").on(
      table.semesterId,
      table.day,
      table.startTime,
      table.endTime,
    ),
  ],
);

export const insertLectureSlotSchema = z.object({
  id: z.uuid().optional(),
  semesterId: z.uuid(),
  day: z.enum(DAY_OF_WEEK_VALUES),
  startTime: timeSchema,
  endTime: timeSchema,
  label: z.string().trim().max(80).nullable().optional(),
  activeFrom: dateOnlySchema.nullable().optional(),
  activeUntil: dateOnlySchema.nullable().optional(),
});

export const updateLectureSlotSchema = insertLectureSlotSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one lecture slot field is required");

export type InsertLectureSlot = z.infer<typeof insertLectureSlotSchema>;
export type UpdateLectureSlot = z.infer<typeof updateLectureSlotSchema>;
