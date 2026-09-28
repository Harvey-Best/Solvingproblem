import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { GET as llmsTxt } from "@/app/llms.txt/route";
import { GUIDES } from "@/lib/guides";
import { LANDING_FAQS, faqPageJsonLd, pageMetadata } from "@/lib/seo";
import { PRIVATE_PATHS, absoluteUrl, canonicalOrigin, isIndexable } from "@/lib/site";

afterEach(() => vi.unstubAllEnvs());

describe("canonical origin", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, then the Vercel production domain", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://homedoctor.app/");
    expect(canonicalOrigin()).toBe("https://homedoctor.app");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "home-doctor-blue.vercel.app");
    expect(canonicalOrigin()).toBe("https://home-doctor-blue.vercel.app");
    expect(absoluteUrl("/guides")).toBe("https://home-doctor-blue.vercel.app/guides");
    expect(absoluteUrl("/")).toBe("https://home-doctor-blue.vercel.app");
  });
});

describe("robots", () => {
  it("blocks everything on previews", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isIndexable()).toBe(false);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("opens public pages to search and AI crawlers in production, never private ones", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://homedoctor.app");
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    expect(result.sitemap).toBe("https://homedoctor.app/sitemap.xml");
    for (const rule of rules) {
      expect(rule.allow).toBe("/");
      expect(rule.disallow).toEqual(PRIVATE_PATHS);
    }
    const agents = rules.flatMap((r) => r.userAgent);
    expect(agents).toEqual(expect.arrayContaining(["*", "GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]));
  });
});

describe("sitemap", () => {
  it("lists the public pages and every guide, and nothing private", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://homedoctor.app");
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain("https://homedoctor.app");
    expect(urls).toContain("https://homedoctor.app/diagnose");
    expect(urls).toContain("https://homedoctor.app/guides");
    expect(urls).toContain("https://homedoctor.app/privacy");
    expect(urls).toContain("https://homedoctor.app/terms");
    for (const g of GUIDES) expect(urls).toContain(`https://homedoctor.app/guides/${g.slug}`);
    for (const p of PRIVATE_PATHS) expect(urls.some((u) => u.includes(p))).toBe(false);
  });
});

describe("guides", () => {
  it("have unique slugs and search-friendly titles and descriptions", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const g of GUIDES) {
      expect(g.slug).toMatch(/^[a-z0-9-]+$/);
      expect(g.metaTitle.length, g.slug).toBeLessThanOrEqual(65);
      expect(g.metaDescription.length, g.slug).toBeGreaterThan(80);
      expect(g.metaDescription.length, g.slug).toBeLessThanOrEqual(165);
      expect(g.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(g.causes.length).toBeGreaterThanOrEqual(3);
      expect(g.costs.length).toBeGreaterThanOrEqual(3);
      expect(g.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("put a stop-and-call-a-pro section on the electrical guide", () => {
    const breaker = GUIDES.find((g) => g.slug === "breaker-keeps-tripping");
    expect(breaker?.safety?.length).toBeGreaterThan(0);
  });
});

describe("metadata and structured data", () => {
  it("sets a canonical and restates Open Graph on each page", () => {
    const m = pageMetadata({ title: "Guides", description: "d", path: "/guides" });
    expect(m.alternates?.canonical).toBe("/guides");
    expect(m.openGraph).toMatchObject({ url: "/guides", siteName: "Home Doctor", title: "Guides" });
  });

  it("builds a FAQPage from the landing questions", () => {
    const faq = faqPageJsonLd(LANDING_FAQS, "https://homedoctor.app");
    const main = faq.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(faq["@type"]).toBe("FAQPage");
    expect(main).toHaveLength(LANDING_FAQS.length);
    expect(main[0].acceptedAnswer.text.length).toBeGreaterThan(20);
  });
});

describe("llms.txt", () => {
  it("describes the product and links every guide", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://homedoctor.app");
    const res = llmsTxt();
    const text = await res.text();
    expect(res.headers.get("content-type")).toContain("text/markdown");
    expect(text.startsWith("# Home Doctor\n\n> ")).toBe(true);
    for (const g of GUIDES) expect(text).toContain(`https://homedoctor.app/guides/${g.slug}`);
    expect(text).toContain("Stop and call a pro now");
  });
});
