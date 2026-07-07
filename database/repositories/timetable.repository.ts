import { and, asc, eq } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  insertTimetableEntrySchema,
  timetableEntries,
  updateTimetableEntrySchema,
  type InsertTimetableEntry,
  type UpdateTimetableEntry,
} from "@/database/schema/timetable";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class TimetableRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(timetableEntries)
        .orderBy(asc(timetableEntries.lectureSlotId))
        .limit(options.limit ?? 500)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list timetable entries");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db
        .select()
        .from(timetableEntries)
        .where(eq(timetableEntries.id, id))
        .limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load timetable entry");
    }
  }

  async getBySubject(subjectId: string) {
    try {
      return await this.db
        .select()
        .from(timetableEntries)
        .where(eq(timetableEntries.subjectId, subjectId))
        .orderBy(asc(timetableEntries.lectureSlotId));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load subject timetable");
    }
  }

  async findByLectureSlot(lectureSlotId: string) {
    try {
      return await this.db
        .select()
        .from(timetableEntries)
        .where(eq(timetableEntries.lectureSlotId, lectureSlotId))
        .orderBy(asc(timetableEntries.subjectId));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load lecture timetable");
    }
  }

  async findBySubjectAndLectureSlot(subjectId: string, lectureSlotId: string) {
    try {
      const [row] = await this.db
        .select()
        .from(timetableEntries)
        .where(
          and(
            eq(timetableEntries.subjectId, subjectId),
            eq(timetableEntries.lectureSlotId, lectureSlotId),
          ),
        )
        .limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load timetable link");
    }
  }

  async insert(payload: InsertTimetableEntry) {
    const validated = validateOrThrow(
      insertTimetableEntrySchema,
      payload,
      "Invalid timetable insert payload",
    );

    try {
      const [row] = await this.db
        .insert(timetableEntries)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert timetable entry");
    }
  }

  async update(id: string, payload: UpdateTimetableEntry) {
    const validated = validateOrThrow(
      updateTimetableEntrySchema,
      payload,
      "Invalid timetable update payload",
    );

    try {
      const [row] = await this.db
        .update(timetableEntries)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(timetableEntries.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update timetable entry");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db
        .delete(timetableEntries)
        .where(eq(timetableEntries.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete timetable entry");
    }
  }
}
