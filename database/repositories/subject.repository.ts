import { and, asc, eq, like } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  insertSubjectSchema,
  subjects,
  updateSubjectSchema,
  type InsertSubject,
  type UpdateSubject,
} from "@/database/schema/subjects";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class SubjectRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(subjects)
        .orderBy(asc(subjects.name))
        .limit(options.limit ?? 250)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list subjects");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db.select().from(subjects).where(eq(subjects.id, id)).limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load subject");
    }
  }

  async getBySemester(semesterId: string) {
    try {
      return await this.db
        .select()
        .from(subjects)
        .where(eq(subjects.semesterId, semesterId))
        .orderBy(asc(subjects.name));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load semester subjects");
    }
  }

  async search(term: string, semesterId?: string) {
    try {
      const filters = [like(subjects.name, `%${term.trim()}%`)];
      if (semesterId) {
        filters.push(eq(subjects.semesterId, semesterId));
      }

      return await this.db
        .select()
        .from(subjects)
        .where(and(...filters))
        .orderBy(asc(subjects.name));
    } catch (error) {
      throw toRepositoryError(error, "Failed to search subjects");
    }
  }

  async insert(payload: InsertSubject) {
    const validated = validateOrThrow(
      insertSubjectSchema,
      payload,
      "Invalid subject insert payload",
    );

    try {
      const [row] = await this.db
        .insert(subjects)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert subject");
    }
  }

  async update(id: string, payload: UpdateSubject) {
    const validated = validateOrThrow(
      updateSubjectSchema,
      payload,
      "Invalid subject update payload",
    );

    try {
      const [row] = await this.db
        .update(subjects)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(subjects.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update subject");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db.delete(subjects).where(eq(subjects.id, id)).returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete subject");
    }
  }
}
