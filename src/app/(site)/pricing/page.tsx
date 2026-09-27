import Link from "next/link";
import { Camera, Check, CircleCheck } from "lucide-react";

import { ChargeNote, pickerModeFor } from "@/components/billing/access-ui";
import { PlanPicker } from "@/components/billing/plan-picker";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import type { Access } from "@/lib/access";
import { USER_PER_DAY } from "@/lib/allowance";
import { getAccess } from "@/lib/billing";
import { isBillingConfigured, isSupabaseConfigured } from "@/lib/env";
import { PLAN_FEATURES, PLANS, PLAN_IDS, TRIAL_DAYS, type PlanId } from "@/lib/plans";
import { faqPageJsonLd, graph, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getViewer } from "@/lib/viewer";

const DESCRIPTION = `Your first diagnosis is free, no account needed. Then a ${TRIAL_DAYS}-day free trial with no card, and ${PLANS.monthly.priceLabel} or ${PLANS.yearly.priceLabel} after that.`;

export const metadata = pageMetadata({ title: "Pricing", description: DESCRIPTION, path: "/pricing" });

const STEPS = [
  { title: "First diagnosis free", body: "No account, no card. Snap the problem and get the full answer." },
  { title: `${TRIAL_DAYS}-day free trial`, body: "Create an account to keep going. Full access for a week, still no card." },
  {
    title: "Keep going for less than a service call",
    body: `${PLANS.monthly.priceLabel} or ${PLANS.yearly.priceLabel}. Cancel anytime from your account.`,
  },
];

const PRICING_FAQS = [
  {
    q: "Do I need a card for the free trial?",
    a: `No. Creating an account starts a ${TRIAL_DAYS}-day free trial with full access, and nothing is charged unless you choose a plan.`,
  },
  {
    q: "What happens when my trial ends?",
    a: "Your diagnoses, quote checks and history stay saved. To run new ones, pick a plan.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account whenever you like. You keep access until the end of the period you've paid for.",
  },
  {
    q: "Is there a usage limit?",
    a: `Fair use is up to ${USER_PER_DAY} diagnoses and quote checks a day, which is far more than a house usually needs.`,
  },
];

const NOTICES: Record<string, string> = {
  canceled: "Checkout canceled. You haven't been charged.",
  checkout: "We couldn't open checkout. Please try again.",
  unavailable: "Checkout isn't available yet. Please try again soon.",
};

export default async function PricingPage(props: PageProps<"/pricing">) {
  const searchParams = await props.searchParams;
  const viewer = isSupabaseConfigured() ? await getViewer() : null;
  const access: Access | null = viewer?.userId ? await getAccess(viewer.userId) : null;
  const { mode, currentPlan } = pickerModeFor(access);
  const plan = PLAN_IDS.find((id) => id === searchParams.plan) as PlanId | undefined;
  const notice =
    searchParams.canceled === "1" ? NOTICES.canceled : typeof searchParams.error === "string" ? NOTICES[searchParams.error] : null;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
      <JsonLd data={graph(faqPageJsonLd(PRICING_FAQS, absoluteUrl("/pricing")))} />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
      <h1 className="mt-3 text-balance font-display text-[2.4rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl">
        Try it free. Keep it for less than a service call.
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{DESCRIPTION}</p>

      {notice && <p className="mt-5 rounded-xl border bg-card p-3 text-sm">{notice}</p>}
      {access?.kind === "expired" && isBillingConfigured() && (
        <p className="mt-5 rounded-xl border border-primary/20 bg-secondary p-3 text-sm text-secondary-foreground">
          {access.hadSubscription ? "Your subscription has ended." : "Your free trial has ended."} Pick a plan to keep
          going. Your history is still saved.
        </p>
      )}

      <div className="mt-8 space-y-3">
        <PlanPicker mode={mode} currentPlan={currentPlan?.id} highlight={plan ?? "yearly"} />
        <ChargeNote access={access} />
        {access?.kind === "subscribed" && (
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/account">Manage your subscription</Link>
          </Button>
        )}
      </div>

      {!viewer?.userId && (
        <div className="mt-6 flex flex-col items-start gap-2 rounded-3xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px]">
            <strong>Not sure yet?</strong> Your first diagnosis is free, no account needed.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/diagnose">
              <Camera className="size-5" /> Diagnose my problem
            </Link>
          </Button>
        </div>
      )}

      <section aria-labelledby="included" className="mt-12">
        <h2 id="included" className="font-display text-2xl font-semibold">
          Every plan includes
        </h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {PLAN_FEATURES.map((f) => (
            <li key={f} className="flex gap-2.5 text-[15px]">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" /> {f}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-trial-works" className="mt-12">
        <h2 id="how-trial-works" className="font-display text-2xl font-semibold">
          How the free trial works
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border bg-card p-4">
              <span className="grid size-8 place-items-center rounded-full bg-(image:--grad) text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pricing-faq" className="mt-12">
        <h2 id="pricing-faq" className="font-display text-2xl font-semibold">
          Questions
        </h2>
        <div className="mt-4 divide-y rounded-2xl border bg-card">
          {PRICING_FAQS.map((f) => (
            <div key={f.q} className="p-4">
              <h3 className="flex items-start gap-2 font-semibold">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f.q}
              </h3>
              <p className="mt-1.5 pl-6 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
