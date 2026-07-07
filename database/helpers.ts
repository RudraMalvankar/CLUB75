import { sql } from "drizzle-orm";
import { check, integer, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";

import { RepositoryError, ValidationError } from "@/database/errors";

export const ATTENDANCE_STATUS_VALUES = [
  "present",
  "absent",
  "cancelled",
  "medical",
  "holiday",
  "extraLecture",
] as const;

export const LECTURE_TYPE_VALUES = ["lecture", "practical", "lab", "theory", "tutorial"] as const;
export const DAY_OF_WEEK_VALUES = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export const THEME_PREFERENCE_VALUES = ["light", "dark", "amoled", "system"] as const;
export const LANGUAGE_VALUES = ["en"] as const;
export const GOAL_SCOPE_VALUES = ["overall", "semester", "subject"] as const;
export const GOAL_TYPE_VALUES = ["attendance"] as const;

export const baseTimestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
};

export function textPrimaryKey(columnName = "id") {
  return text(columnName).primaryKey();
}

export function createId() {
  return crypto.randomUUID();
}

export function nowTimestamp() {
  return new Date();
}

export function touchTimestamps() {
  const now = nowTimestamp();
  return { createdAt: now, updatedAt: now };
}

export function updatedTimestamp() {
  return { updatedAt: nowTimestamp() };
}

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/u, "Expected a six-character hex color");
export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Expected YYYY-MM-DD date");
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/u, "Expected HH:MM time");
export const idSchema = z.uuid();
export const notesSchema = z.string().trim().max(500).nullable().optional();

export function validateOrThrow<T>(schema: z.ZodType<T>, payload: unknown, message: string) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new ValidationError(message, result.error.flatten());
  }

  return result.data;
}

export function toRepositoryError(error: unknown, context: string) {
  if (error instanceof RepositoryError || error instanceof ValidationError) {
    return error;
  }

  const message = error instanceof Error ? error.message : "Unknown repository failure";
  return new RepositoryError(`${context}: ${message}`, error);
}

export function percentageCheck(columnName: string) {
  return check(
    `${columnName}_range_check`,
    sql`${sql.identifier(columnName)} >= 0 AND ${sql.identifier(columnName)} <= 100`,
  );
}

export function nonNegativeCheck(columnName: string) {
  return check(`${columnName}_non_negative_check`, sql`${sql.identifier(columnName)} >= 0`);
}

export function foreignKeyPragmaSql() {
  return "PRAGMA foreign_keys = ON;";
}

export function splitSqlStatements(source: string) {
  return source
    .split("--> statement-breakpoint")
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}
