import { and, asc, desc, eq, gte, lte } from "drizzle-orm";

import {
  createId,
  toRepositoryError,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
} from "@/database/helpers";
import {
  attendanceRecords,
  insertAttendanceRecordSchema,
  updateAttendanceRecordSchema,
  type InsertAttendanceRecord,
  type UpdateAttendanceRecord,
} from "@/database/schema/attendance";
import type { Club75Database, RepositoryListOptions } from "@/database/types";

export class AttendanceRepository {
  constructor(private readonly db: Club75Database) {}

  async getAll(options: RepositoryListOptions = {}) {
    try {
      return await this.db
        .select()
        .from(attendanceRecords)
        .orderBy(desc(attendanceRecords.date))
        .limit(options.limit ?? 500)
        .offset(options.offset ?? 0);
    } catch (error) {
      throw toRepositoryError(error, "Failed to list attendance");
    }
  }

  async getById(id: string) {
    try {
      const [row] = await this.db
        .select()
        .from(attendanceRecords)
        .where(eq(attendanceRecords.id, id))
        .limit(1);
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to load attendance record");
    }
  }

  async getBySubject(subjectId: string) {
    try {
      return await this.db
        .select()
        .from(attendanceRecords)
        .where(eq(attendanceRecords.subjectId, subjectId))
        .orderBy(desc(attendanceRecords.date));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load subject attendance");
    }
  }

  async getByDateRange(startDate: string, endDate: string) {
    try {
      return await this.db
        .select()
        .from(attendanceRecords)
        .where(and(gte(attendanceRecords.date, startDate), lte(attendanceRecords.date, endDate)))
        .orderBy(asc(attendanceRecords.date));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load attendance range");
    }
  }

  async findByStatus(status: InsertAttendanceRecord["status"]) {
    try {
      return await this.db
        .select()
        .from(attendanceRecords)
        .where(eq(attendanceRecords.status, status))
        .orderBy(desc(attendanceRecords.date));
    } catch (error) {
      throw toRepositoryError(error, "Failed to load attendance by status");
    }
  }

  async insert(payload: InsertAttendanceRecord) {
    const validated = validateOrThrow(
      insertAttendanceRecordSchema,
      payload,
      "Invalid attendance insert payload",
    );

    try {
      const [row] = await this.db
        .insert(attendanceRecords)
        .values({ id: validated.id ?? createId(), ...validated, ...touchTimestamps() })
        .returning();
      return row;
    } catch (error) {
      throw toRepositoryError(error, "Failed to insert attendance record");
    }
  }

  async update(id: string, payload: UpdateAttendanceRecord) {
    const validated = validateOrThrow(
      updateAttendanceRecordSchema,
      payload,
      "Invalid attendance update payload",
    );

    try {
      const [row] = await this.db
        .update(attendanceRecords)
        .set({ ...validated, ...updatedTimestamp() })
        .where(eq(attendanceRecords.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to update attendance record");
    }
  }

  async delete(id: string) {
    try {
      const [row] = await this.db
        .delete(attendanceRecords)
        .where(eq(attendanceRecords.id, id))
        .returning();
      return row ?? null;
    } catch (error) {
      throw toRepositoryError(error, "Failed to delete attendance record");
    }
  }
}
