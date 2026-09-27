import { Bricolage_Grotesque, Fraunces, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

import { cn } from "@/lib/utils";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const grotesk = Bricolage_Grotesque({ subsets: ["latin"] });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT"] });

type Option = {
  slug: string;
  name: string;
  vibe: string;
  /** A color or a CSS gradient. */
  paint: string;
  paintInk: string;
  bg: string;
  ink: string;
  font: string;
  fontName: string;
  fontStyle?: React.CSSProperties;
  sampleClass: string;
  italicAccent: boolean;
  points: string[];
  favorite?: boolean;
};

const SOLID: Option[] = [
  {
    slug: "cobalt",
    name: "Cobalt",
    vibe: "Field Guide",
    paint: "#2447F5",
    paintInk: "#FFFFFF",
    bg: "#F5F1E8",
    ink: "#11131A",
    font: serif.className,
    fontName: "Instrument Serif",
    sampleClass: "text-[2.6rem] leading-[0.95]",
    italicAccent: true,
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
    paint: "#FF5A1F",
    paintInk: "#1A1714",
    bg: "#F3EEE4",
    ink: "#1A1714",
    font: grotesk.className,
    fontName: "Bricolage Grotesque",
    sampleClass: "text-[2.2rem] font-extrabold leading-[0.92] tracking-[-0.04em]",
    italicAccent: false,
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
    paint: "#0C7D4C",
    paintInk: "#FFFFFF",
    bg: "#F4F1E9",
    ink: "#13201A",
    font: fraunces.className,
    fontName: "Fraunces",
    fontStyle: { fontVariationSettings: '"SOFT" 100' },
    sampleClass: "text-[2.3rem] font-semibold leading-[1]",
    italicAccent: true,
    favorite: true,
    points: [
      "Warm and reassuring: soft serif, rounded shapes, a doctor's-visit feel",
      "Centerpiece: a photo being scanned that turns into a diagnosis chart",
      "Tappable symptom chips, full-green triage scale, example case cards",
    ],
  },
];

const houseCallGradient = (
  slug: string,
  name: string,
  paint: string,
  bg: string,
  ink: string,
  points: string[]
): Option => ({
  slug,
  name,
  vibe: "House Call · gradient",
  paint,
  paintInk: "#FFFFFF",
  bg,
  ink,
  font: fraunces.className,
  fontName: "Fraunces",
  fontStyle: { fontVariationSettings: '"SOFT" 100' },
  sampleClass: "text-[2.3rem] font-semibold leading-[1]",
  italicAccent: true,
  points,
});

const GRADIENT: Option[] = [
  houseCallGradient(
    "green-gradient",
    "Green Glow",
    "linear-gradient(120deg, #1F8A3B, #0C7D4C, #0B7F7A)",
    "#F4F1E9",
    "#13201A",
    [
      "Your favorite layout, with green-to-teal gradients",
      "Soft color glows behind the hero and the closing panel",
      "Gradient button that slides on hover, gradient triage band",
    ]
  ),
  houseCallGradient(
    "purple",
    "Purple",
    "linear-gradient(120deg, #7C3AED, #5B45E6, #2563EB)",
    "#F5F2EC",
    "#1C1631",
    [
      "Violet into blue: the most “tech” of the set",
      "Same House Call layout, so it's a pure color comparison",
      "Lavender glows, violet-to-blue triage band",
    ]
  ),
  houseCallGradient(
    "blue",
    "Blue",
    "linear-gradient(120deg, #1D4ED8, #0369A1, #0E7490)",
    "#F4F2EC",
    "#0E1B2C",
    [
      "Royal blue into deep cyan: calm, trustworthy, clean",
      "Reads as “water and utilities” for plumbing-heavy traffic",
      "Sky and aqua glows, blue-to-cyan triage band",
    ]
  ),
];

function OptionCard({ o }: { o: Option }) {
  const isGradient = o.paint.startsWith("linear-gradient");
  return (
    <Link
      href={`/templates/${o.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(0,0,0,0.45)] active:scale-[0.99]"
    >
      <div className="relative isolate overflow-hidden p-6 pb-8" style={{ background: o.bg, color: o.ink }}>
        {isGradient && (
          <div
            aria-hidden
            className="absolute -right-16 -top-20 -z-10 size-56 rounded-full opacity-30 blur-2xl"
            style={{ background: o.paint }}
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{o.vibe}</span>
          <span className="size-4 rounded-full" style={{ background: o.paint }} />
        </div>
        <p className={cn(o.font, o.sampleClass, "mt-6")} style={o.fontStyle}>
          Know what&apos;s wrong in{" "}
          {o.italicAccent ? (
            <em
              className={cn(isGradient && "bg-clip-text pr-[0.1em] text-transparent")}
              style={isGradient ? { backgroundImage: o.paint } : undefined}
            >
              30 seconds.
            </em>
          ) : (
            "30 seconds."
          )}
        </p>
        <span
          className="mt-6 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1"
          style={{ background: o.paint, color: o.paintInk }}
        >
          Diagnose my problem
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xl font-bold">
            {o.name}
            {o.favorite && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                <Heart className="size-3 fill-current" /> Your favorite
              </span>
            )}
          </p>
          <ArrowUpRight className="size-5 shrink-0 text-black/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
        </div>
        <p className="text-sm text-black/50">{o.fontName} + Geist</p>
        <ul className="mt-4 space-y-2 text-sm text-black/70">
          {o.points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: o.paint }} />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default function TemplatesIndex() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] px-5 pb-32 pt-10 text-[#16181D]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/45">Home Doctor · design directions</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Pick a direction</h1>
        <p className="mt-3 max-w-2xl text-lg text-black/60">
          Full landing pages with the same copy and product. Open one, scroll it on your phone, and tap things. The
          buttons and animations are real. Tell me which one to roll out across the app, or mix and match.
        </p>

        <h2 className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">One strong color</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {SOLID.map((o) => (
            <OptionCard key={o.slug} o={o} />
          ))}
        </div>

        <h2 className="mt-14 text-sm font-semibold uppercase tracking-[0.18em] text-black/45">
          Gradients · on the Green “House Call” layout
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {GRADIENT.map((o) => (
            <OptionCard key={o.slug} o={o} />
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
