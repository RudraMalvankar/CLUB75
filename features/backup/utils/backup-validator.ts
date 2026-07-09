import type { BackupData, BackupMetadata, BackupValidationError } from "../types";

export function validateBackupStructure(data: unknown): BackupValidationError | null {
  if (!data || typeof data !== "object") {
    return { code: "INVALID_JSON", message: "Invalid backup file format" };
  }

  const backup = data as Record<string, unknown>;

  const requiredFields = [
    "metadata",
    "semesters",
    "subjects",
    "attendance",
    "timetable",
    "lectureSlots",
    "goals",
    "settings",
    "aiMetadata",
  ];

  for (const field of requiredFields) {
    if (!(field in backup)) {
      return {
        code: "MISSING_TABLES",
        message: `Backup is missing required field: ${field}`,
        field,
      };
    }
  }

  return null;
}

export function validateMetadata(metadata: unknown): BackupValidationError | null {
  if (!metadata || typeof metadata !== "object") {
    return { code: "MISSING_METADATA", message: "Backup metadata is missing" };
  }

  const meta = metadata as Record<string, unknown>;

  const requiredFields = ["version", "appVersion", "createdAt", "recordCounts"];
  for (const field of requiredFields) {
    if (!(field in meta)) {
      return {
        code: "MISSING_METADATA",
        message: `Metadata is missing required field: ${field}`,
        field,
      };
    }
  }

  return null;
}

export function formatBackupSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRecordCount(count: number): string {
  return count.toLocaleString();
}

export function generateBackupName(metadata: BackupMetadata): string {
  const date = new Date(metadata.createdAt);
  const dateStr = date.toISOString().split("T")[0];
  const timeStr = date.toTimeString().split(" ")[0].replace(/:/g, "");
  return `Club75_Backup_${dateStr}_${timeStr}`;
}

export function calculateTotalRecords(metadata: BackupMetadata): number {
  const counts = metadata.recordCounts;
  return (
    counts.semesters +
    counts.subjects +
    counts.attendance +
    counts.timetable +
    counts.lectureSlots +
    counts.goals +
    counts.settings +
    counts.preferences +
    counts.aiMetadata
  );
}

export function isBackupData(data: unknown): data is BackupData {
  if (!data || typeof data !== "object") return false;
  const backup = data as Record<string, unknown>;
  return (
    "metadata" in backup && "semesters" in backup && "subjects" in backup && "attendance" in backup
  );
}
