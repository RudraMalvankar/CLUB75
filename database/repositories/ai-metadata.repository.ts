import { and, asc, eq } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  aiMetadata,
  insertAiMetadataSchema,
  updateAiMetadataSchema,
  type InsertAiMetadata,
  type UpdateAiMetadata,
} from "@/database/schema/aiMetadata";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class AiMetadataRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(aiMetadata)
        .orderBy(asc(aiMetadata.namespace), asc(aiMetadata.key))
        .limit(options.limit ?? 250)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list AI metadata");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db.select().from(aiMetadata).where(eq(aiMetadata.id, id)).limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load AI metadata");
    }
  }

  async findByNamespace(namespace: string, subjectId?: string, semesterId?: string) {
    try {
      const filters = [eq(aiMetadata.namespace, namespace)];
      if (subjectId) filters.push(eq(aiMetadata.subjectId, subjectId));
      if (semesterId) filters.push(eq(aiMetadata.semesterId, semesterId));

      return await this.db
        .select()
        .from(aiMetadata)
        .where(and(...filters))
        .orderBy(asc(aiMetadata.key));
    } catch (error) {
      throw toRepositoryError(error, "Failed to query AI metadata");
    }
  }

  async insert(payload: InsertAiMetadata) {
    const validated = validateOrThrow(
      insertAiMetadataSchema,
      payload,
      "Invalid AI metadata insert payload",
    );

    try {
      const [row] = await this.db
        .insert(aiMetadata)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert AI metadata");
    }
  }

  async update(id: string, payload: UpdateAiMetadata) {
    const validated = validateOrThrow(
      updateAiMetadataSchema,
      payload,
      "Invalid AI metadata update payload",
    );

    try {
      const [row] = await this.db
        .update(aiMetadata)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(aiMetadata.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update AI metadata");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db.delete(aiMetadata).where(eq(aiMetadata.id, id)).returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete AI metadata");
    }
  }
}
