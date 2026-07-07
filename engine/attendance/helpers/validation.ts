import type { AttendanceStatus } from "../types/enums";
import { AttendanceStatusValues } from "../types/enums";
import { isPercentage, isValidCount } from "./math";

export class EngineValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
  ) {
    super(message);
    this.name = "EngineValidationError";
  }
}

export function validatePositiveInteger(value: number, fieldName: string): void {
  if (!isValidCount(value)) {
    throw new EngineValidationError(
      `${fieldName} must be a non-negative integer`,
      fieldName,
      value,
    );
  }
}

export function validatePercentage(value: number, fieldName: string): void {
  if (!isPercentage(value)) {
    throw new EngineValidationError(`${fieldName} must be between 0 and 100`, fieldName, value);
  }
}

export function validateNonEmptyArray<T>(array: readonly T[], fieldName: string): void {
  if (!Array.isArray(array) || array.length === 0) {
    throw new EngineValidationError(`${fieldName} must be a non-empty array`, fieldName, array);
  }
}

export function validateAttendanceStatus(status: string, fieldName: string): void {
  if (!AttendanceStatusValues.includes(status as AttendanceStatus)) {
    throw new EngineValidationError(
      `${fieldName} must be a valid attendance status`,
      fieldName,
      status,
    );
  }
}

export function validateDateString(dateString: string, fieldName: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new EngineValidationError(
      `${fieldName} must be a valid date string (YYYY-MM-DD)`,
      fieldName,
      dateString,
    );
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new EngineValidationError(`${fieldName} must be a valid date`, fieldName, dateString);
  }
}

export function guardNaN(value: number, context: string): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new EngineValidationError(
      `${context} produced an invalid result: ${value}`,
      context,
      value,
    );
  }
  return value;
}

export function safeNumber(value: number, fallback: number = 0): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }
  return value;
}
