import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  ReceiptText,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  XCircle,
} from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUOTE_CHECKLIST, type CheckStatus, type PriceAssessment, type QuoteCheck } from "@/lib/ai/quote-schema";
import { cn, formatUsd, formatUsdRange } from "@/lib/utils";

export const PRICE_ASSESSMENT_META: Record<PriceAssessment, { label: string; className: string }> = {
  within_typical: { label: "Within typical range", className: "bg-secondary text-secondary-foreground border-transparent" },
  above_typical: { label: "Above typical range", className: "bg-amber-100 text-amber-900 border-amber-200" },
  below_typical: { label: "Below typical range", className: "bg-amber-100 text-amber-900 border-amber-200" },
  cant_tell: { label: "Can't compare", className: "bg-muted text-muted-foreground border-transparent" },
};

const READABILITY_LABEL: Record<QuoteCheck["readability"], string> = {
  clear: "Clear photo",
  partial: "Partly readable",
  unreadable: "Hard to read",
};

const STATUS_META: Record<CheckStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
  included: { icon: CheckCircle2, className: "text-primary", label: "Included" },
  vague: { icon: AlertCircle, className: "text-amber-600", label: "Vague" },
  missing: { icon: XCircle, className: "text-red-600", label: "Missing" },
};

function SectionTitle({ icon: Icon, children }: { icon: typeof FileText; children: React.ReactNode }) {
  return (
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon className="size-4 text-primary" /> {children}
    </CardTitle>
  );
}

/** Typical range as a bar, with a marker for where this quote lands. */
function PriceRangeBar({ low, high, total }: { low: number; high: number; total: number | null }) {
  const lo = Math.min(low, total ?? low);
  const hi = Math.max(high, total ?? high);
  const pad = (hi - lo) * 0.15 || hi * 0.15 || 1;
  const min = Math.max(0, lo - pad);
  const max = hi + pad;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="pt-7 pb-6" aria-hidden>
      <div className="relative h-2.5 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-(image:--grad)"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        <span className="absolute top-4 -translate-x-1/2 text-xs text-muted-foreground" style={{ left: `${pct(low)}%` }}>
          {formatUsd(low)}
        </span>
        <span className="absolute top-4 -translate-x-1/2 text-xs text-muted-foreground" style={{ left: `${pct(high)}%` }}>
          {formatUsd(high)}
        </span>
        {total != null && (
          <div className="absolute -top-7 -translate-x-1/2 text-center" style={{ left: `${pct(total)}%` }}>
            <span className="whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
              This quote
            </span>
            <span className="mx-auto mt-1 block size-4 rounded-full border-[3px] border-background bg-foreground shadow" />
          </div>
        )}
      </div>
    </div>
  );
}

