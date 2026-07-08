import { getDatabase } from "@/database/database";
import { LectureRepository, SubjectRepository, TimetableRepository } from "@/database/repositories";
import type {
  LectureConflict,
  TimetableDay,
  TimetableLecture,
  TimetableFilters,
  TimetableStats,
} from "../types";
import { ALL_DAYS, DAY_LABELS } from "../types";

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function calculateDuration(startTime: string, endTime: string): number {
  return parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
}

function isTimeOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = parseTimeToMinutes(start1);
  const e1 = parseTimeToMinutes(end1);
  const s2 = parseTimeToMinutes(start2);
  const e2 = parseTimeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getCurrentDay(): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
}

export class TimetableService {
  private timetableRepo: TimetableRepository;
  private lectureRepo: LectureRepository;
  private subjectRepo: SubjectRepository;

  constructor() {
    const db = getDatabase();
    this.timetableRepo = new TimetableRepository(db);
    this.lectureRepo = new LectureRepository(db);
    this.subjectRepo = new SubjectRepository(db);
  }

  async getAllLectures(semesterId: string): Promise<TimetableDay[]> {
    const [slots, timetableEntries, subjects] = await Promise.all([
      this.lectureRepo.getBySemester(semesterId),
      this.timetableRepo.getAll(),
      this.subjectRepo.getBySemester(semesterId),
    ]);

    const subjectMap = new Map(subjects.map((s) => [s.id, s]));
    const currentTime = getCurrentTime();
    const currentDay = getCurrentDay();

    const lecturesByDay = new Map<string, TimetableLecture[]>();

    for (const slot of slots) {
      const entry = timetableEntries.find((e) => e.lectureSlotId === slot.id);
      if (!entry) continue;

      const subject = subjectMap.get(entry.subjectId);
      if (!subject) continue;

      const isCurrent =
        slot.day === currentDay &&
        isTimeOverlapping(slot.startTime, slot.endTime, currentTime, currentTime);

      const isNext =
        slot.day === currentDay &&
        parseTimeToMinutes(slot.startTime) > parseTimeToMinutes(currentTime) &&
        !isCurrent;

      const lecture: TimetableLecture = {
        id: entry.id,
        subjectId: entry.subjectId,
        subjectName: subject.name,
        subjectCode: subject.code,
        subjectColor: subject.color,
        faculty: entry.faculty ?? subject.faculty,
        room: entry.room,
        lectureType: entry.lectureType as TimetableLecture["lectureType"],
        startTime: slot.startTime,
        endTime: slot.endTime,
        day: slot.day as TimetableLecture["day"],
        duration: calculateDuration(slot.startTime, slot.endTime),
        isCurrent,
        isNext,
        attendancePercentage: null,
      };

      const existing = lecturesByDay.get(slot.day) ?? [];
      existing.push(lecture);
      lecturesByDay.set(slot.day, existing);
    }

    for (const [day, lectures] of lecturesByDay) {
      void day;
      lectures.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
    }

    return ALL_DAYS.map((day) => ({
      day,
      label: DAY_LABELS[day],
      lectures: lecturesByDay.get(day) ?? [],
    }));
  }

  async getLecturesByDay(semesterId: string, day: string): Promise<TimetableLecture[]> {
    const days = await this.getAllLectures(semesterId);
    const dayData = days.find((d) => d.day === day);
    return dayData?.lectures ?? [];
  }

  async getLectureById(id: string): Promise<TimetableLecture | null> {
    const entry = await this.timetableRepo.getById(id);
    if (!entry) return null;

    const slot = await this.lectureRepo.getById(entry.lectureSlotId);
    if (!slot) return null;

    const subject = await this.subjectRepo.getById(entry.subjectId);
    if (!subject) return null;

    return {
      id: entry.id,
      subjectId: entry.subjectId,
      subjectName: subject.name,
      subjectCode: subject.code,
      subjectColor: subject.color,
      faculty: entry.faculty ?? subject.faculty,
      room: entry.room,
      lectureType: entry.lectureType as TimetableLecture["lectureType"],
      startTime: slot.startTime,
      endTime: slot.endTime,
      day: slot.day as TimetableLecture["day"],
      duration: calculateDuration(slot.startTime, slot.endTime),
      isCurrent: false,
      isNext: false,
      attendancePercentage: null,
    };
  }

  async detectConflicts(
    semesterId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeEntryId?: string,
  ): Promise<LectureConflict[]> {
    const conflicts: LectureConflict[] = [];
    const existingLectures = await this.getLecturesByDay(semesterId, day);

    for (const lecture of existingLectures) {
      if (excludeEntryId && lecture.id === excludeEntryId) continue;

      if (isTimeOverlapping(startTime, endTime, lecture.startTime, lecture.endTime)) {
        conflicts.push({
          type: "overlap",
          message: `Overlaps with ${lecture.subjectName} (${lecture.startTime} - ${lecture.endTime})`,
          conflictingLectureId: lecture.id,
        });
      }
    }

    return conflicts;
  }

  async searchLectures(semesterId: string, query: string): Promise<TimetableLecture[]> {
    const days = await this.getAllLectures(semesterId);
    const lowerQuery = query.toLowerCase();

    return days.flatMap((d) =>
      d.lectures.filter(
        (l) =>
          l.subjectName.toLowerCase().includes(lowerQuery) ||
          l.subjectCode.toLowerCase().includes(lowerQuery) ||
          l.faculty?.toLowerCase().includes(lowerQuery) ||
          l.room?.toLowerCase().includes(lowerQuery),
      ),
    );
  }

  filterLectures(lectures: TimetableLecture[], filters: TimetableFilters): TimetableLecture[] {
    return lectures.filter((lecture) => {
      if (filters.day && lecture.day !== filters.day) return false;
      if (filters.lectureType && lecture.lectureType !== filters.lectureType) return false;
      if (filters.subjectId && lecture.subjectId !== filters.subjectId) return false;
      if (filters.faculty && lecture.faculty?.toLowerCase() !== filters.faculty.toLowerCase())
        return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          lecture.subjectName.toLowerCase().includes(query) ||
          lecture.subjectCode.toLowerCase().includes(query) ||
          lecture.faculty?.toLowerCase().includes(query) ||
          lecture.room?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }

  getStats(days: TimetableDay[]): TimetableStats {
    const lecturesPerDay = {} as Record<string, number>;
    let totalLectures = 0;
    let totalDuration = 0;
    const subjectIds = new Set<string>();

    for (const day of days) {
      lecturesPerDay[day.day] = day.lectures.length;
      totalLectures += day.lectures.length;
      for (const lecture of day.lectures) {
        subjectIds.add(lecture.subjectId);
        totalDuration += lecture.duration;
      }
    }

    let busiestDay: string | null = null;
    let lightestDay: string | null = null;
    let maxLectures = 0;
    let minLectures = Infinity;

    for (const [day, count] of Object.entries(lecturesPerDay)) {
      if (count > maxLectures) {
        maxLectures = count;
        busiestDay = day;
      }
      if (count < minLectures && count > 0) {
        minLectures = count;
        lightestDay = day;
      }
    }

    return {
      totalSubjects: subjectIds.size,
      totalLecturesPerWeek: totalLectures,
      lecturesPerDay: lecturesPerDay as Record<string, number>,
      busiestDay: busiestDay as TimetableStats["busiestDay"],
      lightestDay: lightestDay as TimetableStats["lightestDay"],
      averageDuration: totalLectures > 0 ? Math.round(totalDuration / totalLectures) : 0,
    };
  }
}
