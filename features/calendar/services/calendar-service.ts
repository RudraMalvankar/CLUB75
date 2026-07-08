import { AttendanceRepository } from "@/database/repositories/attendance.repository";
import { TimetableRepository } from "@/database/repositories/timetable.repository";
import { SemesterRepository } from "@/database/repositories/semester.repository";
import { SubjectRepository } from "@/database/repositories/subject.repository";
import { getDatabase } from "@/database/database";
import type {
  CalendarEvent,
  CalendarFilter,
  AttendanceSummary,
  AgendaItem,
  CalendarMonthSummary,
  CalendarWeekSummary,
  CalendarEventStatus,
} from "../types";
import { CALENDAR_EVENT_COLORS } from "../types";

export class CalendarService {
  private attendanceRepo: AttendanceRepository;
  private timetableRepo: TimetableRepository;
  private semesterRepo: SemesterRepository;
  private subjectRepo: SubjectRepository;

  constructor() {
    const db = getDatabase();
    this.attendanceRepo = new AttendanceRepository(db);
    this.timetableRepo = new TimetableRepository(db);
    this.semesterRepo = new SemesterRepository(db);
    this.subjectRepo = new SubjectRepository(db);
  }

  async getMonthEvents(
    year: number,
    month: number,
    filter?: CalendarFilter,
  ): Promise<CalendarEvent[]> {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const [attendanceRecords, subjects] = await Promise.all([
      this.attendanceRepo.getByDateRange(startDate, endDate),
      this.subjectRepo.getAll(),
    ]);

    const events: CalendarEvent[] = [];

    for (const record of attendanceRecords) {
      const subject = subjects.find((s) => s.id === record.subjectId);
      events.push({
        id: record.id,
        type: record.status === "extraLecture" ? "lecture" : "lecture",
        title: subject?.name ?? "Unknown Subject",
        subjectId: record.subjectId,
        subjectName: subject?.name ?? null,
        subjectColor: subject?.color ?? null,
        date: record.date,
        startTime: null,
        endTime: null,
        room: null,
        faculty: subject?.faculty ?? null,
        lectureType: "lecture",
        status: record.status as CalendarEventStatus,
        notes: record.notes,
        attendanceId: record.id,
        timetableEntryId: record.timetableEntryId,
        lectureSlotId: record.lectureSlotId,
      });
    }

    return events;
  }

  async getDayEvents(date: string, filter?: CalendarFilter): Promise<CalendarEvent[]> {
    const attendanceRecords = await this.attendanceRepo.getByDateRange(date, date);
    const subjects = await this.subjectRepo.getAll();
    const events: CalendarEvent[] = [];

    for (const record of attendanceRecords) {
      const subject = subjects.find((s) => s.id === record.subjectId);
      events.push({
        id: record.id,
        type: "lecture",
        title: subject?.name ?? "Unknown Subject",
        subjectId: record.subjectId,
        subjectName: subject?.name ?? null,
        subjectColor: subject?.color ?? null,
        date: record.date,
        startTime: null,
        endTime: null,
        room: null,
        faculty: subject?.faculty ?? null,
        lectureType: "lecture",
        status: record.status as CalendarEventStatus,
        notes: record.notes,
        attendanceId: record.id,
        timetableEntryId: record.timetableEntryId,
        lectureSlotId: record.lectureSlotId,
      });
    }

    return events;
  }

  async getWeekEvents(
    startDate: string,
    endDate: string,
    filter?: CalendarFilter,
  ): Promise<CalendarEvent[]> {
    return this.getMonthEvents(
      new Date(startDate).getFullYear(),
      new Date(startDate).getMonth(),
      filter,
    );
  }

  async getAgendaEvents(startDate: string, days: number = 14): Promise<AgendaItem[]> {
    const events = await this.getMonthEvents(
      new Date(startDate).getFullYear(),
      new Date(startDate).getMonth(),
    );

    const agendaMap = new Map<string, CalendarEvent[]>();
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      agendaMap.set(dateStr, []);
    }

    for (const event of events) {
      if (agendaMap.has(event.date)) {
        agendaMap.get(event.date)!.push(event);
      }
    }

