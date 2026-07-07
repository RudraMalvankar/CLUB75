import {
  AiMetadataRepository,
  AttendanceRepository,
  GoalRepository,
  LectureRepository,
  SemesterRepository,
  SettingsRepository,
  SubjectRepository,
  TimetableRepository,
} from "@/database/repositories";
import { initializeDatabase } from "@/database/database";
import { SeedError } from "@/database/errors";
import { ATTENDANCE_STATUS_VALUES, createId } from "@/database/helpers";

function createDateRange(days: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let index = days; index > 0; index -= 1) {
    const value = new Date(today);
    value.setDate(today.getDate() - index);
    dates.push(value.toISOString().slice(0, 10));
  }
  return dates;
}

export async function seedDevelopmentData() {
  const db = await initializeDatabase();

  const semesterRepository = new SemesterRepository(db);
  const subjectRepository = new SubjectRepository(db);
  const lectureRepository = new LectureRepository(db);
  const timetableRepository = new TimetableRepository(db);
  const attendanceRepository = new AttendanceRepository(db);
  const goalRepository = new GoalRepository(db);
  const settingsRepository = new SettingsRepository(db);
  const aiMetadataRepository = new AiMetadataRepository(db);

  try {
    const existingSemesters = await semesterRepository.getAll({ limit: 1 });
    if (existingSemesters.length > 0) {
      return { seeded: false, reason: "Database already contains seedable data" };
    }

    const semester = await semesterRepository.insert({
      id: createId(),
      name: "Semester 5",
      startDate: "2026-07-01",
      endDate: "2026-12-01",
      minimumAttendance: 75,
      currentWeek: 4,
      workingDays: 110,
    });

    const subjectData = [
      {
        name: "Data Structures",
        code: "DSA501",
        faculty: "Prof. Sharma",
        color: "#4F46E5",
        credit: 4,
        minimumAttendance: 75,
        isLab: false,
      },
      {
        name: "Operating Systems",
        code: "OS503",
        faculty: "Prof. Nair",
        color: "#0EA5E9",
        credit: 4,
        minimumAttendance: 75,
        isLab: false,
      },
      {
        name: "Database Systems",
        code: "DBMS505",
        faculty: "Prof. Iyer",
        color: "#F97316",
        credit: 4,
        minimumAttendance: 75,
        isLab: false,
      },
      {
        name: "Computer Networks",
        code: "CN507",
        faculty: "Prof. Gupta",
        color: "#22C55E",
        credit: 4,
        minimumAttendance: 75,
        isLab: false,
      },
      {
        name: "Android Lab",
        code: "ADL509",
        faculty: "Prof. Rao",
        color: "#E11D48",
        credit: 2,
        minimumAttendance: 80,
        isLab: true,
      },
      {
        name: "Analytics Lab",
        code: "ANL511",
        faculty: "Prof. Menon",
        color: "#A855F7",
        credit: 2,
        minimumAttendance: 80,
        isLab: true,
      },
    ];

    const subjects = [];
    for (const item of subjectData) {
      subjects.push(
        await subjectRepository.insert({
          id: createId(),
          semesterId: semester.id,
          ...item,
        }),
      );
    }

    const slotBlueprints = [
      { day: "monday", startTime: "09:00", endTime: "10:00", label: "L1" },
      { day: "monday", startTime: "10:15", endTime: "11:15", label: "L2" },
      { day: "tuesday", startTime: "09:00", endTime: "10:00", label: "L1" },
      { day: "tuesday", startTime: "10:15", endTime: "11:15", label: "L2" },
      { day: "wednesday", startTime: "13:00", endTime: "15:00", label: "Lab A" },
      { day: "thursday", startTime: "09:00", endTime: "10:00", label: "L1" },
      { day: "friday", startTime: "11:30", endTime: "13:30", label: "Lab B" },
      { day: "saturday", startTime: "09:30", endTime: "10:30", label: "Revision" },
    ] as const;

    const lectureSlots = [];
    for (const slot of slotBlueprints) {
      lectureSlots.push(
        await lectureRepository.insert({
          id: createId(),
          semesterId: semester.id,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          label: slot.label,
        }),
      );
    }

    const timetableMap = [
      { subjectIndex: 0, slotIndex: 0, room: "402", lectureType: "lecture" },
      { subjectIndex: 1, slotIndex: 1, room: "307", lectureType: "theory" },
      { subjectIndex: 2, slotIndex: 2, room: "405", lectureType: "lecture" },
      { subjectIndex: 3, slotIndex: 3, room: "210", lectureType: "lecture" },
      { subjectIndex: 4, slotIndex: 4, room: "Lab 3", lectureType: "lab" },
      { subjectIndex: 5, slotIndex: 6, room: "Lab 5", lectureType: "lab" },
      { subjectIndex: 0, slotIndex: 5, room: "402", lectureType: "tutorial" },
      { subjectIndex: 2, slotIndex: 7, room: "405", lectureType: "practical" },
    ] as const;

    const timetableEntries = [];
    for (const item of timetableMap) {
      timetableEntries.push(
        await timetableRepository.insert({
          id: createId(),
          subjectId: subjects[item.subjectIndex].id,
          lectureSlotId: lectureSlots[item.slotIndex].id,
          faculty: subjects[item.subjectIndex].faculty,
          room: item.room,
          lectureType: item.lectureType,
          notes: null,
        }),
      );
    }

    const lastMonth = createDateRange(30);
    for (const [index, date] of lastMonth.entries()) {
      for (const subject of subjects.slice(0, 4)) {
        const status = ATTENDANCE_STATUS_VALUES[(index + subject.name.length) % 5];
        await attendanceRepository.insert({
          id: createId(),
          subjectId: subject.id,
          date,
          status,
          lectureNumber: 1,
          notes: null,
        });
      }
    }

    await goalRepository.insert({
      id: createId(),
      name: "Maintain Semester Attendance",
      goalType: "attendance",
      scope: "semester",
      semesterId: semester.id,
      subjectId: null,
      targetAttendance: 80,
      isActive: true,
      notes: "Primary semester threshold",
    });

    await settingsRepository.upsert({
      id: createId(),
      defaultSemesterId: semester.id,
      targetAttendance: 80,
      themePreference: {
        id: createId(),
        theme: "system",
        followSystem: true,
        accentColor: "#4F46E5",
      },
      notificationPreference: {
        id: createId(),
        enabled: true,
        attendanceRemindersEnabled: true,
        lowAttendanceAlertsEnabled: true,
        dailySummaryEnabled: false,
        reminderLeadMinutes: 15,
      },
      appPreference: {
        id: createId(),
        language: "en",
        hapticsEnabled: true,
        analyticsOptIn: true,
        reducedMotion: false,
      },
    });

    await aiMetadataRepository.insert({
      id: createId(),
      semesterId: semester.id,
      subjectId: subjects[0].id,
      namespace: "seed",
      key: "cohort",
      value: JSON.stringify({
        source: "development-seed",
        timetableEntries: timetableEntries.length,
      }),
    });

    return {
      seeded: true,
      semesterId: semester.id,
      subjectCount: subjects.length,
      lectureSlotCount: lectureSlots.length,
      timetableEntryCount: timetableEntries.length,
      attendanceCount: lastMonth.length * 4,
    };
  } catch (error) {
    throw new SeedError("Failed to seed development data", error);
  }
}

if (process.argv[1]?.endsWith("index.ts")) {
  void seedDevelopmentData()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
