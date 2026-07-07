import { DECIMAL_PRECISION, PERCENTAGE_MULTIPLIER } from "../constants";

export function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  const result = numerator / denominator;
  return Number.isFinite(result) ? result : 0;
}

export function calculatePercentage(part: number, total: number): number {
  return safeDivide(part, total) * PERCENTAGE_MULTIPLIER;
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function sum(values: readonly number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

export function countBy(values: readonly string[], target: string): number {
  return values.filter((v) => v === target).length;
}

export function countStatuses(statuses: readonly string[], targets: readonly string[]): number {
  return statuses.filter((s) => targets.includes(s)).length;
}

export function max(a: number, b: number): number {
  return a > b ? a : b;
}

export function min(a: number, b: number): number {
  return a < b ? a : b;
}

export function abs(value: number): number {
  return value < 0 ? -value : value;
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function roundToDefault(value: number): number {
  return roundTo(value, DECIMAL_PRECISION);
}

export function floorTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.floor(value * factor) / factor;
}

export function ceilTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.ceil(value * factor) / factor;
}

export function isNonNegative(value: number): boolean {
  return value >= 0 && Number.isFinite(value);
}

export function isPercentage(value: number): boolean {
  return value >= 0 && value <= PERCENTAGE_MULTIPLIER && Number.isFinite(value);
}

export function isValidCount(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && Number.isFinite(value);
}
