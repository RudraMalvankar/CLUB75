import { describe, it, expect } from "vitest";

import { insertSemesterSchema, updateSemesterSchema } from "@/database/schema/semester";
import { insertSubjectSchema, updateSubjectSchema } from "@/database/schema/subjects";
import {
  insertAttendanceRecordSchema,
  updateAttendanceRecordSchema,
} from "@/database/schema/attendance";
import { insertLectureSlotSchema, updateLectureSlotSchema } from "@/database/schema/lectureSlots";
import {
  insertTimetableEntrySchema,
  updateTimetableEntrySchema,
} from "@/database/schema/timetable";
import { insertGoalSchema, updateGoalSchema } from "@/database/schema/goals";
import { insertSettingsSchema, updateSettingsSchema } from "@/database/schema/settings";
import {
  insertThemePreferenceSchema,
  insertNotificationPreferenceSchema,
  insertAppPreferenceSchema,
} from "@/database/schema/preferences";
import { insertAiMetadataSchema, updateAiMetadataSchema } from "@/database/schema/aiMetadata";
import { createId } from "@/database/helpers";

const validId = createId();

describe("insertSemesterSchema", () => {
  const valid = {
    name: "Semester 5",
    startDate: "2026-07-01",
    endDate: "2026-12-01",
    minimumAttendance: 75,
    currentWeek: 1,
    workingDays: 110,
  };

  it("accepts valid payload", () => {
    expect(insertSemesterSchema.safeParse(valid).success).toBe(true);
  });

  it("allows omitting id (repository generates it)", () => {
    const result = insertSemesterSchema.parse(valid);
    expect(result.id).toBeUndefined();
  });

  it("accepts explicit id", () => {
    const result = insertSemesterSchema.parse({ ...valid, id: validId });
    expect(result.id).toBe(validId);
  });

  it("rejects empty name", () => {
    expect(insertSemesterSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects invalid date format", () => {
    expect(insertSemesterSchema.safeParse({ ...valid, startDate: "07/01/2026" }).success).toBe(
      false,
    );
  });

  it("rejects minimumAttendance > 100", () => {
    expect(insertSemesterSchema.safeParse({ ...valid, minimumAttendance: 101 }).success).toBe(
      false,
    );
  });

  it("rejects negative currentWeek", () => {
    expect(insertSemesterSchema.safeParse({ ...valid, currentWeek: -1 }).success).toBe(false);
  });
});

describe("updateSemesterSchema", () => {
  it("accepts partial updates", () => {
    expect(updateSemesterSchema.safeParse({ name: "Updated" }).success).toBe(true);
  });

  it("rejects empty object", () => {
    expect(updateSemesterSchema.safeParse({}).success).toBe(false);
  });
});

describe("insertSubjectSchema", () => {
  const valid = {
    name: "Data Structures",
    code: "DSA501",
    faculty: "Prof. Sharma",
    color: "#4F46E5",
    credit: 4,
    minimumAttendance: 75,
    isLab: false,
    semesterId: validId,
  };

  it("accepts valid payload", () => {
    expect(insertSubjectSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid color", () => {
    expect(insertSubjectSchema.safeParse({ ...valid, color: "red" }).success).toBe(false);
  });

  it("rejects credit > 20", () => {
    expect(insertSubjectSchema.safeParse({ ...valid, credit: 21 }).success).toBe(false);
  });

  it("rejects invalid semesterId", () => {
    expect(insertSubjectSchema.safeParse({ ...valid, semesterId: "bad" }).success).toBe(false);
  });
});

describe("insertAttendanceRecordSchema", () => {
  const valid = {
    subjectId: validId,
    date: "2026-07-07",
    status: "present" as const,
    lectureNumber: 1,
  };

  it("accepts valid payload", () => {
    expect(insertAttendanceRecordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(insertAttendanceRecordSchema.safeParse({ ...valid, status: "maybe" }).success).toBe(
      false,
    );
  });

  it("accepts all valid statuses", () => {
    const statuses = [
      "present",
      "absent",
      "cancelled",
      "medical",
      "holiday",
      "extraLecture",
    ] as const;
    for (const status of statuses) {
      expect(insertAttendanceRecordSchema.safeParse({ ...valid, status }).success).toBe(true);
    }
  });

  it("allows null lectureSlotId", () => {
    expect(
      insertAttendanceRecordSchema.safeParse({
        ...valid,
        lectureSlotId: null,
      }).success,
    ).toBe(true);
  });
});

describe("insertLectureSlotSchema", () => {
  const valid = {
    semesterId: validId,
    day: "monday" as const,
    startTime: "09:00",
    endTime: "10:00",
  };

  it("accepts valid payload", () => {
    expect(insertLectureSlotSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid day", () => {
    expect(insertLectureSlotSchema.safeParse({ ...valid, day: "funday" }).success).toBe(false);
  });

  it("rejects invalid time format", () => {
    expect(insertLectureSlotSchema.safeParse({ ...valid, startTime: "9am" }).success).toBe(false);
  });
});

describe("insertTimetableEntrySchema", () => {
  const valid = {
    subjectId: validId,
    lectureSlotId: validId,
    lectureType: "lecture" as const,
  };

  it("accepts valid payload", () => {
    expect(insertTimetableEntrySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid lectureType", () => {
    expect(insertTimetableEntrySchema.safeParse({ ...valid, lectureType: "exam" }).success).toBe(
      false,
    );
  });
});

describe("insertGoalSchema", () => {
  const valid = {
    name: "Maintain 80%",
    goalType: "attendance" as const,
    scope: "semester" as const,
    targetAttendance: 80,
    isActive: true,
  };

  it("accepts valid payload", () => {
    expect(insertGoalSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects targetAttendance > 100", () => {
    expect(insertGoalSchema.safeParse({ ...valid, targetAttendance: 101 }).success).toBe(false);
  });

  it("accepts all scopes", () => {
    for (const scope of ["overall", "semester", "subject"] as const) {
      expect(insertGoalSchema.safeParse({ ...valid, scope }).success).toBe(true);
    }
  });
});

describe("insertSettingsSchema", () => {
  const valid = {
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

  it("accepts valid payload", () => {
    expect(insertSettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid theme in nested preference", () => {
    expect(
      insertSettingsSchema.safeParse({
        ...valid,
        themePreference: { ...valid.themePreference, theme: "neon" },
      }).success,
    ).toBe(false);
  });

  it("rejects reminderLeadMinutes > 1440", () => {
    expect(
      insertSettingsSchema.safeParse({
        ...valid,
        notificationPreference: {
          ...valid.notificationPreference,
          reminderLeadMinutes: 1441,
        },
      }).success,
    ).toBe(false);
  });
});

describe("insertThemePreferenceSchema", () => {
  it("accepts all theme values", () => {
    for (const theme of ["light", "dark", "amoled", "system"] as const) {
      expect(
        insertThemePreferenceSchema.safeParse({
          theme,
          followSystem: false,
          accentColor: "#000000",
        }).success,
      ).toBe(true);
    }
  });
});

describe("insertNotificationPreferenceSchema", () => {
  it("accepts valid payload", () => {
    expect(
      insertNotificationPreferenceSchema.safeParse({
        enabled: true,
        attendanceRemindersEnabled: true,
        lowAttendanceAlertsEnabled: false,
        dailySummaryEnabled: false,
        reminderLeadMinutes: 30,
      }).success,
    ).toBe(true);
  });
});

describe("insertAppPreferenceSchema", () => {
  it("accepts valid payload", () => {
    expect(
      insertAppPreferenceSchema.safeParse({
        language: "en",
        hapticsEnabled: true,
        analyticsOptIn: false,
        reducedMotion: false,
      }).success,
    ).toBe(true);
  });

  it("rejects invalid language", () => {
    expect(
      insertAppPreferenceSchema.safeParse({
        language: "fr",
        hapticsEnabled: true,
        analyticsOptIn: false,
        reducedMotion: false,
      }).success,
    ).toBe(false);
  });
});

describe("insertAiMetadataSchema", () => {
  const valid = {
    namespace: "prediction",
    key: "risk_score",
    value: "0.42",
  };

  it("accepts valid payload", () => {
    expect(insertAiMetadataSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional semesterId and subjectId", () => {
    expect(
      insertAiMetadataSchema.safeParse({
        ...valid,
        semesterId: validId,
        subjectId: validId,
      }).success,
    ).toBe(true);
  });

  it("rejects empty namespace", () => {
    expect(insertAiMetadataSchema.safeParse({ ...valid, namespace: "" }).success).toBe(false);
  });
});

describe("update schemas", () => {
  it("updateSubjectSchema accepts partial", () => {
    expect(updateSubjectSchema.safeParse({ name: "New Name" }).success).toBe(true);
  });

  it("updateAttendanceRecordSchema accepts partial", () => {
    expect(updateAttendanceRecordSchema.safeParse({ status: "absent" }).success).toBe(true);
  });

  it("updateLectureSlotSchema accepts partial", () => {
    expect(updateLectureSlotSchema.safeParse({ startTime: "10:00" }).success).toBe(true);
  });

  it("updateTimetableEntrySchema accepts partial", () => {
    expect(updateTimetableEntrySchema.safeParse({ room: "301" }).success).toBe(true);
  });

  it("updateGoalSchema accepts partial", () => {
    expect(updateGoalSchema.safeParse({ isActive: false }).success).toBe(true);
  });

  it("updateAiMetadataSchema accepts partial", () => {
    expect(updateAiMetadataSchema.safeParse({ value: "updated" }).success).toBe(true);
  });

  it("updateSettingsSchema accepts partial", () => {
    expect(updateSettingsSchema.safeParse({ targetAttendance: 90 }).success).toBe(true);
  });
});
