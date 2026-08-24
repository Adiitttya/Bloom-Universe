import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get current standard Date object for database storage
 */
export function getWIBDate(): Date {
  return new Date();
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
      second: "2-digit",
      hour12: false,
    }).format(d) + " WIB"
  );
}

/**
 * Validates that a URL uses a safe protocol (http or https only).
 * Prevents javascript: protocol XSS and other protocol-based attacks.
 * Returns true if the URL is valid and safe, or if the field is empty/optional.
 */
export function isValidExternalUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === "") return true; // Optional fields are allowed to be empty
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false; // Unparseable URLs are invalid
  }
}
