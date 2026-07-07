import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import {
  ATTENDANCE_STATUS_VALUES,
  baseTimestamps,
  dateOnlySchema,
  textPrimaryKey,
} from "@/database/helpers";
import { lectureSlots } from "@/database/schema/lectureSlots";
import { subjects } from "@/database/schema/subjects";
import { timetableEntries } from "@/database/schema/timetable";

export const attendanceRecords = sqliteTable(
  "attendance_records",
  {
    id: textPrimaryKey(),
    subjectId: text("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade", onUpdate: "cascade" }),
    lectureSlotId: text("lecture_slot_id").references(() => lectureSlots.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    timetableEntryId: text("timetable_entry_id").references(() => timetableEntries.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    date: text("date").notNull(),
    status: text("status").notNull(),
    lectureNumber: integer("lecture_number"),
    notes: text("notes"),
    ...baseTimestamps,
  },
  (table) => [
    index("attendance_subject_idx").on(table.subjectId),
    index("attendance_date_idx").on(table.date),
    index("attendance_status_idx").on(table.status),
  ],
);

export const insertAttendanceRecordSchema = z.object({
  id: z.uuid().optional(),
  subjectId: z.uuid(),
  lectureSlotId: z.uuid().nullable().optional(),
  timetableEntryId: z.uuid().nullable().optional(),
  date: dateOnlySchema,
  status: z.enum(ATTENDANCE_STATUS_VALUES),
  lectureNumber: z.number().int().min(1).nullable().optional(),
  notes: z.string().trim().max(500).nullable().optional(),
});

export const updateAttendanceRecordSchema = insertAttendanceRecordSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one attendance field is required");

export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;
export type UpdateAttendanceRecord = z.infer<typeof updateAttendanceRecordSchema>;
