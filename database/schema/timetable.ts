import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { baseTimestamps, LECTURE_TYPE_VALUES, textPrimaryKey } from "@/database/helpers";
import { lectureSlots } from "@/database/schema/lectureSlots";
import { subjects } from "@/database/schema/subjects";

export const timetableEntries = sqliteTable(
  "timetable_entries",
  {
    id: textPrimaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lectureSlotId: text("lecture_slot_id")
      .notNull()
      .references(() => lectureSlots.id, { onDelete: "cascade", onUpdate: "cascade" }),
    room: text("room"),
    faculty: text("faculty"),
    lectureType: text("lecture_type").notNull(),
    notes: text("notes"),
    ...baseTimestamps,
  },
  (table) => [
    index("timetable_entries_subject_idx").on(table.subjectId),
    index("timetable_entries_slot_idx").on(table.lectureSlotId),
    uniqueIndex("timetable_entries_subject_slot_unique").on(table.subjectId, table.lectureSlotId),
  ],
);

export const insertTimetableEntrySchema = z.object({
  id: z.uuid().optional(),
  subjectId: z.uuid(),
  lectureSlotId: z.uuid(),
  room: z.string().trim().max(64).nullable().optional(),
  faculty: z.string().trim().max(120).nullable().optional(),
  lectureType: z.enum(LECTURE_TYPE_VALUES),
  notes: z.string().trim().max(500).nullable().optional(),
});

export const updateTimetableEntrySchema = insertTimetableEntrySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one timetable field is required");

export type InsertTimetableEntry = z.infer<typeof insertTimetableEntrySchema>;
export type UpdateTimetableEntry = z.infer<typeof updateTimetableEntrySchema>;
