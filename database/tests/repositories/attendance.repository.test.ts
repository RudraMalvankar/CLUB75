import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { AttendanceRepository } from "@/database/repositories/attendance.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("AttendanceRepository", () => {
  let db: Club75Database;
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
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  const validRecord = (overrides: Record<string, unknown> = {}) => ({
    subjectId,
    date: "2026-07-07",
    status: "present" as const,
    lectureNumber: 1,
    ...overrides,
  });

  describe("insert", () => {
    it("creates an attendance record", async () => {
      const repo = new AttendanceRepository(db);
      const record = await repo.insert(validRecord());
      expect(record.subjectId).toBe(subjectId);
      expect(record.status).toBe("present");
      expect(record.date).toBe("2026-07-07");
    });
  });

  describe("getAll", () => {
    it("returns all records", async () => {
      const repo = new AttendanceRepository(db);
      await repo.insert(validRecord({ date: "2026-07-01" }));
      await repo.insert(validRecord({ date: "2026-07-02" }));
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns correct record", async () => {
      const repo = new AttendanceRepository(db);
      const created = await repo.insert(validRecord());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new AttendanceRepository(db);
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("getBySubject", () => {
    it("filters by subject", async () => {
      const repo = new AttendanceRepository(db);
      await repo.insert(validRecord({ date: "2026-07-01" }));
      await repo.insert(validRecord({ date: "2026-07-02" }));
      const result = await repo.getBySubject(subjectId);
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.subjectId === subjectId)).toBe(true);
    });
  });

  describe("getByDateRange", () => {
    it("filters by date range", async () => {
      const repo = new AttendanceRepository(db);
      await repo.insert(validRecord({ date: "2026-07-01" }));
      await repo.insert(validRecord({ date: "2026-07-05" }));
      await repo.insert(validRecord({ date: "2026-07-10" }));
      const result = await repo.getByDateRange("2026-07-03", "2026-07-08");
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe("2026-07-05");
    });
  });

  describe("findByStatus", () => {
    it("filters by status", async () => {
      const repo = new AttendanceRepository(db);
      await repo.insert(validRecord({ date: "2026-07-01", status: "present" }));
      await repo.insert(validRecord({ date: "2026-07-02", status: "absent" }));
      await repo.insert(validRecord({ date: "2026-07-03", status: "present" }));
      const result = await repo.findByStatus("absent");
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("absent");
    });
  });

  describe("update", () => {
    it("updates a record", async () => {
      const repo = new AttendanceRepository(db);
      const created = await repo.insert(validRecord());
      const updated = await repo.update(created.id, { status: "absent" });
      expect(updated!.status).toBe("absent");
    });

    it("returns null for nonexistent id", async () => {
      const repo = new AttendanceRepository(db);
      expect(await repo.update(createId(), { status: "absent" })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a record", async () => {
      const repo = new AttendanceRepository(db);
      const created = await repo.insert(validRecord());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
