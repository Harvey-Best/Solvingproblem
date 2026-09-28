import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GuideCta } from "@/components/guides/guide-cta";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { DIY_VERDICT_META, SEVERITY_META } from "@/lib/diagnosis-meta";
import { guidesByCategory, type Guide } from "@/lib/guides";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const DESCRIPTION =
  "Plain-English guides to common household problems: what causes them, how urgent they are, what you can safely try, what repairs cost, and when to call a pro.";

export const metadata = pageMetadata({ title: "Home repair guides", description: DESCRIPTION, path: "/guides" });

export default function GuidesPage() {
  const groups = guidesByCategory();
  const listed = groups.flatMap((group) => group.guides);

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
              itemListElement: listed.map((g, i) => ({
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

      <nav aria-label="Guide categories" className="mt-6 flex flex-wrap gap-2">
        {groups.map((group) => (
          <a
            key={group.anchor}
            href={`#${group.anchor}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border bg-card px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <span aria-hidden>{group.emoji}</span>
            {group.label}
            <span className="text-muted-foreground">{group.guides.length}</span>
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section key={group.anchor} id={group.anchor} aria-labelledby={`${group.anchor}-heading`} className="mt-10 scroll-mt-20">
          <h2 id={`${group.anchor}-heading`} className="font-display text-2xl font-semibold tracking-tight">
            <span aria-hidden className="mr-2">
              {group.emoji}
            </span>
            {group.label}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {group.guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-10">
        <GuideCta
          title="Don't see your problem?"
          body="Snap a photo of it. Home Doctor tells you what it is, how urgent it is, and what it should cost to fix."
        />
      </div>
    </main>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  const severity = SEVERITY_META[guide.severity];
  return (
    <li>
      <Link
        href={`/guides/${guide.slug}`}
        className="group flex h-full flex-col rounded-3xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_40px_-28px_rgba(14,27,44,0.5)]"
      >
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wide">{DIY_VERDICT_META[guide.verdict].label}</span>
          <Badge variant="outline" className={cn("px-2 py-0.5", severity.className)}>
            {severity.label}
          </Badge>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug">{guide.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{guide.quickAnswer}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
          Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );
}
