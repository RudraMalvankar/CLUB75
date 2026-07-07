import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { baseTimestamps, textPrimaryKey } from "@/database/helpers";
import { semesters } from "@/database/schema/semester";
import { subjects } from "@/database/schema/subjects";

export const aiMetadata = sqliteTable(
  "ai_metadata",
  {
    id: textPrimaryKey(),
    semesterId: text("semester_id").references(() => semesters.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    subjectId: text("subject_id").references(() => subjects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    namespace: text("namespace").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    ...baseTimestamps,
  },
  (table) => [
    index("ai_metadata_namespace_idx").on(table.namespace),
    index("ai_metadata_subject_idx").on(table.subjectId),
    index("ai_metadata_semester_idx").on(table.semesterId),
  ],
);

export const insertAiMetadataSchema = z.object({
  id: z.uuid().optional(),
  semesterId: z.uuid().nullable().optional(),
  subjectId: z.uuid().nullable().optional(),
  namespace: z.string().trim().min(1).max(80),
  key: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1),
});

export const updateAiMetadataSchema = insertAiMetadataSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one AI metadata field is required");

export type InsertAiMetadata = z.infer<typeof insertAiMetadataSchema>;
export type UpdateAiMetadata = z.infer<typeof updateAiMetadataSchema>;
