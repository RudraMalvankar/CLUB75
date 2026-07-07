import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("SubjectRepository", () => {
  let db: Club75Database;
  let semesterRepo: SemesterRepository;
  let repo: SubjectRepository;
  let semesterId: string;

  beforeEach(async () => {
    db = createTestDatabase();
    semesterRepo = new SemesterRepository(db);
    repo = new SubjectRepository(db);
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

  const validSubject = (overrides: Record<string, unknown> = {}) => ({
    name: "Data Structures",
    code: "DSA501",
    faculty: "Prof. Sharma",
    color: "#4F46E5",
    credit: 4,
    minimumAttendance: 75,
    isLab: false,
    semesterId,
    ...overrides,
  });

  describe("insert", () => {
    it("creates a subject", async () => {
      const subject = await repo.insert(validSubject());
      expect(subject.name).toBe("Data Structures");
      expect(subject.code).toBe("DSA501");
      expect(subject.semesterId).toBe(semesterId);
    });

    it("rejects duplicate code within semester", async () => {
      await repo.insert(validSubject());
      await expect(repo.insert(validSubject())).rejects.toThrow();
    });
  });

  describe("getAll", () => {
    it("returns all subjects", async () => {
      await repo.insert(validSubject());
      await repo.insert(validSubject({ name: "OS", code: "OS503" }));
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns correct subject", async () => {
      const created = await repo.insert(validSubject());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("getBySemester", () => {
    it("filters by semester", async () => {
      await repo.insert(validSubject());
      const otherSemester = await semesterRepo.insert({
        name: "Semester 6",
        startDate: "2027-01-01",
        endDate: "2027-06-01",
        minimumAttendance: 75,
        currentWeek: 0,
        workingDays: 100,
      });
      await repo.insert(validSubject({ semesterId: otherSemester.id, name: "OS" }));
      const result = await repo.getBySemester(semesterId);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Data Structures");
    });
  });

  describe("search", () => {
    it("finds subjects by name", async () => {
      await repo.insert(validSubject());
      await repo.insert(validSubject({ name: "Operating Systems", code: "OS503" }));
      const result = await repo.search("Operating");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Operating Systems");
    });

    it("filters by semester when provided", async () => {
      await repo.insert(validSubject());
      const otherSemester = await semesterRepo.insert({
        name: "Semester 6",
        startDate: "2027-01-01",
        endDate: "2027-06-01",
        minimumAttendance: 75,
        currentWeek: 0,
        workingDays: 100,
      });
      await repo.insert(
        validSubject({ semesterId: otherSemester.id, name: "Data Structures Advanced" }),
      );
      const result = await repo.search("Data Structures", semesterId);
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("updates a subject", async () => {
      const created = await repo.insert(validSubject());
      const updated = await repo.update(created.id, { name: "DSA Updated" });
      expect(updated!.name).toBe("DSA Updated");
    });

    it("returns null for nonexistent id", async () => {
      expect(await repo.update(createId(), { name: "X" })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes a subject", async () => {
      const created = await repo.insert(validSubject());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