export function QuoteCheckResult({ quote: q, imageUrls }: { quote: QuoteCheck; imageUrls: string[] }) {
  const assessment = PRICE_ASSESSMENT_META[q.price_assessment];
  const covered = QUOTE_CHECKLIST.filter(({ key }) => q.checklist[key].status === "included").length;
  const rangeNote = /varies by region/i.test(q.typical_range.note)
    ? q.typical_range.note
    : `${q.typical_range.note} Typical range; varies by region and access.`;

  return (
    <div className="space-y-4">
      {imageUrls.length > 0 && (
        <div className="flex gap-2">
          {imageUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL */}
              <img src={url} alt={`Quote page ${i + 1}`} className="size-20 rounded-xl border object-cover" />
            </a>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="px-2.5 py-1 text-sm">
            <FileText /> Quote check
          </Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm">
            {READABILITY_LABEL[q.readability]}
          </Badge>
        </div>
        <h1 className="text-balance font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight">{q.title}</h1>
        <p className="text-muted-foreground">{q.job_summary}</p>
      </div>

      <div className="rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Bottom line</p>
        <p className="mt-1.5 font-display text-xl font-semibold leading-snug">{q.bottom_line}</p>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle icon={ReceiptText}>The price</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">This quote</p>
              <p className="text-3xl font-bold tracking-tight">
                {q.quote_total != null ? formatUsd(q.quote_total) : "Total not readable"}
              </p>
            </div>
            <Badge variant="outline" className={cn("px-2.5 py-1 text-sm", assessment.className)}>
              {assessment.label}
            </Badge>
          </div>
          <PriceRangeBar low={q.typical_range.low} high={q.typical_range.high} total={q.quote_total} />
          <p className="text-sm">
            <span className="font-semibold">Typical for this job: </span>
            <span className="text-gradient font-semibold">{formatUsdRange(q.typical_range.low, q.typical_range.high)}</span>
          </p>
          <p className="text-sm text-muted-foreground">{q.price_assessment_note}</p>
          <p className="text-xs text-muted-foreground">{rangeNote}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle icon={TriangleAlert}>Red flags</SectionTitle>
        </CardHeader>
        <CardContent>
          {q.red_flags.length === 0 ? (
            <p className="flex items-center gap-2 text-sm">
              <ShieldCheck className="size-5 text-primary" /> Nothing jumped out as a red flag.
            </p>
          ) : (
            <ul className="space-y-2">
              {q.red_flags.map((f, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex gap-3 rounded-xl border p-3.5",
                    f.severity === "serious" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
                  )}
                >
                  <TriangleAlert
                    className={cn("mt-0.5 size-5 shrink-0", f.severity === "serious" ? "text-red-600" : "text-amber-600")}
                  />
                  <div className="text-sm">
                    <p className={cn("font-semibold", f.severity === "serious" ? "text-red-950" : "text-amber-950")}>
                      {f.flag}
                    </p>
                    <p className={f.severity === "serious" ? "text-red-950/80" : "text-amber-950/80"}>{f.explanation}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle icon={ClipboardList}>What a solid quote includes</SectionTitle>
          <p className="text-sm text-muted-foreground">
            {covered} of {QUOTE_CHECKLIST.length} clearly covered
          </p>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {QUOTE_CHECKLIST.map(({ key, label }) => {
              const item = q.checklist[key];
              const meta = STATUS_META[item.status];
              return (
                <li key={key} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <meta.icon className={cn("mt-0.5 size-5 shrink-0", meta.className)} aria-label={meta.label} />
                  <div className="text-sm">
                    <p className="font-medium">
                      {label} <span className={cn("font-normal", meta.className)}>· {meta.label}</span>
                    </p>
                    <p className="text-muted-foreground">{item.note}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {q.line_items.length > 0 && (
        <Card>
          <CardHeader>
            <SectionTitle icon={ReceiptText}>Line items we could read</SectionTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y rounded-xl border">
              {q.line_items.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-3 p-3 text-sm">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    {item.note && <p className="text-muted-foreground">{item.note}</p>}
                  </div>
                  <p className="shrink-0 font-semibold">{item.amount != null ? formatUsd(item.amount) : "—"}</p>
                </li>
              ))}
              {q.quote_total != null && (
                <li className="flex justify-between gap-3 bg-muted/60 p-3 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatUsd(q.quote_total)}</span>
                </li>
              )}
              {q.deposit_amount != null && (
                <li className="flex justify-between gap-3 p-3 text-sm">
                  <span>Due up front</span>
                  <span className="font-semibold">
                    {formatUsd(q.deposit_amount)}
                    {q.deposit_percent != null && ` (${Math.round(q.deposit_percent)}%)`}
                  </span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <SectionTitle icon={UserRound}>Contractor</SectionTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Business</dt>
            <dd>{q.contractor.name || "Not on the quote"}</dd>
            <dt className="text-muted-foreground">License #</dt>
            <dd className={cn(!q.contractor.license_number && "text-amber-700")}>
              {q.contractor.license_number || "Not on the quote"}
            </dd>
            <dt className="text-muted-foreground">Contact</dt>
            <dd>{q.contractor.phone_or_email || "Not on the quote"}</dd>
          </dl>
        </CardContent>
      </Card>

      {q.questions_to_ask.length > 0 && (
        <Card>
          <CardHeader>
            <SectionTitle icon={HelpCircle}>Ask before you sign</SectionTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3">
              {q.questions_to_ask.map((question, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[15px] leading-relaxed">{question}</span>
                </li>
              ))}
            </ol>
            <CopyButton text={q.questions_to_ask.map((x, i) => `${i + 1}. ${x}`).join("\n")} label="Copy questions" />
          </CardContent>
        </Card>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        General guidance from photos of the quote, not legal advice. Prices are typical ranges and vary by region and
        access. For contract questions, contact your state&apos;s contractor licensing board.
      </p>
    </div>
  );
}
