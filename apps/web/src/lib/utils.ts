import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", options ?? { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = date.getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (Math.abs(days) < 1) {
    const hours = Math.round(diff / 3_600_000);
    if (Math.abs(hours) < 1) return "now";
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(hours, "hour");
  }
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(days, "day");
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
