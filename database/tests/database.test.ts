import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import * as schema from "@/database/schema";
import type { Club75Database } from "@/database/types";

describe("Database Initialization", () => {
  let db: Club75Database;

  beforeEach(() => {
    db = createTestDatabase();
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  it("creates an in-memory database", () => {
    expect(db).toBeDefined();
  });

  it("creates all expected tables", async () => {
    const tables = Object.keys(schema);
    expect(tables).toContain("semesters");
    expect(tables).toContain("subjects");
    expect(tables).toContain("attendanceRecords");
    expect(tables).toContain("lectureSlots");
    expect(tables).toContain("timetableEntries");
    expect(tables).toContain("goals");
    expect(tables).toContain("settings");
    expect(tables).toContain("themePreferences");
    expect(tables).toContain("notificationPreferences");
    expect(tables).toContain("appPreferences");
    expect(tables).toContain("aiMetadata");
  });

  it("supports basic SELECT", async () => {
    const result = await db.select().from(schema.semesters);
    expect(result).toEqual([]);
  });
});
