import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";

import { BreakerPanelArt, FaucetArt, WaterHeaterArt } from "@/components/templates/illustrations";
import { PhoneResult } from "@/components/templates/phone-result";
import { cn, cssVars } from "@/lib/utils";

export const metadata: Metadata = { title: "Template: Cobalt" };

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });

const theme = cssVars({
  "--bg": "#F5F1E8",
  "--ink": "#11131A",
  "--muted": "#585C68",
  "--line": "#DED8CA",
  "--accent": "#2447F5",
  "--accent-ink": "#FFFFFF",
  "--accent-soft": "#E3E8FF",
  "--ill-ink": "#11131A",
  "--ill-paper": "#FFFDF8",
  "--ill-soft": "#C8D2FF",
  "--ill-accent": "#2447F5",
});

const TICKER = [
  "Dripping faucet",
  "Running toilet",
  "Tripping breaker",
  "Drywall crack",
  "Noisy water heater",
  "Mold spot",
  "Sticking door",
  "Clogged gutter",
  "Dead outlet",
  "Furnace short-cycling",
];

const EXAMPLES = [
  {
    Art: FaucetArt,
    said: "“The kitchen faucet won't stop dripping.”",
    answer: "Worn cartridge. A $12 part.",
    detail: "A 30-minute swap with a screwdriver and a wrench. A plumber would charge about $150–$300.",
    verdict: "DIY",
  },
  {
    Art: WaterHeaterArt,
    said: "“It pops and rumbles when it heats up.”",
    answer: "Sediment buildup. Flush it yourself.",
    detail: "A garden hose and an hour. Skipping it shortens the tank's life by years.",
    verdict: "DIY if handy",
  },
  {
    Art: BreakerPanelArt,
    said: "“The kitchen breaker trips every morning.”",
    answer: "Overloaded circuit. Call an electrician.",
    detail: "Here's exactly what to tell them, so a $200 fix doesn't turn into a new panel.",
    verdict: "Call a pro",
  },
];

function CtaButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Link
      href="/diagnose"
      className={cn(
        "group inline-flex h-14 items-center gap-4 rounded-full bg-(--accent) pl-7 pr-2 text-[17px] font-medium text-(--accent-ink) shadow-[0_10px_24px_-12px_var(--accent)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-14px_var(--accent)] active:translate-y-0 active:scale-[0.97]",
        className
      )}
    >
      {children}
      <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export default function CobaltTemplate() {
  return (
    <div style={theme} className="min-h-screen overflow-x-clip bg-(--bg) text-(--ink) selection:bg-(--accent) selection:text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:py-5">
        <Link href="/templates/cobalt" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-(--accent)" />
          <span className={cn(serif.className, "text-[26px] leading-none")}>Home Doctor</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#how" className="hidden text-(--muted) transition-colors hover:text-(--ink) sm:inline">
            How it works
          </a>
          <Link href="/login" className="font-medium underline-offset-4 hover:underline">
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-3 lg:grid-cols-[1.2fr_0.8fr] lg:pb-24 lg:pt-10">
        <div>
          <p className="t-rise inline-flex items-center gap-2 rounded-full border border-(--line) bg-white/60 px-3 py-1 text-sm text-(--muted)">
            <span className="size-1.5 rounded-full bg-(--accent)" /> First diagnosis free · no signup
          </p>
          <h1
            className={cn(serif.className, "t-rise mt-5 text-[2.9rem] leading-[0.93] tracking-[-0.015em] sm:text-7xl lg:text-[6.1rem]")}
            style={cssVars({ "--d": "80ms" })}
          >
            Point your phone at the problem.{" "}
            <span className="italic text-(--accent)">Know what&apos;s wrong in 30&nbsp;seconds.</span>
          </h1>
          <p
            className="t-rise mt-4 max-w-xl text-base leading-relaxed text-(--muted) sm:mt-6 sm:text-lg"
            style={cssVars({ "--d": "160ms" })}
          >
            Home Doctor tells you what it is, whether you can fix it yourself, what parts to buy, and what a pro should
            charge.
          </p>
          <div className="t-rise mt-6 flex flex-col items-start gap-3 sm:mt-8 sm:gap-4" style={cssVars({ "--d": "240ms" })}>
            <CtaButton>Diagnose my problem</CtaButton>
            <p className="max-w-sm text-sm leading-relaxed text-(--muted)">
              <strong className="font-semibold text-(--ink)">Why now:</strong> a plumber&apos;s visit can easily run
              $150+. Find out first if it&apos;s a $12 part you can swap yourself.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-[252px]">
          <div className="t-float" style={cssVars({ "--r": "-2deg" })}>
            <PhoneResult />
          </div>
          {/* Annotation stickers: pinned to the phone's edges where there's room, a row below it on phones. */}
          <span className="absolute -left-28 top-28 hidden -rotate-6 rounded-full bg-(--ink) px-3 py-1.5 text-xs font-medium text-(--bg) shadow-lg sm:inline-block">
            How urgent is it?
          </span>
          <span className="absolute -right-24 top-[58%] hidden rotate-[5deg] rounded-full bg-(--accent) px-3 py-1.5 text-xs font-medium text-white shadow-lg sm:inline-block">
            Parts + prices
          </span>
          <span className="absolute -left-36 bottom-14 hidden -rotate-3 rounded-full border border-(--line) bg-white px-3 py-1.5 text-xs font-medium shadow-lg sm:inline-block">
            What a pro should charge
          </span>
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:hidden">
            <span className="-rotate-3 rounded-full bg-(--ink) px-3 py-1.5 text-xs font-medium text-(--bg)">How urgent</span>
            <span className="rotate-2 rounded-full bg-(--accent) px-3 py-1.5 text-xs font-medium text-white">Parts + prices</span>
            <span className="-rotate-1 rounded-full border border-(--line) bg-white px-3 py-1.5 text-xs font-medium">Fair pro price</span>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y border-(--line) bg-white/50 py-3" aria-hidden>
        <div className="t-marquee flex w-max gap-8 whitespace-nowrap text-sm text-(--muted)">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              {item} <span className="size-1 rounded-full bg-(--accent)" />
            </span>
          ))}
        </div>
      </div>

      {/* Three questions */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className={cn(serif.className, "t-reveal text-[2.6rem] leading-[1.02] sm:text-6xl")}>
            Three questions.
            <br />
            <span className="italic text-(--muted)">Answered before you call anyone.</span>
          </h2>
          <ol className="divide-y divide-(--line) border-y border-(--line)">
            {[
              ["What is it?", "The most likely cause from your photos, what else it could be, and a quick check to tell them apart."],
              ["Can I fix it myself?", "DIY, DIY-if-handy, or call a pro. With steps, tools, and parts with real prices."],
              ["What should it cost?", "A typical price range for a pro, and the exact words to use so you don't get upsold."],
            ].map(([title, body], i) => (
              <li key={title} className="t-reveal grid grid-cols-[3.5rem_1fr] gap-2 py-6">
                <span className={cn(serif.className, "text-3xl italic leading-none text-(--accent)")}>0{i + 1}</span>
                <div>
                  <p className="text-lg font-semibold">{title}</p>
                  <p className="mt-1 leading-relaxed text-(--muted)">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Full-color band */}
      <section className="bg-(--accent) text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <p className="text-sm uppercase tracking-[0.22em] text-white/70">The math</p>
          <p className={cn(serif.className, "t-reveal mt-5 text-[2.9rem] leading-[1.02] sm:text-7xl")}>
            A service call can run <span className="italic">$150+.</span>
            <br />A faucet cartridge costs <span className="italic">$12.</span>
          </p>
          <p className="mt-6 max-w-lg text-lg text-white/80">Know which one you need before anyone knocks on your door.</p>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/25 pt-8">
            {[
              ["30s", "to a straight answer"],
              ["1–3", "photos is all it takes"],
              ["$0", "for your first one"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className={cn(serif.className, "text-4xl sm:text-6xl")}>{value}</dt>
                <dd className="mt-1 text-sm text-white/75">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Examples */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className={cn(serif.className, "text-[2.6rem] leading-none sm:text-6xl")}>
            From the <span className="italic">field guide</span>
          </h2>
          <p className="hidden max-w-xs text-sm text-(--muted) sm:block">Straight answers to the problems we see most.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EXAMPLES.map(({ Art, said, answer, detail, verdict }) => (
            <article
              key={answer}
              className="t-reveal group overflow-hidden rounded-3xl border border-(--line) bg-[#FFFDF8] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_44px_-28px_rgba(17,19,26,0.45)]"
            >
              <div className="aspect-[6/5] bg-(--accent-soft) p-8">
                <Art className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
              </div>
              <div className="space-y-3 p-6">
                <p className={cn(serif.className, "text-2xl leading-tight")}>{said}</p>
                <div className="h-px bg-(--line)" />
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--accent)">Home Doctor says</p>
                <p className="text-lg font-semibold leading-snug">{answer}</p>
                <p className="text-sm leading-relaxed text-(--muted)">{detail}</p>
                <span className="inline-block rounded-full border border-(--ink) px-3 py-1 text-xs font-semibold">
                  {verdict}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Safety */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="t-reveal grid gap-5 rounded-3xl bg-(--ink) p-8 text-(--bg) sm:grid-cols-[auto_1fr] sm:p-10">
          <ShieldAlert className="size-9 text-[#8FA2FF]" />
          <div>
            <h3 className={cn(serif.className, "text-3xl sm:text-4xl")}>Safety first. Every time.</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-(--bg)/75">
              Gas smell, sparking, water near wiring, a sagging ceiling, a carbon monoxide alarm: Home Doctor tells you
              to stop and call a pro, and what to do in the meantime. It never claims certainty from a photo alone.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-10 text-center">
        <h2 className={cn(serif.className, "t-reveal text-[3.2rem] leading-[0.95] sm:text-8xl")}>
          Stop guessing.
          <br />
          <span className="italic text-(--accent)">Start with a photo.</span>
        </h2>
        <div className="mt-9 flex justify-center">
          <CtaButton>Diagnose my problem</CtaButton>
        </div>
        <p className="mt-4 text-sm text-(--muted)">Your first diagnosis is free. No account needed.</p>
      </section>

      <footer className="border-t border-(--line)">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-8 text-xs leading-relaxed text-(--muted)">
          <p>
            <span className={cn(serif.className, "mr-2 text-base text-(--ink)")}>Home Doctor</span>
            General guidance, not a substitute for a licensed professional. Safety escalations are there for a reason.
          </p>
        </div>
      </footer>
    </div>
  );
}
