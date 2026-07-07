import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { AiMetadataRepository } from "@/database/repositories/ai-metadata.repository";
import { createId } from "@/database/helpers";
import type { Club75Database } from "@/database/types";

describe("AiMetadataRepository", () => {
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

  const validMetadata = (overrides: Record<string, unknown> = {}) => ({
    namespace: "prediction",
    key: "risk_score",
    value: "0.42",
    ...overrides,
  });

  describe("insert", () => {
    it("creates metadata", async () => {
      const repo = new AiMetadataRepository(db);
      const meta = await repo.insert(validMetadata({ semesterId, subjectId }));
      expect(meta.namespace).toBe("prediction");
      expect(meta.key).toBe("risk_score");
      expect(meta.value).toBe("0.42");
      expect(meta.semesterId).toBe(semesterId);
      expect(meta.subjectId).toBe(subjectId);
    });
  });

  describe("getAll", () => {
    it("returns all metadata", async () => {
      const repo = new AiMetadataRepository(db);
      await repo.insert(validMetadata({ semesterId }));
      await repo.insert(validMetadata({ key: "confidence", value: "0.9" }));
      const result = await repo.getAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns correct metadata", async () => {
      const repo = new AiMetadataRepository(db);
      const created = await repo.insert(validMetadata());
      const found = await repo.getById(created.id);
      expect(found!.id).toBe(created.id);
    });

    it("returns null for nonexistent id", async () => {
      const repo = new AiMetadataRepository(db);
      expect(await repo.getById(createId())).toBeNull();
    });
  });

  describe("findByNamespace", () => {
    it("filters by namespace", async () => {
      const repo = new AiMetadataRepository(db);
      await repo.insert(validMetadata({ namespace: "prediction" }));
      await repo.insert(validMetadata({ namespace: "analytics", key: "trend" }));
      const result = await repo.findByNamespace("prediction");
      expect(result).toHaveLength(1);
      expect(result[0].namespace).toBe("prediction");
    });

    it("filters by namespace and subjectId", async () => {
      const repo = new AiMetadataRepository(db);
      await repo.insert(validMetadata({ namespace: "prediction", semesterId, subjectId }));
      await repo.insert(validMetadata({ namespace: "prediction", semesterId }));
      const result = await repo.findByNamespace("prediction", subjectId);
      expect(result).toHaveLength(1);
    });

    it("filters by namespace and semesterId", async () => {
      const repo = new AiMetadataRepository(db);
      await repo.insert(validMetadata({ namespace: "prediction", semesterId }));
      await repo.insert(validMetadata({ namespace: "prediction" }));
      const result = await repo.findByNamespace("prediction", undefined, semesterId);
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("updates metadata", async () => {
      const repo = new AiMetadataRepository(db);
      const created = await repo.insert(validMetadata());
      const updated = await repo.update(created.id, { value: "0.99" });
      expect(updated!.value).toBe("0.99");
    });

    it("returns null for nonexistent id", async () => {
      const repo = new AiMetadataRepository(db);
      expect(await repo.update(createId(), { value: "X" })).toBeNull();
    });
  });

  describe("delete", () => {
    it("deletes metadata", async () => {
      const repo = new AiMetadataRepository(db);
      const created = await repo.insert(validMetadata());
      await repo.delete(created.id);
      expect(await repo.getById(created.id)).toBeNull();
    });
  });
});
