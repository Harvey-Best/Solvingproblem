import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ClipboardList, HelpCircle, Phone, ReceiptText, Search, ShieldAlert, Wrench } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { GuideCta } from "@/components/guides/guide-cta";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { DIY_VERDICT_META, SEVERITY_META, categoryLabel } from "@/lib/diagnosis-meta";
import { GUIDES, formatReviewed, getGuide } from "@/lib/guides";
import { breadcrumbJsonLd, faqPageJsonLd, graph, guideArticleJsonLd, guideOgImagePath, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    ogType: "article",
    absoluteTitle: true,
    image: { url: guideOgImagePath(guide.slug), alt: guide.title },
  });
}

function Section({ id, icon: Icon, title, children }: { id: string; icon: typeof Wrench; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="size-[18px]" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = absoluteUrl(`/guides/${guide.slug}`);
  const severity = SEVERITY_META[guide.severity];
  const verdict = DIY_VERDICT_META[guide.verdict];
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-5">
      <JsonLd
        data={graph(
          guideArticleJsonLd(guide),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.symptom, path: `/guides/${guide.slug}` },
          ]),
          faqPageJsonLd(guide.faqs, url)
        )}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li>
            <Link href="/guides" className="hover:text-foreground">
              Guides
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden />
          <li aria-current="page" className="text-foreground">
            {guide.symptom}
          </li>
        </ol>
      </nav>

      <article className="mt-6 space-y-10">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {guide.category ? `${categoryLabel(guide.category)} guide` : "Home repair guide"}
          </p>
          <h1 className="text-balance font-display text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {guide.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            By the Home Doctor team · Reviewed <time dateTime={guide.reviewed}>{formatReviewed(guide.reviewed)}</time>
          </p>

          <div className="rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Quick answer</h2>
            <p className="mt-2 text-[17px] leading-relaxed">{guide.quickAnswer}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How urgent</dt>
              <dd className="mt-2 space-y-1.5">
                <Badge variant="outline" className={cn("px-2.5 py-1 text-sm", severity.className)}>
                  {severity.label}
                </Badge>
                <p className="text-sm text-muted-foreground">{guide.severityNote}</p>
              </dd>
            </div>
            <div className="rounded-2xl border bg-card p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">DIY or pro</dt>
              <dd className="mt-2 space-y-1.5">
                <Badge className={cn("px-2.5 py-1 text-sm", verdict.className)}>{verdict.label}</Badge>
                <p className="text-sm text-muted-foreground">{guide.verdictNote}</p>
              </dd>
            </div>
          </dl>
        </header>

        {guide.safety && guide.safety.length > 0 && (
          <section aria-labelledby="safety" className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
            <h2 id="safety" className="flex items-center gap-2 font-semibold text-red-950">
              <ShieldAlert className="size-5 text-red-600" /> Stop and call a pro now if
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] text-red-950/90">
              {guide.safety.map((s) => (
                <li key={s} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-red-600" />
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Section id="causes" icon={Search} title="Common causes and how to tell them apart">
          <ol className="space-y-3">
            {guide.causes.map((c, i) => (
              <li key={c.cause} className="rounded-2xl border bg-card p-4 sm:p-5">
                <h3 className="flex items-baseline gap-2.5 font-semibold">
                  <span className="text-sm font-semibold text-primary">{i + 1}.</span> {c.cause}
                </h3>
                <dl className="mt-2 grid gap-2 text-[15px] sm:grid-cols-[7.5rem_1fr]">
                  <dt className="text-muted-foreground">How to tell</dt>
                  <dd>{c.howToTell}</dd>
                  <dt className="text-muted-foreground">What fixes it</dt>
                  <dd>{c.fix}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </Section>

        <GuideCta
          category={guide.category}
          title="Not sure which one you have?"
          body="Snap a photo. Home Doctor narrows it down, tells you how urgent it is, and prices the fix."
        />

        <Section id="try-first" icon={Wrench} title="What you can safely try first">
          <ol className="space-y-3">
            {guide.tryFirst.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-(image:--grad) text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[15px] leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="call-a-pro" icon={Phone} title="When to call a pro">
          <ul className="space-y-2 text-[15px]">
            {guide.callAPro.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="costs" icon={ReceiptText} title="What it costs">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">Typical costs to fix: {guide.symptom.toLowerCase()}</caption>
              <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold">
                    Job
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    DIY parts
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">
                    Pro, installed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {guide.costs.map((row) => (
                  <tr key={row.job}>
                    <th scope="row" className="px-4 py-3 font-medium">
                      {row.job}
                    </th>
                    <td className="px-3 py-3 text-muted-foreground">{row.diy}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ballpark US ranges as of {formatReviewed(guide.reviewed)}. Your region, access and the specifics of your
            home can move these a lot. Get two or three quotes for anything over a few hundred dollars.
          </p>
        </Section>

        <Section id="tell-the-pro" icon={ClipboardList} title="What to tell the pro">
          <blockquote className="rounded-2xl border-l-4 border-primary bg-card p-4 text-[15px] leading-relaxed">
            {guide.tellThePro}
          </blockquote>
          <CopyButton text={guide.tellThePro} label="Copy script" />
        </Section>

        <Section id="faq" icon={HelpCircle} title="Questions people ask">
          <div className="divide-y rounded-2xl border bg-card">
            {guide.faqs.map((f) => (
              <div key={f.q} className="p-4">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        <GuideCta
          category={guide.category}
          title="Get an answer for your house"
          body="Every house is different. A photo gets you the likely cause, how urgent it is, and a fair price, in about 30 seconds."
        />

        <nav aria-labelledby="related" className="space-y-3">
          <h2 id="related" className="font-display text-xl font-semibold">
            More guides
          </h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="block h-full rounded-2xl border bg-card p-4 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  {g.symptom}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-xs leading-relaxed text-muted-foreground">
          General guidance, not a substitute for a licensed professional who can see the problem in person. If you
          smell gas, see sparks or smoke, or anyone is hurt, leave the area and call 911.
        </p>
      </article>
    </main>
  );
}
