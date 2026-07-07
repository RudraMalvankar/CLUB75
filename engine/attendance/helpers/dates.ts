export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function today(): string {
  return formatDate(new Date());
}

export function daysBetween(dateA: string, dateB: string): number {
  const a = parseDate(dateA);
  const b = parseDate(dateB);
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function addDays(dateString: string, days: number): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function subtractDays(dateString: string, days: number): string {
  return addDays(dateString, -days);
}

export function isDateInRange(dateString: string, startDate: string, endDate: string): boolean {
  const date = parseDate(dateString);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return date >= start && date <= end;
}

export function sortByDate(dates: readonly string[], order: "asc" | "desc" = "asc"): string[] {
  const sorted = [...dates].sort((a, b) => {
    const dateA = parseDate(a).getTime();
    const dateB = parseDate(b).getTime();
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
  return sorted;
}

export function getDayOfWeek(dateString: string): string {
  const date = parseDate(dateString);
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[date.getDay()];
}

export function isDateAfter(dateA: string, dateB: string): boolean {
  return parseDate(dateA).getTime() > parseDate(dateB).getTime();
}

export function isDateBefore(dateA: string, dateB: string): boolean {
  return parseDate(dateA).getTime() < parseDate(dateB).getTime();
}
