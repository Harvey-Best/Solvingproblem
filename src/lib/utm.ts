/**
 * First-touch attribution. The proxy stores this in a cookie the first time a
 * visitor arrives with campaign params; it's copied onto the user row at signup
 * and onto anonymous diagnoses so paid social can be attributed end to end.
 */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

// Click ids from the ad platforms we're likely to run (Meta, TikTok, Google, Reddit).
export const CLICK_ID_KEYS = ["fbclid", "ttclid", "gclid", "rdt_cid"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>> & {
  referrer?: string;
  landing_path?: string;
  captured_at?: string;
};

export function extractAttribution(
  url: URL,
  referrer: string | null
): Attribution | null {
  const out: Attribution = {};
  let found = false;
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = url.searchParams.get(key);
    if (value) {
      out[key] = value.slice(0, 200);
      found = true;
    }
  }
  if (!found) return null;
  if (referrer) {
    try {
      const ref = new URL(referrer);
      if (ref.host !== url.host) out.referrer = ref.origin + ref.pathname;
    } catch {
      // ignore malformed referrers
    }
  }
  out.landing_path = url.pathname;
  out.captured_at = new Date().toISOString();
  return out;
}

export function parseAttributionCookie(value: string | undefined): Attribution | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Attribution) : null;
  } catch {
    return null;
  }
}
