import type { MetadataRoute } from "next";

import { GUIDES } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";

const newestGuide = GUIDES.map((g) => g.reviewed).sort().at(-1);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/diagnose"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/quote"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/guides"), lastModified: newestGuide, changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({
      url: absoluteUrl(`/guides/${g.slug}`),
      lastModified: g.reviewed,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
