import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { createTestDatabase, destroyTestDatabase } from "@/database/tests/test-db";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { LectureRepository } from "@/database/repositories/lecture.repository";
import { TimetableRepository } from "@/database/repositories/timetable.repository";
import { AttendanceRepository } from "@/database/repositories/attendance.repository";
import { GoalRepository } from "@/database/repositories/goal.repository";
import { SettingsRepository } from "@/database/repositories/settings.repository";
import { AiMetadataRepository } from "@/database/repositories/ai-metadata.repository";
import type { Club75Database } from "@/database/types";

describe("Seed Data Integration", () => {
  let db: Club75Database;

  beforeEach(() => {
    db = createTestDatabase();
  });

  afterEach(() => {
    destroyTestDatabase(db);
  });

  it("creates a full data chain: semester -> subjects -> lecture slots -> timetable -> attendance", async () => {
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const lectureRepo = new LectureRepository(db);
    const timetableRepo = new TimetableRepository(db);
    const attendanceRepo = new AttendanceRepository(db);

    const semester = await semesterRepo.insert({
      name: "Semester 5",
      startDate: "2026-07-01",
      endDate: "2026-12-01",
      minimumAttendance: 75,
      currentWeek: 4,
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

    const slot = await lectureRepo.insert({
      semesterId: semester.id,
      day: "monday",
      startTime: "09:00",
      endTime: "10:00",
      label: "L1",
    });

    const entry = await timetableRepo.insert({
      subjectId: subject.id,
      lectureSlotId: slot.id,
      room: "402",
      faculty: subject.faculty,
      lectureType: "lecture",
    });

    await attendanceRepo.insert({
      subjectId: subject.id,
      timetableEntryId: entry.id,
      lectureSlotId: slot.id,
      date: "2026-07-07",
      status: "present",
      lectureNumber: 1,
    });

    const attendance = await attendanceRepo.getBySubject(subject.id);
    expect(attendance).toHaveLength(1);
    expect(attendance[0].status).toBe("present");
    expect(attendance[0].subjectId).toBe(subject.id);

    const timetable = await timetableRepo.getBySubject(subject.id);
    expect(timetable).toHaveLength(1);
    expect(timetable[0].lectureSlotId).toBe(slot.id);

    const subjects = await subjectRepo.getBySemester(semester.id);
    expect(subjects).toHaveLength(1);

    const slots = await lectureRepo.getBySemester(semester.id);
    expect(slots).toHaveLength(1);
  });

  it("cascades semester deletion to subjects", async () => {
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

    await subjectRepo.insert({
      name: "Data Structures",
      code: "DSA501",
      faculty: "Prof. Sharma",
      color: "#4F46E5",
      credit: 4,
      minimumAttendance: 75,
      isLab: false,
      semesterId: semester.id,
    });

    await semesterRepo.delete(semester.id);

    const subjects = await subjectRepo.getBySemester(semester.id);
    expect(subjects).toHaveLength(0);
  });

  it("cascades subject deletion to attendance records", async () => {
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const attendanceRepo = new AttendanceRepository(db);

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

    await attendanceRepo.insert({
      subjectId: subject.id,
      date: "2026-07-07",
      status: "present",
    });

    await subjectRepo.delete(subject.id);

    const attendance = await attendanceRepo.getBySubject(subject.id);
    expect(attendance).toHaveLength(0);
  });

  it("settings upsert is idempotent", async () => {
    const repo = new SettingsRepository(db);
    const payload = {
      targetAttendance: 80,
      themePreference: {
        theme: "system" as const,
        followSystem: true,
        accentColor: "#4F46E5",
      },
      notificationPreference: {
        enabled: true,
        attendanceRemindersEnabled: true,
        lowAttendanceAlertsEnabled: true,
        dailySummaryEnabled: false,
        reminderLeadMinutes: 15,
      },
      appPreference: {
        language: "en" as const,
        hapticsEnabled: true,
        analyticsOptIn: false,
        reducedMotion: false,
      },
    };

    const first = await repo.upsert(payload);
    const second = await repo.upsert({ ...payload, targetAttendance: 90 });

    expect(first.id).toBe(second.id);
    expect(second.targetAttendance).toBe(90);

    const settings = await repo.getSettings();
    expect(settings!.targetAttendance).toBe(90);
  });

  it("supports full goal lifecycle", async () => {
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const goalRepo = new GoalRepository(db);

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

    const semesterGoal = await goalRepo.insert({
      name: "Semester Goal",
      goalType: "attendance",
      scope: "semester",
      semesterId: semester.id,
      subjectId: null,
      targetAttendance: 80,
      isActive: true,
    });

    const subjectGoal = await goalRepo.insert({
      name: "Subject Goal",
      goalType: "attendance",
      scope: "subject",
      semesterId: semester.id,
      subjectId: subject.id,
      targetAttendance: 85,
      isActive: true,
    });

    const allGoals = await goalRepo.getAll();
    expect(allGoals).toHaveLength(2);

    const activeGoals = await goalRepo.getActive();
    expect(activeGoals).toHaveLength(2);

    const semesterGoals = await goalRepo.findByScope("semester", undefined, semester.id);
    expect(semesterGoals).toHaveLength(1);

    const subjectGoals = await goalRepo.findByScope("subject", subject.id);
    expect(subjectGoals).toHaveLength(1);

    await goalRepo.update(semesterGoal.id, { isActive: false });
    const activeAfter = await goalRepo.getActive();
    expect(activeAfter).toHaveLength(1);

    await goalRepo.delete(subjectGoal.id);
    const remaining = await goalRepo.getAll();
    expect(remaining).toHaveLength(1);
  });

  it("supports AI metadata namespace queries", async () => {
    const semesterRepo = new SemesterRepository(db);
    const subjectRepo = new SubjectRepository(db);
    const aiRepo = new AiMetadataRepository(db);

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

    await aiRepo.insert({
      semesterId: semester.id,
      subjectId: subject.id,
      namespace: "prediction",
      key: "risk_score",
      value: "0.42",
    });

    await aiRepo.insert({
      semesterId: semester.id,
      namespace: "analytics",
      key: "weekly_trend",
      value: "improving",
    });

    const predictions = await aiRepo.findByNamespace("prediction", subject.id, semester.id);
    expect(predictions).toHaveLength(1);
    expect(predictions[0].key).toBe("risk_score");

    const analytics = await aiRepo.findByNamespace("analytics");
    expect(analytics).toHaveLength(1);
    expect(analytics[0].key).toBe("weekly_trend");
  });
});
