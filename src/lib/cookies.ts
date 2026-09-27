/** Shared cookie names/options. Safe to import from the proxy (no server-only deps). */

export const ANON_COOKIE = "hd_anon";
export const UTM_COOKIE = "hd_utm";

const ONE_YEAR = 60 * 60 * 24 * 365;
const NINETY_DAYS = 60 * 60 * 24 * 90;

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
