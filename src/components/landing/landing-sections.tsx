import Link from "next/link";
import { ArrowRight, Camera, ClipboardCheck, MessageSquareText, Plus } from "lucide-react";

import { GUIDES } from "@/lib/guides";
import { LANDING_FAQS } from "@/lib/seo";

/**
 * Landing sections that live inside HouseCallTemplate, so they use its theme
 * variables (--ink, --muted, --line, --accent, --accent-soft, --grad).
 */

const STEPS = [
  {
    Icon: Camera,
    title: "Snap it",
    body: "Take up to three photos. A close-up plus one wider shot works best.",
  },
  {
    Icon: MessageSquareText,
    title: "Tell us what's going on",
    body: "Optional, but a sentence helps: when it started, what it sounds or smells like, what you've tried.",
  },
  {
    Icon: ClipboardCheck,
    title: "Get the diagnosis",
    body: "Likely cause, how urgent, DIY or pro, steps, parts with prices, a fair pro price, and what to tell the pro.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="how-it-works" className="font-display text-[2.3rem] font-semibold leading-tight sm:text-5xl">
          How a house call works
        </h2>
        <p className="text-(--muted)">About 30 seconds, start to finish.</p>
      </div>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map(({ Icon, title, body }, i) => (
          <li
            key={title}
            className="t-reveal relative rounded-[1.75rem] border border-(--line) bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(19,32,26,0.5)]"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-(image:--grad) text-white">
                <Icon className="size-6" />
              </span>
              <span className="font-display text-5xl font-semibold text-(--accent-soft)" aria-hidden>
                {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">{title}</h3>
            <p className="mt-1.5 leading-relaxed text-(--muted)">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function GuidesTeaser() {
  return (
    <section aria-labelledby="guides" className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="guides" className="font-display text-[2.3rem] font-semibold leading-tight sm:text-5xl">
          Common problems, explained
        </h2>
        <Link
          href="/guides"
          className="tap-area group inline-flex items-center gap-1 font-semibold text-(--accent) transition-colors hover:text-(--ink)"
        >
          All guides <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.slug} className="t-reveal">
            <Link
              href={`/guides/${g.slug}`}
              className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-(--line) bg-white px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--accent) hover:shadow-[0_10px_20px_-12px_var(--accent)]"
            >
              <span>
                <span className="block font-semibold">{g.symptom}</span>
                <span className="mt-0.5 block text-sm text-(--muted)">Causes, costs, and when to call a pro</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-(--accent) transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq" className="mx-auto max-w-6xl px-5 pb-16 lg:pb-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div>
          <h2 id="faq" className="font-display text-[2.3rem] font-semibold leading-tight sm:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-3 max-w-sm text-(--muted)">
            The short version: a photo, 30 seconds, and an honest answer about how worried to be.
          </p>
        </div>
        <div className="divide-y divide-(--line) rounded-[1.75rem] border border-(--line) bg-white">
          {LANDING_FAQS.map(({ q, a }, i) => (
            <details key={q} className="group px-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold">
                <h3>{q}</h3>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-(--accent-soft) text-(--accent) transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="pb-5 pr-10 leading-relaxed text-(--muted)">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
