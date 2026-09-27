import {
  AlertTriangle,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  MessageSquareQuote,
  ShieldAlert,
  Siren,
  Wrench,
} from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Diagnosis } from "@/lib/ai/schema";
import {
  categoryLabel,
  CONFIDENCE_LABEL,
  DIY_VERDICT_META,
  HAZARD_LABEL,
  SEVERITY_META,
} from "@/lib/diagnosis-meta";
import { cn, formatUsdRange } from "@/lib/utils";

function homeDepotUrl(query: string) {
  return `https://www.homedepot.com/s/${encodeURIComponent(query)}`;
}

function amazonUrl(query: string) {
  const tag = process.env.AMAZON_ASSOCIATE_TAG;
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`;
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Wrench; children: React.ReactNode }) {
  return (
    <CardTitle className="flex items-center gap-2 text-base">
      <Icon className="size-4 text-primary" /> {children}
    </CardTitle>
  );
}

function StepList({ steps, urgent = false }: { steps: string[]; urgent?: boolean }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
              urgent ? "bg-red-100 text-red-800" : "bg-secondary text-secondary-foreground"
            )}
          >
            {i + 1}
          </span>
          <span className="pt-0.5 text-[15px] leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function DiagnosisResult({ diagnosis: d, imageUrls }: { diagnosis: Diagnosis; imageUrls: string[] }) {
  const severity = SEVERITY_META[d.severity];
  const verdict = DIY_VERDICT_META[d.diy_verdict];
  const emergency = d.severity === "call_pro_now";
  const isDiy = d.diy_verdict !== "call_pro";

  return (
    <div className="space-y-4">
      {imageUrls.length > 0 && (
        <div className="flex gap-2">
          {imageUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL */}
              <img src={url} alt={`Photo ${i + 1}`} className="size-20 rounded-xl border object-cover" />
            </a>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={cn("px-2.5 py-1 text-sm", severity.className)}>
            {emergency && <Siren />} {severity.label}
          </Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm">
            {CONFIDENCE_LABEL[d.confidence]}
          </Badge>
          <Badge variant="secondary" className="px-2.5 py-1 text-sm">
            {categoryLabel(d.category)}
          </Badge>
        </div>
        <h1 className="text-balance font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight">{d.title}</h1>
      </div>

      {emergency ? (
        <Card className="gap-3 border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-900">
              <Siren className="size-5 text-red-600" /> Stop and call a pro now
            </CardTitle>
            <p className="text-sm text-red-900/85">{d.severity_reason}</p>
          </CardHeader>
          {d.diy_steps.length > 0 && (
            <CardContent className="text-red-950">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-800">Do this right now</p>
              <StepList steps={d.diy_steps} urgent />
            </CardContent>
          )}
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{severity.label}:</span> {d.severity_reason}
        </p>
      )}

      {d.safety_warnings.length > 0 && (
        <div className="space-y-2">
          {d.safety_warnings.map((w, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />
              <div className="text-sm">
                <p className="font-semibold text-amber-950">{HAZARD_LABEL[w.hazard]}</p>
                <p className="text-amber-950/85">{w.warning}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <SectionTitle icon={Lightbulb}>Most likely</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[15px] leading-relaxed">{d.likely_cause}</p>
          {d.alternative_causes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">It could also be</p>
              <ul className="space-y-2.5">
                {d.alternative_causes.map((alt, i) => (
                  <li key={i} className="rounded-lg bg-muted p-3 text-sm">
                    <p className="font-medium">{alt.cause}</p>
                    <p className="text-muted-foreground">{alt.how_to_tell}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle icon={Wrench}>Can I fix it myself?</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn("px-3 py-1 text-sm", verdict.className)}>{verdict.label}</Badge>
            {d.time_estimate && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-3.5" /> {d.time_estimate}
              </span>
            )}
          </div>
          <p className="text-[15px]">{d.diy_verdict_reason}</p>
        </CardContent>
      </Card>

      {!emergency && d.diy_steps.length > 0 && (
        <Card>
          <CardHeader>
            <SectionTitle icon={isDiy ? Wrench : AlertTriangle}>
              {isDiy ? "How to fix it" : "Until the pro arrives"}
            </SectionTitle>
          </CardHeader>
          <CardContent>
            <StepList steps={d.diy_steps} />
          </CardContent>
        </Card>
      )}

      {!emergency && (d.tools_needed.length > 0 || d.parts.length > 0) && (
        <Card>
          <CardHeader>
            <SectionTitle icon={Wrench}>What you&apos;ll need</SectionTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {d.tools_needed.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Tools</p>
                <div className="flex flex-wrap gap-1.5">
                  {d.tools_needed.map((tool) => (
                    <Badge key={tool} variant="outline" className="px-2.5 py-1 text-sm font-normal">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {d.parts.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">Parts</p>
                <ul className="divide-y rounded-xl border">
                  {d.parts.map((part, i) => (
                    <li key={i} className="space-y-2 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="shrink-0 text-sm font-semibold">
                          {formatUsdRange(part.price_low, part.price_high)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={homeDepotUrl(part.search_query)}
                          target="_blank"
                          rel="noreferrer sponsored"
                          className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-800 hover:bg-orange-100"
                        >
                          Home Depot <ExternalLink className="size-3" />
                        </a>
                        <a
                          href={amazonUrl(part.search_query)}
                          target="_blank"
                          rel="noreferrer sponsored"
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-200"
                        >
                          Amazon <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <SectionTitle icon={Wrench}>What a pro should charge</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <p className="text-gradient w-fit text-4xl font-bold tracking-tight">
            {formatUsdRange(d.pro_cost_range.low, d.pro_cost_range.high)}
          </p>
          <p className="text-sm text-muted-foreground">{d.pro_cost_range.note}</p>
          {!/varies by region/i.test(d.pro_cost_range.note) && (
            <p className="text-xs text-muted-foreground">
              Typical range for parts and labor. Varies by region and access.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle icon={MessageSquareQuote}>What to tell the pro</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <blockquote className="border-l-4 border-primary/40 pl-3 text-[15px] italic leading-relaxed">
            {d.what_to_tell_the_pro}
          </blockquote>
          <CopyButton text={d.what_to_tell_the_pro} label="Copy to text or email" />
        </CardContent>
      </Card>

      {d.follow_up_questions.length > 0 && (
        <Card>
          <CardHeader>
            <SectionTitle icon={HelpCircle}>To be more sure, I&apos;d want to know</SectionTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-[15px]">
              {d.follow_up_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
