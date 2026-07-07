import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { LectureRepository } from "@/database/repositories/lecture.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("LectureRepository", () => {
  let db: Club75Database;
  let semesterId: string;

  beforeEach(async () => {
    db = createTestDatabase();
    const semesterRepo = new SemesterRepository(db);
    const semester = await semesterRepo.insert({
      name: "Semester 5",
      startDate: "2026-07-01",
      endDate: "2026-12-01",
      minimumAttendance: 75,
      currentWeek: 1,
      workingDays: 110,
    });
    semesterId = semester.id;
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validSlot = (overrides: Record<string, unknown> = {}) => ({
    semesterId,
    day: "monday" as const,
    startTime: "09:00",
    endTime: "10:00",
    ...overrides,
  });

  describe("insert", () => {
    it("creates a lecture slot", async () => {
      const repo = new LectureRepository(db);
      const slot = await repo.insert(validSlot());
      expect(slot.day).toBe("monday");
      expect(slot.startTime).toBe("09:00");
      expect(slot.semesterId).toBe(semesterId);
    });
  });

  describe("getAll", () => {
    it("returns all slots", async () => {
      const repo = new LectureRepository(db);
      await repo.insert(validSlot());
      await repo.insert(validSlot({ day: "tuesday", startTime: "10:00", endTime: "11:00" }));
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns correct slot", async () => {
      const repo = new LectureRepository(db);
      const created = await repo.insert(validSlot());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new LectureRepository(db);
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("getBySemester", () => {
    it("filters by semester", async () => {
      const repo = new LectureRepository(db);
      await repo.insert(validSlot());
      const otherSemester = await new SemesterRepository(db).insert({
        name: "Semester 6",
        startDate: "2027-01-01",
        endDate: "2027-06-01",
        minimumAttendance: 75,
        currentWeek: 0,
        workingDays: 100,
      });
      await repo.insert(validSlot({ semesterId: otherSemester.id, day: "tuesday" }));
      const result = await repo.getBySemester(semesterId);
      expect(result).toHaveLength(1);
    });
  });

  describe("findByDay", () => {
    it("filters by semester and day", async () => {
      const repo = new LectureRepository(db);
      await repo.insert(validSlot({ day: "monday" }));
      await repo.insert(validSlot({ day: "tuesday", startTime: "10:00", endTime: "11:00" }));
      const result = await repo.findByDay(semesterId, "monday");
      expect(result).toHaveLength(1);
      expect(result[0].day).toBe("monday");
    });
  });

  describe("update", () => {
    it("updates a slot", async () => {
      const repo = new LectureRepository(db);
      const created = await repo.insert(validSlot());
      const updated = await repo.update(created.id, { label: "Updated" });
      expect(updated!.label).toBe("Updated");
    });

    it("returns null for nonexistent id", async () => {
      const repo = new LectureRepository(db);
      expect(await repo.update(createId(), { label: "X" })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a slot", async () => {
      const repo = new LectureRepository(db);
      const created = await repo.insert(validSlot());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
