import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GuideCta } from "@/components/guides/guide-cta";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_META, categoryLabel } from "@/lib/diagnosis-meta";
import { GUIDES } from "@/lib/guides";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const DESCRIPTION =
  "Plain-English guides to common household problems: what causes them, how urgent they are, what you can safely try, what repairs cost, and when to call a pro.";

export const metadata = pageMetadata({ title: "Home repair guides", description: DESCRIPTION, path: "/guides" });

export default function GuidesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
      <JsonLd
        data={graph(
          {
            "@type": "CollectionPage",
            "@id": `${absoluteUrl("/guides")}#page`,
            name: "Home repair guides",
            description: DESCRIPTION,
            url: absoluteUrl("/guides"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: GUIDES.map((g, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: absoluteUrl(`/guides/${g.slug}`),
                name: g.title,
              })),
            },
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ])
        )}
      />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Guides</p>
      <h1 className="mt-3 text-balance font-display text-[2.4rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl">
        Common house problems, explained straight
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{DESCRIPTION}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const severity = SEVERITY_META[g.severity];
          return (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="group flex h-full flex-col rounded-3xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_40px_-28px_rgba(14,27,44,0.5)]"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wide">
                    {g.category ? categoryLabel(g.category) : "Home"}
                  </span>
                  <Badge variant="outline" className={cn("px-2 py-0.5", severity.className)}>
                    {severity.label}
                  </Badge>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug">{g.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{g.quickAnswer}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
                  Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        <GuideCta
          title="Don't see your problem?"
          body="Snap a photo of it. Home Doctor tells you what it is, how urgent it is, and what it should cost to fix."
        />
      </div>
    </main>
  );
}
