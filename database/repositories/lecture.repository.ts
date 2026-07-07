import { and, asc, eq } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  insertLectureSlotSchema,
  lectureSlots,
  updateLectureSlotSchema,
  type InsertLectureSlot,
  type UpdateLectureSlot,
} from "@/database/schema/lectureSlots";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class LectureRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(lectureSlots)
        .orderBy(asc(lectureSlots.day), asc(lectureSlots.startTime))
        .limit(options.limit ?? 500)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list lecture slots");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db
        .select()
        .from(lectureSlots)
        .where(eq(lectureSlots.id, id))
        .limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load lecture slot");
    }
  }

  async getBySemester(semesterId: string) {
    try {
      return await this.db
        .select()
        .from(lectureSlots)
        .where(eq(lectureSlots.semesterId, semesterId))
        .orderBy(asc(lectureSlots.day), asc(lectureSlots.startTime));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load lecture slots");
    }
  }

  async findByDay(semesterId: string, day: string) {
    try {
      return await this.db
        .select()
        .from(lectureSlots)
        .where(and(eq(lectureSlots.semesterId, semesterId), eq(lectureSlots.day, day)))
        .orderBy(asc(lectureSlots.startTime));
    } catch (error) {
      throw toRepositoryError(error, "Failed to find lecture slots by day");
    }
  }

  async insert(payload: InsertLectureSlot) {
    const validated = validateOrThrow(
      insertLectureSlotSchema,
      payload,
      "Invalid lecture slot insert payload",
    );

    try {
      const [row] = await this.db
        .insert(lectureSlots)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert lecture slot");
    }
  }

  async update(id: string, payload: UpdateLectureSlot) {
    const validated = validateOrThrow(
      updateLectureSlotSchema,
      payload,
      "Invalid lecture slot update payload",
    );

    try {
      const [row] = await this.db
        .update(lectureSlots)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(lectureSlots.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update lecture slot");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db.delete(lectureSlots).where(eq(lectureSlots.id, id)).returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete lecture slot");
    }
  }
}
