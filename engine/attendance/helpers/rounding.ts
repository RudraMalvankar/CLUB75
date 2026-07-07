import { DECIMAL_PRECISION, PERCENTAGE_MULTIPLIER } from "../constants";

export function roundPercentage(value: number): number {
  return Math.round(value * DECIMAL_PRECISION * 10) / (DECIMAL_PRECISION * 10);
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatPercentage(value: number): string {
  return `${roundToTwoDecimals(value)}%`;
}

export function ceilPercentage(value: number): number {
  return Math.ceil(value * PERCENTAGE_MULTIPLIER) / PERCENTAGE_MULTIPLIER;
}

export function floorPercentage(value: number): number {
  return Math.floor(value * PERCENTAGE_MULTIPLIER) / PERCENTAGE_MULTIPLIER;
}

export function roundUpToNearestInteger(value: number): number {
  return Math.ceil(value);
}

export function roundDownToNearestInteger(value: number): number {
  return Math.floor(value);
}
