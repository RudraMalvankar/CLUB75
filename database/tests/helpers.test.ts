import { describe, it, expect } from "vitest";

import {
  createId,
  nowTimestamp,
  touchTimestamps,
  updatedTimestamp,
  validateOrThrow,
  toRepositoryError,
  splitSqlStatements,
  hexColorSchema,
  dateOnlySchema,
  timeSchema,
  idSchema,
  notesSchema,
  ATTENDANCE_STATUS_VALUES,
  LECTURE_TYPE_VALUES,
  DAY_OF_WEEK_VALUES,
  THEME_PREFERENCE_VALUES,
  GOAL_SCOPE_VALUES,
} from "@/database/helpers";
import { ValidationError, RepositoryError } from "@/database/errors";
import { z } from "zod";

describe("createId", () => {
  it("returns a valid UUID string", () => {
    const id = createId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => createId()));
    expect(ids.size).toBe(100);
  });
});

describe("timestamps", () => {
  it("nowTimestamp returns a Date", () => {
    const ts = nowTimestamp();
    expect(ts).toBeInstanceOf(Date);
  });

  it("touchTimestamps returns createdAt and updatedAt", () => {
    const ts = touchTimestamps();
    expect(ts).toHaveProperty("createdAt");
    expect(ts).toHaveProperty("updatedAt");
    expect(ts.createdAt).toBeInstanceOf(Date);
    expect(ts.updatedAt).toBeInstanceOf(Date);
    expect(ts.createdAt.getTime()).toBe(ts.updatedAt.getTime());
  });

  it("updatedTimestamp returns only updatedAt", () => {
    const ts = updatedTimestamp();
    expect(ts).toHaveProperty("updatedAt");
    expect(ts).not.toHaveProperty("createdAt");
    expect(ts.updatedAt).toBeInstanceOf(Date);
  });
});

describe("validateOrThrow", () => {
  const schema = z.object({ name: z.string().min(1) });

  it("returns validated data on success", () => {
    const result = validateOrThrow(schema, { name: "test" }, "err");
    expect(result).toEqual({ name: "test" });
  });

  it("throws ValidationError on failure", () => {
    expect(() => validateOrThrow(schema, { name: "" }, "err")).toThrow(ValidationError);
  });
});

describe("toRepositoryError", () => {
  it("wraps unknown errors into RepositoryError", () => {
    const err = toRepositoryError(new Error("boom"), "ctx");
    expect(err).toBeInstanceOf(RepositoryError);
    expect(err.message).toContain("ctx");
  });

  it("passes through RepositoryError unchanged", () => {
    const original = new RepositoryError("original");
    const wrapped = toRepositoryError(original, "ctx");
    expect(wrapped).toBe(original);
  });

  it("passes through ValidationError unchanged", () => {
    const original = new ValidationError("original");
    const wrapped = toRepositoryError(original, "ctx");
    expect(wrapped).toBe(original);
  });
});

describe("splitSqlStatements", () => {
  it("splits on statement-breakpoint comments", () => {
    const sql = "CREATE TABLE a (id int);--> statement-breakpoint\nCREATE TABLE b (id int);";
    const result = splitSqlStatements(sql);
    expect(result).toHaveLength(2);
    expect(result[0]).toContain("CREATE TABLE a");
    expect(result[1]).toContain("CREATE TABLE b");
  });

  it("filters empty segments", () => {
    const sql = "SELECT 1;--> statement-breakpoint\n\n--> statement-breakpoint\nSELECT 2;";
    const result = splitSqlStatements(sql);
    expect(result).toHaveLength(2);
  });
});

describe("Zod schemas", () => {
  it("hexColorSchema accepts valid hex", () => {
    expect(hexColorSchema.safeParse("#FF00AA").success).toBe(true);
    expect(hexColorSchema.safeParse("#abcdef").success).toBe(true);
    expect(hexColorSchema.safeParse("red").success).toBe(false);
    expect(hexColorSchema.safeParse("#FFF").success).toBe(false);
  });

  it("dateOnlySchema accepts YYYY-MM-DD", () => {
    expect(dateOnlySchema.safeParse("2026-07-07").success).toBe(true);
    expect(dateOnlySchema.safeParse("07-07-2026").success).toBe(false);
    expect(dateOnlySchema.safeParse("2026/07/07").success).toBe(false);
  });

  it("timeSchema accepts HH:MM", () => {
    expect(timeSchema.safeParse("09:00").success).toBe(true);
    expect(timeSchema.safeParse("23:59").success).toBe(true);
    expect(timeSchema.safeParse("24:00").success).toBe(false);
    expect(timeSchema.safeParse("9:00").success).toBe(false);
  });

  it("idSchema validates UUID", () => {
    expect(idSchema.safeParse("not-a-uuid").success).toBe(false);
    expect(idSchema.safeParse(createId()).success).toBe(true);
  });

  it("notesSchema trims and caps at 500", () => {
    expect(notesSchema.safeParse(null).success).toBe(true);
    expect(notesSchema.safeParse(undefined).success).toBe(true);
    expect(notesSchema.safeParse("short").success).toBe(true);
    expect(notesSchema.safeParse("x".repeat(501)).success).toBe(false);
  });
});

describe("constants", () => {
  it("ATTENDANCE_STATUS_VALUES is non-empty", () => {
    expect(ATTENDANCE_STATUS_VALUES.length).toBeGreaterThan(0);
    expect(ATTENDANCE_STATUS_VALUES).toContain("present");
    expect(ATTENDANCE_STATUS_VALUES).toContain("absent");
  });

  it("LECTURE_TYPE_VALUES is non-empty", () => {
    expect(LECTURE_TYPE_VALUES.length).toBeGreaterThan(0);
    expect(LECTURE_TYPE_VALUES).toContain("lecture");
  });

  it("DAY_OF_WEEK_VALUES has 7 days", () => {
    expect(DAY_OF_WEEK_VALUES).toHaveLength(7);
  });

  it("THEME_PREFERENCE_VALUES includes all themes", () => {
    expect(THEME_PREFERENCE_VALUES).toContain("light");
    expect(THEME_PREFERENCE_VALUES).toContain("dark");
    expect(THEME_PREFERENCE_VALUES).toContain("amoled");
    expect(THEME_PREFERENCE_VALUES).toContain("system");
  });

  it("GOAL_SCOPE_VALUES is defined", () => {
    expect(GOAL_SCOPE_VALUES).toContain("overall");
    expect(GOAL_SCOPE_VALUES).toContain("semester");
    expect(GOAL_SCOPE_VALUES).toContain("subject");
  });
});
