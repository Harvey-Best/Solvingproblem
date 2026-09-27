import Link from "next/link";
import { AlertTriangle, Clock, History } from "lucide-react";

import { PlanPicker, type PlanPickerMode } from "@/components/billing/plan-picker";
import { Button } from "@/components/ui/button";
import { checkoutTrialEnd, type Access } from "@/lib/access";
import { isBillingConfigured } from "@/lib/env";
import { planForInterval } from "@/lib/plans";

/** "Friday, October 2", plus the year when it isn't this year (yearly renewals). */
export function formatDay(date: Date, now = new Date()): string {
  const otherYear = date.getUTCFullYear() !== now.getUTCFullYear();
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(otherYear ? { year: "numeric" as const } : {}),
    timeZone: "America/New_York",
  });
}

/** Which buttons the plan cards show for this viewer. `access` is null when signed out. */
export function pickerModeFor(access: Access | null): { mode: PlanPickerMode; currentPlan: ReturnType<typeof planForInterval> } {
  if (access?.kind === "subscribed") {
    return { mode: "current", currentPlan: planForInterval(access.subscription.plan_interval) };
  }
  // The free trial needs no Stripe, so signed-out visitors can always start one.
  if (!access) return { mode: "signup", currentPlan: null };
  return { mode: isBillingConfigured() ? "checkout" : "disabled", currentPlan: null };
}

/** One line under the plans explaining when the card is charged. */
export function ChargeNote({ access }: { access: Access | null }) {
  if (access?.kind !== "trial") return null;
  const deferred = checkoutTrialEnd(access.endsAt);
  return (
    <p className="text-sm text-muted-foreground">
      {deferred
        ? `Subscribe now and you won't be charged until your trial ends on ${formatDay(access.endsAt)}.`
        : "Your trial ends soon, so billing starts when you subscribe."}
    </p>
  );
}

/** Small status line for pages behind the paywall. Renders nothing for paying customers in good standing. */
export function TrialStatus({ access }: { access: Access | undefined }) {
  if (!access || !isBillingConfigured()) return null;
  if (access.kind === "trial") {
    return (
      <p className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-secondary px-3.5 py-1.5 text-sm text-secondary-foreground">
        <Clock className="size-4 shrink-0" />
        <span>
          Free trial: <strong>{access.daysLeft === 1 ? "1 day" : `${access.daysLeft} days`} left</strong>
        </span>
        <Link href="/pricing" className="tap-area font-semibold underline underline-offset-2">
          See plans
        </Link>
      </p>
    );
  }
  if (access.kind === "subscribed" && access.pastDue) {
    return (
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1.5 text-sm text-amber-950">
        <AlertTriangle className="size-4 shrink-0" /> Your last payment didn&apos;t go through.
        <Link href="/account" className="tap-area shrink-0 font-semibold underline underline-offset-2">
          Update card
        </Link>
      </p>
    );
  }
  return null;
}

const PAYWALL_COPY = {
  diagnosis: "Pick a plan to keep diagnosing.",
  quote: "Pick a plan to keep checking quotes.",
};

/** Shown instead of the diagnose / quote form once the trial (or subscription) has ended. */
export function Paywall({ access, kind }: { access: Access; kind: keyof typeof PAYWALL_COPY }) {
  const ended = access.kind === "expired" ? access.endedAt : null;
  const hadSubscription = access.kind === "expired" && access.hadSubscription;
  const { mode, currentPlan } = pickerModeFor(access);
  return (
    <section className="mt-6 space-y-5" aria-labelledby="paywall">
      <div className="rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5 sm:p-6">
        <h2 id="paywall" className="font-display text-2xl font-semibold leading-tight">
          {hadSubscription ? "Your subscription has ended" : "Your free trial has ended"}
        </h2>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          {ended ? `It ended on ${formatDay(ended)}. ` : ""}
          {PAYWALL_COPY[kind]} Everything you&apos;ve done so far is still saved.
        </p>
      </div>
      <PlanPicker mode={mode} currentPlan={currentPlan?.id} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>Cancel anytime. Plans renew automatically.</p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/history">
            <History className="size-4" /> Your history
          </Link>
        </Button>
      </div>
    </section>
  );
}
