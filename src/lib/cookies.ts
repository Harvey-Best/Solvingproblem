/** Shared cookie names/options. Safe to import from the proxy (no server-only deps). */

export const ANON_COOKIE = "hd_anon";
export const UTM_COOKIE = "hd_utm";
/** Set when this browser asks for a magic link; proves the link came back to the same browser. */
export const LOGIN_NONCE_COOKIE = "hd_login";

const ONE_YEAR = 60 * 60 * 24 * 365;
const NINETY_DAYS = 60 * 60 * 24 * 90;
const ONE_HOUR = 60 * 60;

export const anonCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR,
};

export const utmCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: NINETY_DAYS,
};

/** Magic links expire after an hour, so the nonce does too. */
export const loginNonceCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_HOUR,
};

/**
 * Supabase auth cookies: its defaults (path /, SameSite=Lax, 400 days) plus
 * Secure outside local dev, which @supabase/ssr doesn't set on its own.
 */
export const supabaseCookieOptions = { secure: process.env.NODE_ENV === "production" };
