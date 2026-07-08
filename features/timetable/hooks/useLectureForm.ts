import { useCallback, useState } from "react";

import { getDatabase } from "@/database/database";
import { LectureRepository, TimetableRepository } from "@/database/repositories";
import type { LectureConflict, LectureFormData, TimetableLecture } from "../types";

type UseLectureFormResult = {
  readonly isSubmitting: boolean;
  readonly errors: string[];
  readonly conflicts: LectureConflict[];
  readonly validate: (data: LectureFormData) => boolean;
  readonly createLecture: (
    semesterId: string,
    data: LectureFormData,
  ) => Promise<TimetableLecture | null>;
  readonly updateLecture: (
    id: string,
    data: Partial<LectureFormData>,
  ) => Promise<TimetableLecture | null>;
  readonly deleteLecture: (id: string) => Promise<boolean>;
  readonly checkConflicts: (
    semesterId: string,
    data: LectureFormData,
    excludeId?: string,
  ) => Promise<LectureConflict[]>;
  readonly clearErrors: () => void;
};

export function useLectureForm(): UseLectureFormResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<LectureConflict[]>([]);

  const validate = useCallback((data: LectureFormData): boolean => {
    const newErrors: string[] = [];

    if (!data.subjectId) newErrors.push("Subject is required");
    if (!data.day) newErrors.push("Day is required");
    if (!data.startTime) newErrors.push("Start time is required");
    if (!data.endTime) newErrors.push("End time is required");

    if (data.startTime && data.endTime) {
      const start = parseTimeToMinutes(data.startTime);
      const end = parseTimeToMinutes(data.endTime);
      if (end <= start) {
        newErrors.push("End time must be after start time");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const checkConflicts = useCallback(
    async (
      semesterId: string,
      data: LectureFormData,
      excludeId?: string,
    ): Promise<LectureConflict[]> => {
      const db = getDatabase();
      const lectureRepo = new LectureRepository(db);
      const timetableRepo = new TimetableRepository(db);

      const existingSlots = await lectureRepo.findByDay(semesterId, data.day);
      const newConflicts: LectureConflict[] = [];

      for (const slot of existingSlots) {
        if (excludeId && slot.id === excludeId) continue;

        const entry = (await timetableRepo.findByLectureSlot(slot.id))[0];
        if (!entry) continue;

        const start1 = parseTimeToMinutes(data.startTime);
        const end1 = parseTimeToMinutes(data.endTime);
        const start2 = parseTimeToMinutes(slot.startTime);
        const end2 = parseTimeToMinutes(slot.endTime);

        if (start1 < end2 && start2 < end1) {
          newConflicts.push({
            type: "overlap",
            message: `Overlaps with lecture at ${slot.startTime} - ${slot.endTime}`,
            conflictingLectureId: entry.id,
          });
        }
      }

      setConflicts(newConflicts);
      return newConflicts;
    },
    [],
  );

  const createLecture = useCallback(
    async (semesterId: string, data: LectureFormData): Promise<TimetableLecture | null> => {
      if (!validate(data)) return null;

      setIsSubmitting(true);
      setErrors([]);

      try {
        const db = getDatabase();
        const lectureRepo = new LectureRepository(db);
        const timetableRepo = new TimetableRepository(db);

        const slot = await lectureRepo.insert({
          semesterId,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime,
        });

        const entry = await timetableRepo.insert({
          subjectId: data.subjectId,
          lectureSlotId: slot.id,
          room: data.room || null,
          faculty: data.faculty || null,
          lectureType: data.lectureType,
          notes: data.notes || null,
        });

        const subject = await (
          await import("@/database/repositories")
        ).SubjectRepository.prototype.getById.call({ db } as any, data.subjectId);

        return {
          id: entry.id,
          subjectId: data.subjectId,
          subjectName: subject?.name ?? "",
          subjectCode: subject?.code ?? "",
          subjectColor: subject?.color ?? "#000000",
          faculty: data.faculty || null,
          room: data.room || null,
          lectureType: data.lectureType,
          startTime: data.startTime,
          endTime: data.endTime,
          day: data.day,
          duration: parseTimeToMinutes(data.endTime) - parseTimeToMinutes(data.startTime),
          isCurrent: false,
          isNext: false,
          attendancePercentage: null,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create lecture";
        setErrors([message]);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate],
  );

  const updateLecture = useCallback(
    async (id: string, data: Partial<LectureFormData>): Promise<TimetableLecture | null> => {
      setIsSubmitting(true);
      setErrors([]);

      try {
        const db = getDatabase();
        const timetableRepo = new TimetableRepository(db);
        const lectureRepo = new LectureRepository(db);

        const existing = await timetableRepo.getById(id);
        if (!existing) {
          setErrors(["Lecture not found"]);
          return null;
        }

        const slot = await lectureRepo.getById(existing.lectureSlotId);
        if (!slot) {
          setErrors(["Lecture slot not found"]);
          return null;
        }

        if (data.startTime || data.endTime) {
          const startTime = data.startTime ?? slot.startTime;
          const endTime = data.endTime ?? slot.endTime;

          if (parseTimeToMinutes(endTime) <= parseTimeToMinutes(startTime)) {
            setErrors(["End time must be after start time"]);
            return null;
          }

          await lectureRepo.update(slot.id, { startTime, endTime });
        }

        await timetableRepo.update(id, {
          subjectId: data.subjectId,
          room: data.room,
          faculty: data.faculty,
          lectureType: data.lectureType,
          notes: data.notes,
        });

        const updated = await timetableRepo.getById(id);
        if (!updated) return null;

        const updatedSlot = await lectureRepo.getById(updated.lectureSlotId);
        const subject = await (
          await import("@/database/repositories")
        ).SubjectRepository.prototype.getById.call({ db } as any, updated.subjectId);

        return {
          id: updated.id,
          subjectId: updated.subjectId,
          subjectName: subject?.name ?? "",
          subjectCode: subject?.code ?? "",
          subjectColor: subject?.color ?? "#000000",
          faculty: updated.faculty ?? null,
          room: updated.room ?? null,
          lectureType: updated.lectureType as TimetableLecture["lectureType"],
          startTime: updatedSlot?.startTime ?? slot.startTime,
          endTime: updatedSlot?.endTime ?? slot.endTime,
          day: (updatedSlot?.day ?? slot.day) as TimetableLecture["day"],
          duration: updatedSlot
            ? parseTimeToMinutes(updatedSlot.endTime) - parseTimeToMinutes(updatedSlot.startTime)
            : 0,
          isCurrent: false,
          isNext: false,
          attendancePercentage: null,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update lecture";
        setErrors([message]);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteLecture = useCallback(async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const db = getDatabase();
      const timetableRepo = new TimetableRepository(db);
      const lectureRepo = new LectureRepository(db);

      const entry = await timetableRepo.getById(id);
      if (!entry) {
        setErrors(["Lecture not found"]);
        return false;
      }

      await timetableRepo.delete(id);
      await lectureRepo.delete(entry.lectureSlotId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete lecture";
      setErrors([message]);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setConflicts([]);
  }, []);

  return {
    isSubmitting,
    errors,
    conflicts,
    validate,
    createLecture,
    updateLecture,
    deleteLecture,
    checkConflicts,
    clearErrors,
  };
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
