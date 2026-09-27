import { Bricolage_Grotesque, Fraunces, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const grotesk = Bricolage_Grotesque({ subsets: ["latin"] });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT"] });

const OPTIONS = [
  {
    slug: "cobalt",
    name: "Cobalt",
    vibe: "Field Guide",
    accent: "#2447F5",
    accentInk: "#FFFFFF",
    bg: "#F5F1E8",
    ink: "#11131A",
    font: serif.className,
    fontName: "Instrument Serif",
    fontStyle: undefined,
    sample: (
      <>
        Know what&apos;s wrong in <em>30 seconds.</em>
      </>
    ),
    sampleClass: "text-[2.6rem] leading-[0.95]",
    points: [
      "Editorial and calm: big serif headlines, lots of air",
      "Centerpiece: the real result screen in a phone, with annotation stickers",
      "Full-cobalt “the math” band, illustrated field-guide cards, problem ticker",
    ],
  },
  {
    slug: "orange",
    name: "Orange",
    vibe: "Workbench",
    accent: "#FF5A1F",
    accentInk: "#1A1714",
    bg: "#F3EEE4",
    ink: "#1A1714",
    font: grotesk.className,
    fontName: "Bricolage Grotesque",
    fontStyle: undefined,
    sample: <>Know what&apos;s wrong in 30 seconds.</>,
    sampleClass: "text-[2.2rem] font-extrabold leading-[0.92] tracking-[-0.04em]",
    points: [
      "Hardware-store energy: chunky type, hard shadows, price tags",
      "Centerpiece: a tappable house cutaway. Tap a spot, get the verdict",
      "Itemized “diagnosis receipt”, full-orange verdict tags, hazard-tape safety strip",
    ],
  },
  {
    slug: "green",
    name: "Green",
    vibe: "House Call",
    accent: "#0C7D4C",
    accentInk: "#FFFFFF",
    bg: "#F4F1E9",
    ink: "#13201A",
    font: fraunces.className,
    fontName: "Fraunces",
    fontStyle: { fontVariationSettings: '"SOFT" 100' },
    sample: (
      <>
        Know what&apos;s wrong in <em>30 seconds.</em>
      </>
    ),
    sampleClass: "text-[2.3rem] font-semibold leading-[1]",
    points: [
      "Warm and reassuring: soft serif, rounded shapes, a doctor's-visit feel",
      "Centerpiece: a photo being scanned that turns into a diagnosis chart",
      "Tappable symptom chips, full-green triage scale, example case cards",
    ],
  },
];

export default function TemplatesIndex() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 pb-32 pt-10 text-[#16181D]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45">Home Doctor · design directions</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Pick a direction</h1>
        <p className="mt-3 max-w-2xl text-lg text-black/60">
          Three full landing pages with the same copy and product, each built around one strong color. Open one, scroll
          it on your phone, and tap things. The buttons and animations are real. Tell me which one to roll out across
          the app (or mix: &ldquo;Orange hero, Green fonts&rdquo;).
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/templates/${o.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(0,0,0,0.45)] active:scale-[0.99]"
            >
              <div className="relative p-6 pb-8" style={{ background: o.bg, color: o.ink }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{o.vibe}</span>
                  <span className="size-4 rounded-full" style={{ background: o.accent }} />
                </div>
                <p className={cn(o.font, o.sampleClass, "mt-6")} style={o.fontStyle}>
                  {o.sample}
                </p>
                <span
                  className="mt-6 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1"
                  style={{ background: o.accent, color: o.accentInk }}
                >
                  Diagnose my problem
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">{o.name}</p>
                  <ArrowUpRight className="size-5 text-black/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
                </div>
                <p className="text-sm text-black/50">
                  {o.fontName} + Geist · {o.accent}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-black/70">
                  {o.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: o.accent }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-black/50">
          For comparison, the current site is at{" "}
          <Link href="/" className="font-medium text-black underline underline-offset-4">
            the homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
