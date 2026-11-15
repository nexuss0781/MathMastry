const formatterCache = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  formatterCache.set(timeZone, created);
  return created;
}

/** Calendar date (`YYYY-MM-DD`) in an IANA timezone. */
export function localDay(date: Date, timeZone: string): string {
  const parts = formatter(timeZone).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "00";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function toUtcDate(day: string): Date {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, date ?? 1));
}

export function fromUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(day: string, amount: number): string {
  const date = toUtcDate(day);
  date.setUTCDate(date.getUTCDate() + amount);
  return fromUtcDate(date);
}

export function calendarDaysBetween(from: string, to: string): number {
  return Math.round((toUtcDate(to).getTime() - toUtcDate(from).getTime()) / 86_400_000);
}

/** ISO-8601 week key, e.g. `2026-W07`. */
export function isoWeekKey(day: string): string {
  const date = toUtcDate(day);
  const weekday = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - weekday);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Sunday of the week containing `day`. */
export function startOfWeek(day: string): string {
  const date = toUtcDate(day);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return fromUtcDate(date);
}
