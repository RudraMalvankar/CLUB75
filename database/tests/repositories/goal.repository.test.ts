import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { GoalRepository } from "@/database/repositories/goal.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("GoalRepository", () => {
  let db: Club75Database;
  let semesterId: string;
  let subjectId: string;

  beforeEach(async () => {
    db = createTestDatabase();
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);

    const semester = await semesterRepo.insert({
      name: "Semester 5",
      startDate: "2026-07-01",
      endDate: "2026-12-01",
      minimumAttendance: 75,
      currentWeek: 1,
      workingDays: 110,
    });
    semesterId = semester.id;

    const subject = await subjectRepo.insert({
      name: "Data Structures",
      code: "DSA501",
      faculty: "Prof. Sharma",
      color: "#4F46E5",
      credit: 4,
      minimumAttendance: 75,
      isLab: false,
      semesterId,
    });
    subjectId = subject.id;
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validGoal = (overrides: Record<string, unknown> = {}) => ({
    name: "Maintain 80%",
    goalType: "attendance" as const,
    scope: "semester" as const,
    semesterId,
    subjectId: null,
    targetAttendance: 80,
    isActive: true,
    ...overrides,
  });

  describe("insert", () => {
    it("creates a goal", async () => {
      const repo = new GoalRepository(db);
      const goal = await repo.insert(validGoal());
      expect(goal.name).toBe("Maintain 80%");
      expect(goal.scope).toBe("semester");
      expect(goal.isActive).toBe(true);
    });
  });

  describe("getAll", () => {
    it("returns all goals", async () => {
      const repo = new GoalRepository(db);
      await repo.insert(validGoal());
      await repo.insert(validGoal({ name: "Subject Goal", scope: "subject", subjectId }));
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns correct goal", async () => {
      const repo = new GoalRepository(db);
      const created = await repo.insert(validGoal());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new GoalRepository(db);
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("getActive", () => {
    it("returns only active goals", async () => {
      const repo = new GoalRepository(db);
      await repo.insert(validGoal({ isActive: true }));
      await repo.insert(validGoal({ name: "Inactive", isActive: false }));
      const result = await repo.getActive();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Maintain 80%");
    });
  });

  describe("findByScope", () => {
    it("filters by scope", async () => {
      const repo = new GoalRepository(db);
      await repo.insert(validGoal({ scope: "semester" }));
      await repo.insert(validGoal({ name: "Subject", scope: "subject", subjectId }));
      const result = await repo.findByScope("subject");
      expect(result).toHaveLength(1);
      expect(result[0].scope).toBe("subject");
    });

    it("filters by scope and subjectId", async () => {
      const repo = new GoalRepository(db);
      await repo.insert(validGoal({ scope: "subject", subjectId }));
      const otherSubject = await new SubjectRepository(db).insert({
        name: "OS",
        code: "OS503",
        faculty: "Prof. Nair",
        color: "#0EA5E9",
        credit: 4,
        minimumAttendance: 75,
        isLab: false,
        semesterId,
      });
      await repo.insert(validGoal({ name: "Other", scope: "subject", subjectId: otherSubject.id }));
      const result = await repo.findByScope("subject", subjectId);
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("updates a goal", async () => {
      const repo = new GoalRepository(db);
      const created = await repo.insert(validGoal());
      const updated = await repo.update(created.id, { isActive: false });
      expect(updated!.isActive).toBe(false);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new GoalRepository(db);
      expect(await repo.update(createId(), { isActive: false })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a goal", async () => {
      const repo = new GoalRepository(db);
      const created = await repo.insert(validGoal());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
