import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get current Date object representing Asia/Jakarta (WIB - UTC+7) time for direct database storage
 */
export function getWIBDate(): Date {
  return new Date(Date.now() + 7 * 3600000);
}

/**
 * Format any date object or string into Waktu Indonesia Barat (WIB - UTC+7) format
 */
export function formatWIB(
  date: Date | string | number | null | undefined,
  format: "full" | "date" | "time" | "datetime" = "datetime"
): string {
  if (!date) return "-";
  const d =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  if (isNaN(d.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
  };

  if (format === "date") {
    return new Intl.DateTimeFormat("id-ID", {
      ...options,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  }

  if (format === "time") {
    return (
      new Intl.DateTimeFormat("id-ID", {
        ...options,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d) + " WIB"
    );
  }

  if (format === "full") {
    return (
      new Intl.DateTimeFormat("id-ID", {
        ...options,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d) + " WIB"
    );
  }

  return (
    new Intl.DateTimeFormat("id-ID", {
      ...options,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d) + " WIB"
  );
}
