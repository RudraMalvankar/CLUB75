export const DEFAULT_GOAL_PERCENTAGE = 75;
export const DEFAULT_MINIMUM_ATTENDANCE = 75;
export const MAXIMUM_ATTENDANCE_PERCENTAGE = 100;
export const MINIMUM_ATTENDANCE_PERCENTAGE = 0;

export const DECIMAL_PRECISION = 2;
export const PERCENTAGE_MULTIPLIER = 100;

export const STATUS_LEVEL_THRESHOLDS = {
  excellent: 90,
  good: 80,
  safe: 75,
  warning: 70,
} as const;

export const RISK_THRESHOLDS = {
  none: 90,
  low: 80,
  medium: 75,
  high: 70,
} as const;

export const COUNTED_STATUSES = ["present", "absent", "extraLecture"] as const;

export const UNCOUNTED_STATUSES = ["cancelled", "medical", "holiday"] as const;

export const ABSENT_STATUSES = ["absent"] as const;

export const PRESENT_STATUSES = ["present", "extraLecture"] as const;

export const PERFORMANCE_BUDGETS = {
  calculation: 1,
  prediction: 50,
  uiUpdate: 16,
} as const;
