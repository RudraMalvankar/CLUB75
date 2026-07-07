import { and, asc, eq } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  goals,
  insertGoalSchema,
  updateGoalSchema,
  type InsertGoal,
  type UpdateGoal,
} from "@/database/schema/goals";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class GoalRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(goals)
        .orderBy(asc(goals.name))
        .limit(options.limit ?? 100)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list goals");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db.select().from(goals).where(eq(goals.id, id)).limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load goal");
    }
  }

  async getActive() {
    try {
      return await this.db
        .select()
        .from(goals)
        .where(eq(goals.isActive, true))
        .orderBy(asc(goals.name));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load active goals");
    }
  }

  async findByScope(scope: InsertGoal["scope"], subjectId?: string, semesterId?: string) {
    try {
      const filters = [eq(goals.scope, scope)];
      if (subjectId) filters.push(eq(goals.subjectId, subjectId));
      if (semesterId) filters.push(eq(goals.semesterId, semesterId));

      return await this.db
        .select()
        .from(goals)
        .where(and(...filters))
        .orderBy(asc(goals.name));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load scoped goals");
    }
  }

  async insert(payload: InsertGoal) {
    const validated = validateOrThrow(insertGoalSchema, payload, "Invalid goal insert payload");

    try {
      const [row] = await this.db
        .insert(goals)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert goal");
    }
  }

  async update(id: string, payload: UpdateGoal) {
    const validated = validateOrThrow(updateGoalSchema, payload, "Invalid goal update payload");

    try {
      const [row] = await this.db
        .update(goals)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(goals.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update goal");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db.delete(goals).where(eq(goals.id, id)).returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete goal");
    }
  }
}
