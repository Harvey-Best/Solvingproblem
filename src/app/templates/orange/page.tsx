import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { ArrowRight, Camera, Check, TriangleAlert } from "lucide-react";

import { HouseExplorer } from "@/components/templates/house-explorer";
import { Squiggle } from "@/components/templates/illustrations";
import { cn, cssVars } from "@/lib/utils";

export const metadata: Metadata = { title: "Template: Orange" };

const grotesk = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"] });

const theme = cssVars({
  "--bg": "#F3EEE4",
  "--ink": "#1A1714",
  "--muted": "#675F55",
  "--line": "#DCD3C3",
  "--accent": "#FF5A1F",
  "--accent-ink": "#1A1714",
  "--accent-soft": "#FFE3D6",
  "--ill-ink": "#1A1714",
  "--ill-paper": "#FFFBF4",
  "--ill-soft": "#EFE6D6",
  "--ill-accent": "#FF5A1F",
});

const RECEIPT = [
  "What it most likely is",
  "How urgent it is",
  "DIY or call a pro",
  "Step-by-step fix + tools",
  "Parts with real prices",
  "Fair price for a pro",
  "What to say to the pro",
];

const VERDICTS = [
  {
    label: "DIY",
    body: "Most people can do it in under two hours with basic tools.",
    example: "Running toilet → $8 flapper",
  },
  {
    label: "DIY if handy",
    body: "Doable if you're comfortable with tools. Mistakes cost money.",
    example: "Rumbling water heater → flush it",
  },
  {
    label: "Call a pro",
    body: "Needs a license, a permit, or it's dangerous. We'll tell you what to say.",
    example: "Tripping breaker → electrician",
  },
];

// Torn-receipt bottom edge.
const RECEIPT_EDGE = `polygon(0 0, 100% 0, 100% calc(100% - 10px), ${Array.from({ length: 20 }, (_, i) => {
  const x1 = 100 - (i * 100) / 20 - 100 / 40;
  const x2 = 100 - ((i + 1) * 100) / 20;
  return `${x1}% 100%, ${x2}% calc(100% - 10px)`;
}).join(", ")})`;

function PressButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Link
      href="/diagnose"
      className={cn(
        "group inline-flex h-15 items-center gap-3 rounded-xl border-2 border-(--ink) bg-(--accent) px-6 text-lg font-bold text-(--ink) shadow-[5px_5px_0_0_var(--ink)] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_var(--ink)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0_0_0_0_var(--ink)]",
        className
      )}
    >
      <Camera className="size-5 transition-transform duration-200 group-hover:-rotate-12" />
      {children}
      <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center bg-(--ink) py-1 pl-6 pr-3 font-mono text-xs font-semibold uppercase tracking-widest text-(--bg)",
        className
      )}
      style={{ clipPath: "polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)" }}
    >
      <span className="absolute left-[10px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-(--bg)" />
      {children}
    </span>
  );
}