    const agenda: AgendaItem[] = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayEvents = agendaMap.get(dateStr) ?? [];
      const summary = await this.getAttendanceSummary(dateStr);
      agenda.push({ date: dateStr, events: dayEvents, summary });
    }

    return agenda;
  }

  async getAttendanceSummary(date: string): Promise<AttendanceSummary | null> {
    const records = await this.attendanceRepo.getByDateRange(date, date);
    if (records.length === 0) return null;

    const present = records.filter((r) => r.status === "present").length;
    const extraLecture = records.filter((r) => r.status === "extraLecture").length;
    const cancelled = records.filter((r) => r.status === "cancelled").length;
    const holiday = records.filter((r) => r.status === "holiday").length;

    const attended = present + extraLecture;
    const total = records.length - cancelled - holiday;
    const attendancePercentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    const summary: AttendanceSummary = {
      date,
      totalLectures: records.length,
      present,
      absent: records.filter((r) => r.status === "absent").length,
      cancelled,
      medical: records.filter((r) => r.status === "medical").length,
      holiday,
      extraLecture,
      attendancePercentage,
    };

    return summary;
  }

  async getMonthSummary(year: number, month: number): Promise<CalendarMonthSummary> {
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const records = await this.attendanceRepo.getByDateRange(startDate, endDate);
    const totalLectures = records.length;
    const totalPresent = records.filter((r) => r.status === "present").length;
    const totalAbsent = records.filter((r) => r.status === "absent").length;
    const totalCancelled = records.filter((r) => r.status === "cancelled").length;
    const totalMedical = records.filter((r) => r.status === "medical").length;
    const totalHoliday = records.filter((r) => r.status === "holiday").length;

    const attended = totalPresent;
    const total = totalLectures - totalCancelled - totalHoliday;
    const attendancePercentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    const uniqueDates = new Set(records.map((r) => r.date));

    return {
      year,
      month,
      totalLectures,
      totalPresent,
      totalAbsent,
      totalCancelled,
      totalMedical,
      totalHoliday,
      attendancePercentage,
      workingDays: uniqueDates.size,
    };
  }

  async getWeekSummary(startDate: string, endDate: string): Promise<CalendarWeekSummary> {
    const records = await this.attendanceRepo.getByDateRange(startDate, endDate);
    const totalLectures = records.length;
    const totalPresent = records.filter((r) => r.status === "present").length;
    const totalAbsent = records.filter((r) => r.status === "absent").length;

    const attended = totalPresent;
    const total = totalLectures;
    const attendancePercentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    const dayStats = new Map<string, { present: number; absent: number }>();
    for (const record of records) {
      const existing = dayStats.get(record.date) ?? { present: 0, absent: 0 };
      if (record.status === "present") existing.present++;
      if (record.status === "absent") existing.absent++;
      dayStats.set(record.date, existing);
    }

    let bestDay: string | null = null;
    let worstDay: string | null = null;
    let bestPercentage = -1;
    let worstPercentage = 101;

    for (const [date, stats] of dayStats) {
      const total = stats.present + stats.absent;
      const percentage = total > 0 ? Math.round((stats.present / total) * 100) : 0;
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestDay = date;
      }
      if (percentage < worstPercentage && total > 0) {
        worstPercentage = percentage;
        worstDay = date;
      }
    }

    return {
      startDate,
      endDate,
      totalLectures,
      totalPresent,
      totalAbsent,
      attendancePercentage,
      bestDay,
      worstDay,
    };
  }

  getEventColor(event: CalendarEvent): string {
    if (event.status === "present") return CALENDAR_EVENT_COLORS.present;
    if (event.status === "absent") return CALENDAR_EVENT_COLORS.absent;
    if (event.status === "cancelled") return CALENDAR_EVENT_COLORS.cancelled;
    if (event.status === "medical") return CALENDAR_EVENT_COLORS.medical;
    if (event.status === "holiday") return CALENDAR_EVENT_COLORS.holiday;
    if (event.status === "extraLecture") return CALENDAR_EVENT_COLORS.extraLecture;
    if (event.type === "exam") return CALENDAR_EVENT_COLORS.exam;
    if (event.type === "assignment") return CALENDAR_EVENT_COLORS.assignment;
    return CALENDAR_EVENT_COLORS.lecture;
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  getMonthName(month: number): string {
    const names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return names[month];
  }

  getDayName(day: number): string {
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return names[day];
  }

  formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  isSameDay(date1: string, date2: string): boolean {
    return date1 === date2;
  }

  isToday(date: string): boolean {
    return date === this.formatDate(new Date());
  }

  addDays(date: string, days: number): string {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return this.formatDate(result);
  }

  subtractDays(date: string, days: number): string {
    return this.addDays(date, -days);
  }

  getWeekStart(date: string): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return this.formatDate(d);
  }

  getWeekEnd(date: string): string {
    const start = this.getWeekStart(date);
    return this.addDays(start, 6);
  }
}

let calendarServiceInstance: CalendarService | null = null;

export function getCalendarService(): CalendarService {
  if (!calendarServiceInstance) {
    calendarServiceInstance = new CalendarService();
  }
  return calendarServiceInstance;
}
