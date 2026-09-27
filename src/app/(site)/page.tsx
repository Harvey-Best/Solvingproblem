import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Droplets,
  Flame,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

import { TrackOnMount } from "@/components/track-on-mount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DIY_VERDICT_META, SEVERITY_META, type DiyVerdict, type Severity } from "@/lib/diagnosis-meta";
import { cn } from "@/lib/utils";

const EXAMPLES: {
  icon: typeof Droplets;
  tint: string;
  problem: string;
  said: string;
  answer: string;
  detail: string;
  severity: Severity;
  verdict: DiyVerdict;
}[] = [
  {
    icon: Droplets,
    tint: "from-sky-100 to-sky-50 text-sky-700",
    problem: "Leaky faucet",
    said: "“Kitchen faucet won't stop dripping.”",
    answer: "Worn cartridge → $12 part",
    detail: "30-minute swap with a screwdriver and a wrench. A plumber would charge about $150–$300.",
    severity: "fix_soon",
    verdict: "diy",
  },
  {
    icon: Flame,
    tint: "from-amber-100 to-amber-50 text-amber-700",
    problem: "Noisy water heater",
    said: "“It pops and rumbles when it heats up.”",
    answer: "Sediment buildup → flush it yourself",
    detail: "A garden hose and an hour. Skipping it shortens the tank's life.",
    severity: "fix_soon",
    verdict: "diy_if_handy",
  },
  {
    icon: Zap,
    tint: "from-violet-100 to-violet-50 text-violet-700",
    problem: "Tripping breaker",
    said: "“The kitchen breaker trips every morning.”",
    answer: "Overloaded or failing circuit → call an electrician",
    detail: "Here's exactly what to tell them so you don't get upsold on a new panel.",
    severity: "urgent",
    verdict: "call_pro",
  },
];

const WHAT_YOU_GET = [
  "What it most likely is, and what else it could be",
  "How urgent it is, with safety warnings up front",
  "DIY, DIY-if-handy, or call a pro, and why",
  "Step-by-step fix, tools, and parts with prices",
  "What a pro should charge in your area (a range, not a guess)",
  "What to say to the pro so you don't get upsold",
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <TrackOnMount event="landing_view" />

      <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-10 sm:pt-16">
        <Badge variant="secondary" className="mb-5 gap-1.5 px-3 py-1 text-sm">
          <Sparkles className="size-3.5" /> First diagnosis free. No signup.
        </Badge>
        <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          Point your phone at the problem. Know what&apos;s wrong in 30 seconds.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted-foreground sm:text-xl">
          Home Doctor tells you what it is, whether you can fix it yourself, what parts to buy, and what a
          pro should charge.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="xl" className="w-full shadow-lg shadow-primary/20 sm:w-auto">
            <Link href="/diagnose">
              <Camera className="size-5" /> Diagnose my problem
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Takes 1–3 photos. Works for leaks, cracks, breakers, noises and more.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Real problems, straight answers
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <Card key={ex.problem} className="gap-0 overflow-hidden py-0">
              <div className={cn("flex items-center gap-3 bg-gradient-to-br p-4", ex.tint)}>
                <ex.icon className="size-8 shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide opacity-80">Before</p>
                  <p className="font-semibold text-foreground">{ex.problem}</p>
                  <p className="text-sm text-foreground/70">{ex.said}</p>
                </div>
              </div>
              <CardContent className="space-y-3 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">After</p>
                <p className="font-semibold leading-snug">{ex.answer}</p>
                <p className="text-sm text-muted-foreground">{ex.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={DIY_VERDICT_META[ex.verdict].className}>
                    {DIY_VERDICT_META[ex.verdict].label}
                  </Badge>
                  <Badge variant="outline" className={SEVERITY_META[ex.severity].className}>
                    {SEVERITY_META[ex.severity].label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid w-full max-w-3xl gap-8 px-4 py-12 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
            <ol className="mt-5 space-y-4">
              {[
                { icon: Camera, title: "Snap it", body: "Take 1–3 photos of the problem." },
                { icon: MessageSquareText, title: "Say what's going on", body: "Optional: a sentence about the noise, smell, or leak." },
                { icon: CheckCircle2, title: "Get a straight answer", body: "Cause, urgency, fix, parts, and fair price in about 30 seconds." },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">What you get</h2>
            <ul className="mt-5 space-y-2.5">
              {WHAT_YOU_GET.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
          <ShieldAlert className="size-6 shrink-0 text-red-600" />
          <div className="space-y-1.5">
            <h2 className="font-semibold text-red-950">Safety first, every time</h2>
            <p className="text-sm text-red-900/80">
              Gas smell, sparking, water near electrical, a sagging ceiling, or a carbon monoxide alarm? Home
              Doctor tells you to stop and call a pro, and what to do in the meantime. It will never tell you it&apos;s
              certain from a photo alone.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 text-center">
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Before you call someone, know what you&apos;re dealing with.
        </h2>
        <Button asChild size="xl" className="mt-6 w-full sm:w-auto">
          <Link href="/diagnose">
            Diagnose my problem <ArrowRight className="size-5" />
          </Link>
        </Button>
      </section>
    </main>
  );
}
