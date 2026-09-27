import Link from "next/link";
import { Check } from "lucide-react";

import { startCheckout } from "@/app/(site)/billing/actions";
import { PendingButton } from "@/components/billing/pending-button";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_IDS, TRIAL_DAYS, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/**
 * The two plans side by side. What the buttons do depends on who's looking:
 *  - checkout: signed in, sends them to Stripe Checkout
 *  - signup:   anonymous, starts the free trial via sign-in
 *  - current:  already subscribed to `currentPlan`
 *  - disabled: Stripe isn't configured yet
 */
export type PlanPickerMode = "checkout" | "signup" | "current" | "disabled";

export function PlanPicker({
  mode,
  currentPlan,
  highlight = "yearly",
}: {
  mode: PlanPickerMode;
  currentPlan?: PlanId | null;
  highlight?: PlanId;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PLAN_IDS.map((id) => {
        const plan = PLANS[id];
        const featured = id === highlight;
        const isCurrent = mode === "current" && currentPlan === id;
        return (
          <div
            key={id}
            className={cn(
              "relative flex flex-col rounded-3xl border bg-card p-5 transition-all duration-300",
              featured && "border-primary/50 shadow-[0_24px_40px_-28px_var(--primary)]"
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-5 rounded-full bg-(image:--grad) px-3 py-1 text-xs font-semibold text-white">
                Best value
              </span>
            )}
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{plan.label}</p>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold tracking-tight">${plan.price}</span>
              <span className="text-muted-foreground">/{plan.interval}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.note}</p>
            <div className="mt-5 pt-1">
              {mode === "checkout" && (
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value={id} />
                  <PendingButton
                    size="lg"
                    variant={featured ? "default" : "outline"}
                    className="w-full rounded-full"
                    pendingLabel="Opening checkout…"
                  >
                    Choose {plan.label.toLowerCase()}
                  </PendingButton>
                </form>
              )}
              {mode === "signup" && (
                <Button asChild size="lg" variant={featured ? "default" : "outline"} className="w-full rounded-full">
                  <Link href={`/login?reason=trial&next=${encodeURIComponent(`/pricing?plan=${id}`)}`}>
                    Start {TRIAL_DAYS}-day free trial
                  </Link>
                </Button>
              )}
              {mode === "current" &&
                (isCurrent ? (
                  <p className="flex h-12 items-center justify-center gap-2 rounded-full bg-secondary font-semibold text-secondary-foreground">
                    <Check className="size-4" /> Your plan
                  </p>
                ) : (
                  <p className="flex h-12 items-center justify-center text-sm text-muted-foreground">
                    Switch plans in Manage billing
                  </p>
                ))}
              {mode === "disabled" && (
                <Button size="lg" variant="outline" className="w-full rounded-full" disabled>
                  Checkout coming soon
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
