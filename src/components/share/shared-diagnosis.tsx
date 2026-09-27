import Link from "next/link";
import { Camera, Check, Clock, Lightbulb, Lock, ShieldAlert, Siren, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CONFIDENCE_LABEL,
  DIY_VERDICT_META,
  HAZARD_LABEL,
  SEVERITY_META,
  categoryLabel,
  type Hazard,
} from "@/lib/diagnosis-meta";
import { shortTimeEstimate, type PublicDiagnosis } from "@/lib/share";
import { cn, formatUsdRange } from "@/lib/utils";

/** Standard first steps per hazard. The owner's own warning text isn't shared. */
const HAZARD_ADVICE: Record<Hazard, string> = {
  gas: "If you smell gas, leave now and call the gas utility or 911 from outside. Don't flip switches or light anything.",
  carbon_monoxide: "If a CO alarm is sounding or anyone feels dizzy or sick, get everyone outside and call 911.",
  electrical: "Turn the power off at the breaker before touching anything. Stay away from sparking, hot or buzzing parts.",
  water_near_electrical: "Keep clear of water near outlets, cords or the panel. Only switch off the breaker if you can reach it while dry.",
  structural: "Keep people and pets away from the sagging or cracked area until a pro has checked it.",
  mold: "Wear a mask and gloves near the growth, and don't brush it dry. That spreads spores.",
  fire: "If you see smoke or flames, get everyone out and call 911.",
  other: "Take care around it, and check with a pro before doing anything that feels unsafe.",
};

const FULL_DIAGNOSIS_INCLUDES = [
  "Step-by-step fix, or what to do until the pro arrives",
  "Tools and parts with prices and store links",
  "Exactly what to tell the pro when you call",
];

function Fact({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4", className)}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-2 space-y-1.5">{children}</dd>
    </div>
  );
}

/**
 * The public, read-only summary behind a share link (/s/<shareId>). Only
 * takes a PublicDiagnosis, so it can't show anything private.
 */
export function SharedDiagnosis({ diagnosis: d }: { diagnosis: PublicDiagnosis }) {
  const severity = SEVERITY_META[d.severity];
  const verdict = DIY_VERDICT_META[d.diy_verdict];
  const emergency = d.severity === "call_pro_now";
  const diy = d.diy_verdict !== "call_pro";
  const time = shortTimeEstimate(d.time_estimate);

  return (
    <article className="space-y-6">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {categoryLabel(d.category)} · Shared diagnosis
        </p>
        <h1 className="text-balance font-display text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          {d.title}
        </h1>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={cn("px-2.5 py-1 text-sm", severity.className)}>
            {emergency && <Siren />} {severity.label}
          </Badge>
          <Badge className={cn("px-2.5 py-1 text-sm", verdict.className)}>{verdict.label}</Badge>
          <Badge variant="outline" className="px-2.5 py-1 text-sm">
            {CONFIDENCE_LABEL[d.confidence]}
          </Badge>
        </div>
        {!emergency && (
          <p className="text-[15px] text-muted-foreground">
            <span className="font-medium text-foreground">{severity.label}:</span> {severity.blurb}
          </p>
        )}
      </header>

      {(emergency || d.hazards.length > 0) && (
        <section aria-labelledby="safety" className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <h2 id="safety" className="flex items-center gap-2 font-semibold text-red-950">
            {emergency ? <Siren className="size-5 text-red-600" /> : <ShieldAlert className="size-5 text-red-600" />}
            {emergency ? "Stop and call a pro now" : "Safety warning"}
          </h2>
          {emergency && (
            <p className="mt-1 text-sm text-red-950/85">
              {d.hazards.length > 0
                ? severity.blurb
                : "Safety risk. A professional should check this before anyone tries to fix it."}
            </p>
          )}
          {d.hazards.length > 0 && (
            <ul className="mt-3 space-y-2.5 text-[15px] text-red-950/90">
              {d.hazards.map((h) => (
                <li key={h} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-red-600" />
                  <span>
                    <strong className="font-semibold text-red-950">{HAZARD_LABEL[h]}.</strong> {HAZARD_ADVICE[h]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="likely" className="rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5 sm:p-6">
        <h2 id="likely" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Lightbulb className="size-4" /> Most likely
        </h2>
        <p className="mt-2 text-[17px] leading-relaxed">{d.likely_cause}</p>
      </section>

      <section aria-labelledby="cost" className="space-y-3">
        <h2 id="cost" className="font-display text-2xl font-semibold tracking-tight">What it costs to fix</h2>
        <dl className={cn("grid gap-3", diy && "sm:grid-cols-2")}>
          {diy && (
            <Fact label="Do it yourself">
              <p className="text-4xl font-bold tracking-tight">
                {d.parts.count > 0 ? formatUsdRange(d.parts.low, d.parts.high) : "Tools only"}
              </p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {d.parts.count > 0 ? `${d.parts.count} ${d.parts.count === 1 ? "part" : "parts"} to buy` : "No parts to buy"}
                </span>
                {time && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {time}
                  </span>
                )}
              </p>
              {d.diy_verdict === "diy_if_handy" && (
                <p className="text-sm text-muted-foreground">Doable if you&apos;re comfortable with tools.</p>
              )}
            </Fact>
          )}
          <Fact label={diy ? "Hire a pro" : "What a pro typically charges"}>
            <p className="text-gradient w-fit text-4xl font-bold tracking-tight">
              {formatUsdRange(d.pro_cost_range.low, d.pro_cost_range.high)}
            </p>
            <p className="text-sm text-muted-foreground">{d.pro_cost_range.note}</p>
            {!diy && <p className="text-sm font-medium">This one is a job for a licensed professional.</p>}
          </Fact>
        </dl>
      </section>

      <div className="relative isolate overflow-hidden rounded-3xl bg-(image:--grad) p-6 text-white sm:p-7">
        <div
          aria-hidden
          className="absolute -right-16 -top-20 -z-10 size-64 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--glow-b), transparent 65%)" }}
        />
        <p className="font-display text-2xl font-semibold leading-tight">Something off at your place?</p>
        <p className="mt-1.5 text-white/85">
          Snap a photo and know what&apos;s wrong in about 30 seconds. Every diagnosis includes:
        </p>
        <ul className="mt-3 space-y-1.5 text-[15px]">
          {FULL_DIAGNOSIS_INCLUDES.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0" /> {item}
            </li>
          ))}
        </ul>
        <Button asChild size="lg" variant="secondary" className="mt-5 w-full bg-white text-foreground hover:bg-white/90 sm:w-auto">
          <Link href="/diagnose">
            <Camera className="size-5" /> Diagnose your own problem
          </Link>
        </Button>
        <p className="mt-3 text-sm text-white/75">First diagnosis free. No account needed.</p>
      </div>

      <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
        <p className="flex gap-2">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          <span>Shared from a Home Doctor diagnosis. The photos and the homeowner&apos;s notes stay private.</span>
        </p>
        <p className="flex gap-2">
          <Wrench className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <strong className="text-foreground">General guidance, not a substitute for a licensed professional.</strong>{" "}
            This summary is based on photos and a short description, so a pro who sees it in person may find more. If
            you smell gas, see sparks or smoke, or anyone is hurt, leave the area and call 911.
          </span>
        </p>
      </div>
    </article>
  );
}
