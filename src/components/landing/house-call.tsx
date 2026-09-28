import Link from "next/link";
import {
  ArrowRight,
  BrickWall,
  Camera,
  CheckCircle2,
  CloudRain,
  DoorOpen,
  Droplets,
  FileText,
  Flame,
  PlugZap,
  Stethoscope,
  Waves,
  Wind,
  Zap,
} from "lucide-react";

import { BreakerPanelArt, FaucetArt, WaterHeaterArt } from "@/components/templates/illustrations";
import { cn, cssVars } from "@/lib/utils";

/**
 * The "House Call" landing page, themeable. Without a gradient it renders the
 * solid Green template; with one it layers gradients onto the same layout.
 */

export type HouseCallTheme = {
  slug: string;
  colors: {
    bg: string;
    ink: string;
    muted: string;
    line: string;
    accent: string;
    accentInk: string;
    accentSoft: string;
    illSoft: string;
    /** Italic highlight on the dark closing panel (solid themes). */
    onDark: string;
  };
  /** Stops should stay dark enough for white text; glows are the light tints. */
  gradient?: {
    from: string;
    via: string;
    to: string;
    softFrom: string;
    softTo: string;
    glowA: string;
    glowB: string;
  };
};

const SYMPTOMS = [
  { Icon: Droplets, label: "Dripping faucet" },
  { Icon: Waves, label: "Running toilet" },
  { Icon: Zap, label: "Tripping breaker" },
  { Icon: Flame, label: "Noisy water heater" },
  { Icon: BrickWall, label: "Drywall crack" },
  { Icon: Wind, label: "AC not cooling" },
  { Icon: CloudRain, label: "Roof leak" },
  { Icon: DoorOpen, label: "Sticking door" },
  { Icon: PlugZap, label: "Dead outlet" },
];

const TRIAGE = [
  { label: "Cosmetic", body: "Looks bad, isn't hurting anything." },
  { label: "Fix soon", body: "Will get worse, or cost more, if you wait." },
  { label: "Urgent", body: "Deal with it in the next day or two." },
  {
    label: "Stop & call a pro",
    body: "Gas, sparks, water near wiring, sagging ceilings, CO alarms. Every time.",
  },
];

const CASES = [
  {
    Art: FaucetArt,
    area: "Plumbing",
    severity: "Fix soon",
    symptom: "Kitchen faucet won't stop dripping",
    diagnosis: "Worn cartridge",
    treatment: "DIY · $12 part · 30 min",
  },
  {
    Art: WaterHeaterArt,
    area: "Plumbing",
    severity: "Fix soon",
    symptom: "Water heater pops and rumbles",
    diagnosis: "Sediment buildup",
    treatment: "DIY if handy · flush the tank",
  },
  {
    Art: BreakerPanelArt,
    area: "Electrical",
    severity: "Urgent",
    symptom: "Kitchen breaker trips every morning",
    diagnosis: "Overloaded circuit",
    treatment: "Call an electrician · $150–$400",
  },
];

const CHART = [
  ["Diagnosis", "Worn cartridge"],
  ["Severity", "Fix soon"],
  ["Verdict", "DIY · 30–45 min"],
  ["Part", "Cartridge · $12–$35"],
  ["Pro price", "$150–$300"],
];

type Gradient = NonNullable<HouseCallTheme["gradient"]>;

/** Two soft, blurred color blobs used behind the hero and the closing panel. */
function Glow({ g, className }: { g: Gradient; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        className="absolute -top-[12rem] right-[-12rem] size-[38rem] rounded-full opacity-50 blur-3xl sm:right-[-4rem]"
        style={{ background: `radial-gradient(circle, ${g.glowA}, transparent 65%)` }}
      />
      <div
        className="absolute left-[-14rem] top-[21.5rem] size-[32rem] rounded-full opacity-35 blur-3xl sm:left-[-6rem] sm:top-[17rem]"
        style={{ background: `radial-gradient(circle, ${g.glowB}, transparent 65%)` }}
      />
    </div>
  );
}

function CtaButton({ gradient, className }: { gradient: boolean; className?: string }) {
  return (
    <Link
      href="/diagnose"
      className={cn(
        "group inline-flex h-15 items-center gap-3 rounded-full pl-2 pr-7 text-lg font-semibold text-(--accent-ink) shadow-[0_14px_30px_-16px_var(--accent)] ring-(--accent)/20 transition-all duration-300 ease-out hover:ring-8 active:scale-[0.97]",
        gradient ? "bg-(image:--grad) bg-left duration-500 hover:bg-right" : "bg-(--accent)",
        className
      )}
      style={gradient ? { backgroundSize: "200% 100%" } : undefined}
    >
      <span className="grid size-11 place-items-center rounded-full bg-white text-(--accent) transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105">
        <Camera className="size-5" />
      </span>
      Diagnose my problem
    </Link>
  );
}

