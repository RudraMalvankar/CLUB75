export type BackupFormatVersion = "1.0";

export type BackupMetadata = {
  readonly version: BackupFormatVersion;
  readonly appVersion: string;
  readonly databaseVersion: number;
  readonly createdAt: number;
  readonly platform: string;
  readonly recordCounts: BackupRecordCounts;
  readonly fileSize: number;
  readonly checksum: string;
};

export type BackupRecordCounts = {
  readonly semesters: number;
  readonly subjects: number;
  readonly attendance: number;
  readonly timetable: number;
  readonly lectureSlots: number;
  readonly goals: number;
  readonly settings: number;
  readonly preferences: number;
  readonly aiMetadata: number;
};

export type BackupData = {
  readonly metadata: BackupMetadata;
  readonly semesters: readonly Record<string, unknown>[];
  readonly subjects: readonly Record<string, unknown>[];
  readonly attendance: readonly Record<string, unknown>[];
  readonly timetable: readonly Record<string, unknown>[];
  readonly lectureSlots: readonly Record<string, unknown>[];
  readonly goals: readonly Record<string, unknown>[];
  readonly settings: readonly Record<string, unknown>[];
  readonly preferences: readonly Record<string, unknown>[];
  readonly aiMetadata: readonly Record<string, unknown>[];
};

export type BackupHistoryItem = {
  readonly id: string;
  readonly name: string;
  readonly metadata: BackupMetadata;
  readonly filePath: string;
  readonly createdAt: number;
};

export type BackupValidationError = {
  readonly code: BackupValidationErrorCode;
  readonly message: string;
  readonly field?: string;
};

export type BackupValidationErrorCode =
  | "INVALID_JSON"
  | "MISSING_METADATA"
  | "MISSING_TABLES"
  | "INVALID_VERSION"
  | "CORRUPTED_DATA"
  | "INVALID_SCHEMA"
  | "CHECKSUM_MISMATCH"
  | "FILE_TOO_LARGE"
  | "EMPTY_BACKUP";

export type BackupResult = {
  readonly success: boolean;
  readonly metadata?: BackupMetadata;
  readonly error?: BackupValidationError;
};

export type RestoreResult = {
  readonly success: boolean;
  readonly recordsRestored: number;
  readonly error?: BackupValidationError;
};

export type ResetResult = {
  readonly success: boolean;
  readonly error?: string;
};

export const BACKUP_FORMAT_VERSION: BackupFormatVersion = "1.0";
export const APP_VERSION = "1.0.0";
export const DATABASE_VERSION = 1;
export const MAX_BACKUP_SIZE = 50 * 1024 * 1024; // 50MB
export const REQUIRED_TABLES = [
  "semesters",
  "subjects",
  "attendance",
  "timetable",
  "lectureSlots",
  "goals",
  "settings",
  "preferences",
  "aiMetadata",
] as const;