export default function OrangeTemplate() {
  return (
    <div style={theme} className={cn(grotesk.className, "min-h-screen overflow-x-clip bg-(--bg) text-(--ink)")}>
      <header className="border-b-2 border-(--ink)">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/templates/orange" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg border-2 border-(--ink) bg-(--accent) text-lg font-extrabold leading-none">
              +
            </span>
            <span className="text-xl font-extrabold uppercase tracking-tight">Home Doctor</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg border-2 border-(--ink) px-3 py-1.5 text-sm font-bold transition-colors hover:bg-(--ink) hover:text-(--bg)"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-6 lg:pb-20 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Tag className="t-rise">First one&apos;s free</Tag>
            <h1
              className="t-rise mt-4 text-[2.55rem] font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-7xl lg:text-[5.5rem]"
              style={cssVars({ "--d": "80ms" })}
            >
              Point your phone at the{" "}
              <span className="relative inline-block">
                problem.
                <Squiggle className="absolute -bottom-1.5 left-0 h-3.5 w-full" />
              </span>{" "}
              Know what&apos;s wrong in 30&nbsp;seconds.
            </h1>
            <p className="t-rise mt-4 max-w-lg text-base leading-relaxed text-(--muted) sm:mt-6 sm:text-lg" style={cssVars({ "--d": "160ms" })}>
              Home Doctor tells you what it is, whether you can fix it yourself, what parts to buy, and what a pro should
              charge.
            </p>
            <div className="t-rise mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:gap-5" style={cssVars({ "--d": "240ms" })}>
              <PressButton>Diagnose my problem</PressButton>
              <p className="flex items-center gap-2.5 text-[15px] font-semibold">
                <span className="grid size-6 place-items-center rounded-full border-2 border-(--ink) bg-(--accent)">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                Skip the $150 service call when it&apos;s a $12 part.
              </p>
            </div>
          </div>

          <div className="t-rise" style={cssVars({ "--d": "200ms" })}>
            <HouseExplorer />
          </div>
        </div>
      </section>

      {/* How it works: compact */}
      <section className="border-y-2 border-(--ink) bg-[#FFFBF4]">
        <ol className="mx-auto grid max-w-6xl divide-y-2 divide-(--ink) px-5 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {[
            ["Snap it", "1–3 photos of the problem."],
            ["Say it", "A sentence about the noise, smell or leak."],
            ["Sorted", "Cause, urgency, fix, parts and price."],
          ].map(([title, body], i) => (
            <li key={title} className="flex items-center gap-4 py-6 sm:px-6 sm:first:pl-0">
              <span
                className="text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_var(--ink)]"
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <p className="text-xl font-extrabold tracking-tight">{title}</p>
                <p className="text-sm text-(--muted)">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Receipt */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-reveal text-[2.6rem] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              Everything a straight-talking contractor would tell you.
            </h2>
            <p className="mt-5 max-w-md text-lg text-(--muted)">
              Minus the upsell. Every diagnosis comes itemized, so you know exactly what you&apos;re dealing with.
            </p>
          </div>
          <div
            className="t-reveal mx-auto w-full max-w-sm rotate-[1.5deg] bg-[#FFFDF8] px-6 pb-9 pt-6 font-mono text-[13px] shadow-[0_24px_40px_-22px_rgba(26,23,20,0.5)] transition-transform duration-300 hover:rotate-0"
            style={{ clipPath: RECEIPT_EDGE }}
          >
            <p className="text-center font-bold uppercase tracking-widest">Home Doctor</p>
            <p className="text-center text-[11px] text-(--muted)">Diagnosis receipt</p>
            <div className="my-4 border-t-2 border-dashed border-(--ink)/40" />
            <ul className="space-y-2">
              {RECEIPT.map((line) => (
                <li key={line} className="flex items-baseline gap-2">
                  <span>{line}</span>
                  <span className="flex-1 translate-y-[-3px] border-b-2 border-dotted border-(--ink)/30" />
                  <span className="font-bold text-(--accent)">✓</span>
                </li>
              ))}
            </ul>
            <div className="my-4 border-t-2 border-dashed border-(--ink)/40" />
            <p className="flex justify-between text-base font-bold">
              <span>TOTAL</span>
              <span>$0.00</span>
            </p>
            <p className="mt-1 text-[11px] text-(--muted)">First diagnosis free · no signup</p>
            <div className="mt-5 flex h-9 items-stretch justify-center gap-[3px]" aria-hidden>
              {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2].map((w, i) => (
                <span key={i} className="bg-(--ink)" style={{ width: w * 1.5 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-color band */}
      <section className="border-y-2 border-(--ink) bg-(--accent)">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
          <h2 className="t-reveal text-[3.2rem] font-extrabold leading-[0.88] tracking-[-0.045em] sm:text-8xl">
            Three verdicts.
            <br />
            No runaround.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VERDICTS.map((v) => (
              <div key={v.label} className="t-swing relative pt-6">
                <span className="absolute left-1/2 top-0 h-7 w-0.5 -translate-x-1/2 bg-(--ink)" aria-hidden />
                <div className="relative rounded-2xl border-2 border-(--ink) bg-(--bg) p-6 pt-8 shadow-[6px_6px_0_0_var(--ink)]">
                  <span className="absolute left-1/2 top-3 size-3 -translate-x-1/2 rounded-full border-2 border-(--ink) bg-(--accent)" />
                  <p className="text-3xl font-extrabold tracking-tight">{v.label}</p>
                  <p className="mt-2 text-(--muted)">{v.body}</p>
                  <p className="mt-4 border-t-2 border-dashed border-(--ink)/30 pt-3 font-mono text-xs font-semibold uppercase tracking-wide">
                    {v.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety: hazard tape */}
      <section className="bg-(--ink) text-(--bg)">
        <div className="h-3.5 bg-[repeating-linear-gradient(-45deg,var(--accent)_0_14px,var(--ink)_14px_28px)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-5 px-5 py-12 sm:grid-cols-[auto_1fr]">
          <TriangleAlert className="size-12 text-(--accent)" strokeWidth={2.2} />
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Gas smell? Sparks? We&apos;ll tell you to stop.</h3>
            <p className="mt-2 max-w-2xl text-(--bg)/70">
              Water near wiring, a sagging ceiling or a CO alarm go straight to &ldquo;stop and call a pro now,&rdquo; with
              what to do in the meantime. We never claim certainty from a photo alone.
            </p>
          </div>
        </div>
        <div className="h-3.5 bg-[repeating-linear-gradient(-45deg,var(--accent)_0_14px,var(--ink)_14px_28px)]" />
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-20 text-center">
        <h2 className="t-reveal mx-auto max-w-3xl text-balance text-[2.5rem] font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-7xl">
          Got a drip, a crack, or a weird noise?
        </h2>
        <div className="mt-9 flex justify-center">
          <PressButton>Diagnose my problem</PressButton>
        </div>
        <p className="mt-5 text-sm font-medium text-(--muted)">Your first diagnosis is free. No account needed.</p>
      </section>

      <footer className="border-t-2 border-(--ink)">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-6 font-mono text-[11px] leading-relaxed text-(--muted)">
          HOME DOCTOR · General guidance, not a substitute for a licensed professional. Safety escalations are there for
          a reason.
        </div>
      </footer>
    </div>
  );
}