function ExamCard({ gradient }: { gradient: boolean }) {
  return (
    <div className="relative mx-auto mb-40 w-full max-w-md sm:mb-14">
      <div className="-rotate-2 rounded-[2rem] border border-(--line) bg-white p-3 shadow-[0_30px_60px_-30px_rgba(19,32,26,0.5)]">
        <div className="relative aspect-[6/5] overflow-hidden rounded-[1.4rem]">
          <FaucetArt tiles className="size-full" />
          {[
            "left-4 top-4 border-l-[3px] border-t-[3px] rounded-tl-lg",
            "right-4 top-4 border-r-[3px] border-t-[3px] rounded-tr-lg",
            "bottom-4 left-4 border-b-[3px] border-l-[3px] rounded-bl-lg",
            "bottom-4 right-4 border-b-[3px] border-r-[3px] rounded-br-lg",
          ].map((pos) => (
            <span key={pos} className={cn("absolute size-7 border-white", pos)} />
          ))}
          <div
            className={cn(
              "t-scan-line absolute inset-x-3 h-0.5 rounded-full shadow-[0_0_18px_5px_var(--accent)]",
              gradient ? "bg-(image:--grad)" : "bg-(--accent)"
            )}
          />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            Looking closely…
          </span>
        </div>
      </div>

      <div className="absolute -bottom-36 -right-1 w-[82%] rotate-[3deg] rounded-2xl border border-(--line) bg-[#FFFEFA] p-4 pt-5 shadow-[0_24px_40px_-20px_rgba(19,32,26,0.45)] sm:-bottom-14 sm:-right-10">
        <span className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rounded-md bg-(--ink)" aria-hidden />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--muted)">House call · chart</p>
        <dl className="mt-2">
          {CHART.map(([k, v], i) => (
            <div
              key={k}
              className="t-rise flex items-center justify-between gap-3 border-b border-dashed border-(--line) py-1.5 last:border-0"
              style={cssVars({ "--d": `${0.9 + i * 0.25}s` })}
            >
              <dt className="flex items-center gap-1.5 text-[13px] text-(--muted)">
                <CheckCircle2 className="size-3.5 text-(--accent)" /> {k}
              </dt>
              <dd className="text-right text-[13px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function HouseCallTemplate({
  theme: t,
  homeHref,
  nav,
  preview = true,
  afterHero,
  beforeClosing,
  footerLinks,
  legalLinks,
}: {
  theme: HouseCallTheme;
  /** Where the logo links. Defaults to this template's preview URL. */
  homeHref?: string;
  /** Header actions. Defaults to a plain "Sign in" link. */
  nav?: React.ReactNode;
  /** Template previews leave room at the bottom for the floating switcher. */
  preview?: boolean;
  /** Extra sections: right after the hero, and just before the closing CTA. */
  afterHero?: React.ReactNode;
  beforeClosing?: React.ReactNode;
  footerLinks?: { href: string; label: string }[];
  /** Small links next to the copyright line (privacy, terms). */
  legalLinks?: { href: string; label: string }[];
}) {
  const g = t.gradient;
  const vars = cssVars({
    "--bg": t.colors.bg,
    "--ink": t.colors.ink,
    "--muted": t.colors.muted,
    "--line": t.colors.line,
    "--accent": t.colors.accent,
    "--accent-ink": t.colors.accentInk,
    "--accent-soft": t.colors.accentSoft,
    "--ill-ink": t.colors.ink,
    "--ill-paper": "#FFFEFA",
    "--ill-soft": t.colors.illSoft,
    "--ill-accent": t.colors.accent,
    ...(g && {
      "--grad": `linear-gradient(120deg, ${g.from}, ${g.via}, ${g.to})`,
      "--grad-soft": `linear-gradient(120deg, ${g.softFrom}, ${g.softTo})`,
    }),
  });

  return (
    <div style={vars} className="min-h-screen overflow-x-clip bg-(--bg) pt-[env(safe-area-inset-top)] text-(--ink) selection:bg-(--accent-soft)">
      <div className={cn(g && "relative isolate")}>
        {g && <Glow g={g} />}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:py-5">
          <Link href={homeHref ?? `/templates/${t.slug}`} className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl" aria-label="Home Doctor home">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-[10px] text-white",
                g ? "bg-(image:--grad)" : "bg-(--accent)"
              )}
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
              </svg>
            </span>
            <span className="whitespace-nowrap font-display text-[22px] font-semibold tracking-tight max-[359px]:sr-only">
              Home Doctor
            </span>
          </Link>
          {nav ?? (
            <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-(--accent-soft)">
              Sign in
            </Link>
          )}
        </header>

        <main>
          {/* Hero */}
          <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-3 lg:grid-cols-2 lg:pb-24 lg:pt-12">
            <div>
              <p className="t-rise inline-flex items-center gap-2 rounded-full bg-(--accent-soft) px-3.5 py-1.5 text-sm font-medium text-(--accent)">
                <Stethoscope className="size-4" /> The 30-second house call
              </p>
              <h1
                className="font-display t-rise mt-5 text-[2.45rem] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[4.3rem] lg:text-[4.9rem]"
                style={cssVars({ "--d": "80ms" })}
              >
                Point your phone at the problem. Know what&apos;s wrong in{" "}
                <span className="relative whitespace-nowrap">
                  <span
                    className={cn(
                      "t-mark absolute inset-x-[-0.12em] bottom-[0.06em] top-[0.5em] rounded-md",
                      g ? "bg-(image:--grad-soft)" : "bg-(--accent-soft)"
                    )}
                  />
                  {g ? (
                    <span className="relative -mr-[0.12em] bg-(image:--grad) bg-clip-text pr-[0.12em] italic text-transparent">
                      30 seconds.
                    </span>
                  ) : (
                    <span className="relative italic text-(--accent)">30 seconds.</span>
                  )}
                </span>
              </h1>
              <p className="t-rise mt-4 max-w-lg text-base leading-relaxed text-(--muted) sm:mt-6 sm:text-lg" style={cssVars({ "--d": "160ms" })}>
                Home Doctor tells you what it is, whether you can fix it yourself, what parts to buy, and what a pro should
                charge.
              </p>
              <div className="t-rise mt-6 sm:mt-8" style={cssVars({ "--d": "240ms" })}>
                <CtaButton gradient={Boolean(g)} />
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-medium sm:mt-5 sm:gap-x-5">
                  {["First diagnosis free", "No signup", "Know if it's DIY before you spend a dime"].map((r) => (
                    <li key={r} className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-(--accent)" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="t-rise" style={cssVars({ "--d": "200ms" })}>
              <ExamCard gradient={Boolean(g)} />
            </div>
          </section>

          {afterHero}

          {/* Symptoms: compact */}
          <section className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-[2.3rem] font-semibold leading-tight sm:text-5xl">
                Symptoms we see every day
              </h2>
              <p className="text-(--muted)">If it&apos;s in your house, we&apos;ll take a look.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {SYMPTOMS.map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="/diagnose"
                  className="t-reveal group inline-flex items-center gap-2 rounded-full border border-(--line) bg-white px-4 py-2.5 text-[15px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent) hover:shadow-[0_10px_20px_-12px_var(--accent)] active:scale-95"
                >
                  <Icon className="size-4 text-(--accent) transition-transform duration-200 group-hover:scale-125" />
                  {label}
                </Link>
              ))}
            </div>
          </section>

          {/* Quote check: compact */}
          <section className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
            <div className="t-reveal flex flex-col gap-5 rounded-[2rem] border border-(--line) bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-(--accent-soft) text-(--accent)">
                  <FileText className="size-6" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                    Already have a quote?
                  </h2>
                  <p className="mt-1 max-w-xl text-(--muted)">
                    Snap it. We&apos;ll list what&apos;s missing, flag things like a big deposit or no license number, and
                    tell you if the price is in a typical range.
                  </p>
                </div>
              </div>
              <Link
                href="/quote"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-(--line) bg-(--bg) px-6 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-(--accent) hover:text-(--accent) active:scale-[0.97]"
              >
                Check a quote <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </section>

          {/* Full-color triage */}
          <section
            className={cn("text-white", g ? "relative isolate overflow-hidden" : "bg-(--accent)")}
            style={g ? { background: `radial-gradient(90% 120% at 100% 0%, ${g.glowB}55, transparent 55%), var(--grad)` } : undefined}
          >
            <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Triage, like a real doctor</p>
              <h2
                className="font-display t-reveal mt-4 max-w-3xl text-[2.7rem] font-semibold leading-[1.02] sm:text-6xl"
           
              >
                We tell you how worried to be. <span className="italic text-white/70">Honestly.</span>
              </h2>
              <ol className="mt-12 grid gap-8 sm:grid-cols-4 sm:gap-5">
                {TRIAGE.map((item, i) => (
                  <li key={item.label} className="t-reveal">
                    <div className="relative h-2 rounded-full" style={{ background: `rgba(255,255,255,${0.28 + i * 0.24})` }}>
                      {i === TRIAGE.length - 1 && (
                        <span className="absolute -right-1 top-1/2 size-4 -translate-y-1/2">
                          <span className="t-pulse absolute inset-0 rounded-full bg-white" />
                          <span className="absolute inset-0.5 rounded-full bg-white" />
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-xl font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Example cases */}
          <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
            <h2 className="font-display text-[2.3rem] font-semibold leading-tight sm:text-5xl">
              Example house calls
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {CASES.map(({ Art, area, severity, symptom, diagnosis, treatment }, i) => (
                <article
                  key={symptom}
                  className="t-reveal group overflow-hidden rounded-[1.75rem] border border-(--line) bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_44px_-28px_rgba(19,32,26,0.5)]"
                >
                  <div className="flex items-center justify-between px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-(--muted)">
                    <span>
                      Case 0{i + 1} · {area}
                    </span>
                    <span className="rounded-full bg-(--accent-soft) px-2 py-0.5 font-sans font-semibold normal-case tracking-normal text-(--accent)">
                      {severity}
                    </span>
                  </div>
                  <div className={cn("aspect-[6/5] p-8", g ? "bg-(image:--grad-soft)" : "bg-(--accent-soft)")}>
                    <Art className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
                  </div>
                  <dl className="divide-y divide-(--line) px-5 py-2 text-sm">
                    {[
                      ["Symptom", symptom],
                      ["Diagnosis", diagnosis],
                      ["Treatment", treatment],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2 py-2.5">
                        <dt className="text-(--muted)">{k}</dt>
                        <dd className={cn("font-medium", k === "Diagnosis" && "font-semibold text-(--accent)")}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </section>

          {beforeClosing}

          {/* Final CTA */}
          <section className="px-5 pb-24">
            <div
              className={cn(
                "t-reveal mx-auto max-w-6xl rounded-[2.5rem] bg-(--ink) px-6 py-16 text-center text-(--bg) sm:py-20",
                g && "relative isolate overflow-hidden"
              )}
            >
              {g && <Glow g={g} className="opacity-60" />}
              <h2
                className="font-display mx-auto max-w-3xl text-[2.6rem] font-semibold leading-[1.02] sm:text-7xl"
           
              >
                Your house is trying to{" "}
                {g ? (
                  <span
                    className="-mr-[0.1em] bg-clip-text pr-[0.1em] italic text-transparent"
                    style={{ backgroundImage: `linear-gradient(90deg, ${g.glowA}, ${g.glowB})` }}
                  >
                    tell you something.
                  </span>
                ) : (
                  <span className="italic" style={{ color: t.colors.onDark }}>
                    tell you something.
                  </span>
                )}
              </h2>
              <div className="mt-9 flex justify-center">
                <CtaButton gradient={Boolean(g)} />
              </div>
              <p className="mt-4 text-sm text-(--bg)/60">Your first diagnosis is free. No account needed.</p>
            </div>
          </section>
        </main>

        <footer className="border-t border-(--line)">
          <div
            className={cn(
              "mx-auto max-w-6xl space-y-2 px-5 pt-8 text-xs leading-relaxed text-(--muted)",
              preview ? "pb-28" : "pb-10"
            )}
          >
            {footerLinks && (
              <nav aria-label="Footer" className="pb-3">
                <ul className="-my-2 flex flex-wrap gap-x-6 text-sm font-medium text-(--ink)">
                  {footerLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-(--accent)">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <p>
              <strong className="font-semibold text-(--ink)">
                Home Doctor gives general guidance, not a substitute for a licensed professional.
              </strong>{" "}
              Safety escalations are there for a reason: if we tell you to stop and call a pro, do that first.
            </p>
            <p>If you smell gas, see sparks or smoke, or anyone is hurt, leave the area and call 911.</p>
            {legalLinks && (
              <p className="flex flex-wrap items-center gap-x-4">
                <span>© {new Date().getFullYear()} Home Doctor</span>
                {legalLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="inline-flex min-h-11 items-center underline-offset-2 transition-colors hover:text-(--ink) hover:underline"
                  >
                    {l.label}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
