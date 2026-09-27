import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Only allow same-site relative redirects ("/foo"), never "//evil.com" or absolute URLs. */
export function safeNextPath(next: string | null | undefined, fallback = "/") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}

export function formatUsd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatUsdRange(low: number, high: number) {
  if (Math.round(low) === Math.round(high)) return formatUsd(low);
  return `${formatUsd(low)}–${formatUsd(high)}`;
}
