import type React from "react";

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

const SAFE_BASE = "https://home-doctor.invalid";

/**
 * Only allow same-site relative redirects ("/foo"), never "//evil.com" or
 * absolute URLs. Control characters and backslashes are rejected outright,
 * since browsers strip tabs and newlines ("/\t/evil.com" becomes "//evil.com")
 * and treat "\" like "/". The result is re-serialized through URL, so what we
 * redirect to is exactly what we checked.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/") {
  if (!next || !next.startsWith("/") || /[\u0000-\u001f\u007f\\]/.test(next)) return fallback;
  let url: URL;
  try {
    url = new URL(next, SAFE_BASE);
  } catch {
    return fallback;
  }
  if (url.origin !== SAFE_BASE) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function formatUsd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatUsdRange(low: number, high: number) {
  if (Math.round(low) === Math.round(high)) return formatUsd(low);
  return `${formatUsd(low)}–${formatUsd(high)}`;
}

/** Typed helper for passing CSS custom properties through a style prop. */
export function cssVars(vars: Record<`--${string}`, string | number>): React.CSSProperties {
  return vars as React.CSSProperties;
}
