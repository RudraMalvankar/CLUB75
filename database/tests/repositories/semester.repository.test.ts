import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { ValidationError } from "@/database/errors";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("SemesterRepository", () => {
  let db: Club75Database;
  let repo: SemesterRepository;

  beforeEach(() => {
    db = createTestDatabase();
    repo = new SemesterRepository(db);
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validPayload = {
    name: "Semester 5",
    startDate: "2026-07-01",
    endDate: "2026-12-01",
    minimumAttendance: 75,
    currentWeek: 1,
    workingDays: 110,
  };

  describe("insert", () => {
    it("creates a semester", async () => {
      const semester = await repo.insert(validPayload);
      expect(semester).toBeDefined();
      expect(semester.name).toBe("Semester 5");
      expect(semester.startDate).toBe("2026-07-01");
      expect(semester.minimumAttendance).toBe(75);
      expect(semester.id).toBeDefined();
      expect(semester.createdAt).toBeDefined();
      expect(semester.updatedAt).toBeDefined();
    });

    it("rejects invalid payload", async () => {
      await expect(repo.insert({ ...validPayload, name: "" })).rejects.toThrow(ValidationError);
    });
  });

  describe("getAll", () => {
    it("returns empty array when no semesters exist", async () => {
      const result = await repo.getAll();
      expect(result).toEqual([]);
    });

    it("returns all semesters", async () => {
      await repo.insert(validPayload);
      await repo.insert({ ...validPayload, name: "Semester 6" });
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });

    it("respects limit option", async () => {
      await repo.insert(validPayload);
      await repo.insert({ ...validPayload, name: "Semester 6" });
      const result = await repo.getAll({ limit: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe("getById", () => {
    it("returns null for nonexistent id", async () => {
      const result = await repo.getById(createId());
      expect(result).toBeNull();
    });

    it("returns the correct semester", async () => {
      const created = await repo.insert(validPayload);
      const found = await repo.getById(created.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });
  });

  describe("search", () => {
    it("finds semesters by name", async () => {
      await repo.insert(validPayload);
      await repo.insert({ ...validPayload, name: "Semester 6" });
      const result = await repo.search("Semester 5");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Semester 5");
    });

    it("returns empty for no match", async () => {
      await repo.insert(validPayload);
      const result = await repo.search("Nonexistent");
      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("updates a semester field", async () => {
      const created = await repo.insert(validPayload);
      const updated = await repo.update(created.id, { name: "Updated" });
      expect(updated).toBeDefined();
      expect(updated!.name).toBe("Updated");
    });

    it("returns null for nonexistent id", async () => {
      const result = await repo.update(createId(), { name: "X" });
      expect(result).toBeNull();
    });

    it("rejects invalid update", async () => {
      const created = await repo.insert(validPayload);
      await expect(repo.update(created.id, { minimumAttendance: 200 })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe("delete", () => {
    it("deletes a semester", async () => {
      const created = await repo.insert(validPayload);
      const deleted = await repo.delete(created.id);
      expect(deleted).toBeDefined();
      const found = await repo.getById(created.id);
      expect(found).toBeNull();
    });

    it("returns null for nonexistent id", async () => {
      const result = await repo.delete(createId());
      expect(result).toBeNull();
    });
  });
});
