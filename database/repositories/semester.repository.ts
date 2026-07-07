import { asc, desc, eq, like } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  semesters,
  insertSemesterSchema,
  updateSemesterSchema,
  type InsertSemester,
  type UpdateSemester,
} from "@/database/schema/semester";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class SemesterRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(semesters)
        .orderBy(desc(semesters.startDate))
        .limit(options.limit ?? 100)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list semesters");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db.select().from(semesters).where(eq(semesters.id, id)).limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load semester");
    }
  }

  async search(term: string) {
    try {
      return await this.db
        .select()
        .from(semesters)
        .where(like(semesters.name, `%${term.trim()}%`))
        .orderBy(asc(semesters.name));
    } catch (error) {
      throw toRepositoryError(error, "Failed to search semesters");
    }
  }

  async insert(payload: InsertSemester) {
    const validated = validateOrThrow(
      insertSemesterSchema,
      payload,
      "Invalid semester insert payload",
    );

    try {
      const [row] = await this.db
        .insert(semesters)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert semester");
    }
  }

  async update(id: string, payload: UpdateSemester) {
    const validated = validateOrThrow(
      updateSemesterSchema,
      payload,
      "Invalid semester update payload",
    );

    try {
      const [row] = await this.db
        .update(semesters)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(semesters.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update semester");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db.delete(semesters).where(eq(semesters.id, id)).returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete semester");
    }
  }
}
