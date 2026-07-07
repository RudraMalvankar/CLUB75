import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { LectureRepository } from "@/database/repositories/lecture.repository";
import { TimetableRepository } from "@/database/repositories/timetable.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("TimetableRepository", () => {
  let db: Club75Database;
  let subjectId: string;
  let lectureSlotId: string;

  beforeEach(async () => {
    db = createTestDatabase();
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const lectureRepo = new LectureRepository(db);

    const semester = await semesterRepo.insert({
      name: "Semester 5",
      startDate: "2026-07-01",
      endDate: "2026-12-01",
      minimumAttendance: 75,
      currentWeek: 1,
      workingDays: 110,
    });

    const subject = await subjectRepo.insert({
      name: "Data Structures",
      code: "DSA501",
      faculty: "Prof. Sharma",
      color: "#4F46E5",
      credit: 4,
      minimumAttendance: 75,
      isLab: false,
      semesterId: semester.id,
    });
    subjectId = subject.id;

    const slot = await lectureRepo.insert({
      semesterId: semester.id,
      day: "monday",
      startTime: "09:00",
      endTime: "10:00",
    });
    lectureSlotId = slot.id;
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validEntry = (overrides: Record<string, unknown> = {}) => ({
    subjectId,
    lectureSlotId,
    lectureType: "lecture" as const,
    ...overrides,
  });

  describe("insert", () => {
    it("creates a timetable entry", async () => {
      const repo = new TimetableRepository(db);
      const entry = await repo.insert(validEntry());
      expect(entry.subjectId).toBe(subjectId);
      expect(entry.lectureSlotId).toBe(lectureSlotId);
      expect(entry.lectureType).toBe("lecture");
    });

    it("rejects duplicate subject+slot combination", async () => {
      const repo = new TimetableRepository(db);
      await repo.insert(validEntry());
      await expect(repo.insert(validEntry())).rejects.toThrow();
    });
  });

  describe("getAll", () => {
    it("returns all entries", async () => {
      const repo = new TimetableRepository(db);
      await repo.insert(validEntry());
      const result = await repo.getAll();
      expect(result).toHaveLength(1);
    });
  });

  describe("getById", () => {
    it("returns correct entry", async () => {
      const repo = new TimetableRepository(db);
      const created = await repo.insert(validEntry());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new TimetableRepository(db);
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("getBySubject", () => {
    it("filters by subject", async () => {
      const repo = new TimetableRepository(db);
      await repo.insert(validEntry());
      const result = await repo.getBySubject(subjectId);
      expect(result).toHaveLength(1);
      expect(result[0].subjectId).toBe(subjectId);
    });
  });

  describe("findByLectureSlot", () => {
    it("filters by lecture slot", async () => {
      const repo = new TimetableRepository(db);
      await repo.insert(validEntry());
      const result = await repo.findByLectureSlot(lectureSlotId);
      expect(result).toHaveLength(1);
      expect(result[0].lectureSlotId).toBe(lectureSlotId);
    });
  });

  describe("findBySubjectAndLectureSlot", () => {
    it("finds exact match", async () => {
      const repo = new TimetableRepository(db);
      const created = await repo.insert(validEntry());
      const found = await repo.findBySubjectAndLectureSlot(subjectId, lectureSlotId);
      expect(found!.id).toBe(created.id);
    });

    it("returns null when no match", async () => {
      const repo = new TimetableRepository(db);
      const found = await repo.findBySubjectAndLectureSlot(subjectId, createId());
      expect(found).toBeNull();
    });
  });

  describe("update", () => {
    it("updates an entry", async () => {
      const repo = new TimetableRepository(db);
      const created = await repo.insert(validEntry());
      const updated = await repo.update(created.id, { room: "301" });
      expect(updated!.room).toBe("301");
    });

    it("returns null for nonexistent id", async () => {
      const repo = new TimetableRepository(db);
      expect(await repo.update(createId(), { room: "X" })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes an entry", async () => {
      const repo = new TimetableRepository(db);
      const created = await repo.insert(validEntry());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
