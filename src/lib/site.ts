/**
 * Public facts about the site, shared by metadata, structured data, the
 * sitemap and llms.txt so every surface describes Home Doctor the same way.
 */
export const SITE = {
  name: "Home Doctor",
  tagline: "Point your phone at the problem. Know what's wrong in 30 seconds.",
  /** One-sentence entity description. Search engines and AI answers quote this. */
  description:
    "Home Doctor is a web app that diagnoses household problems from a photo: what it is, how urgent it is, whether you can fix it yourself, what parts to buy, and what a pro should charge.",
  shortDescription:
    "Snap a photo of a leak, crack, noise or dead outlet. Get the likely cause, how urgent it is, DIY steps with parts and prices, and a fair price range for a pro.",
  locale: "en_US",
  themeColor: "#f4f2ec",
  brandColor: "#1d4ed8",
} as const;

/**
 * The canonical origin (no trailing slash). Previews point canonicals at
 * production so they never compete with it in search.
 */
export function canonicalOrigin(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${canonicalOrigin()}${path === "/" ? "" : path}`;
}

/** Only production gets indexed; previews and local dev stay out of search. */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
}

/** Paths that are per-user, transactional or internal. Never indexed. */
export const PRIVATE_PATHS = ["/api/", "/auth/", "/d/", "/q/", "/history", "/login", "/dev/", "/templates"];
