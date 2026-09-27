import { CreditCard } from "lucide-react";

import { openBillingPortal } from "@/app/(site)/billing/actions";
import { ChargeNote, formatDay, pickerModeFor } from "@/components/billing/access-ui";
import { PendingButton } from "@/components/billing/pending-button";
import { PlanPicker } from "@/components/billing/plan-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Access } from "@/lib/access";
import { planForInterval } from "@/lib/plans";

function PlanSummary({ access }: { access: Access }) {
  if (access.kind === "trial") {
    return (
      <>
        <p className="font-display text-2xl font-semibold">Free trial</p>
        <p className="text-muted-foreground">
          {access.daysLeft === 1 ? "1 day" : `${access.daysLeft} days`} left. Ends {formatDay(access.endsAt)}.
        </p>
      </>
    );
  }
  if (access.kind === "subscribed") {
    const sub = access.subscription;
    const plan = planForInterval(sub.plan_interval);
    const endsAt = sub.cancel_at ?? (sub.cancel_at_period_end ? sub.current_period_end : null);
    const billingStarts = sub.status === "trialing" && sub.trial_end ? new Date(sub.trial_end) : null;
    return (
      <>
        <p className="font-display text-2xl font-semibold">
          {plan ? `${plan.label} · ${plan.priceLabel}` : "Home Doctor subscription"}
        </p>
        <p className="text-muted-foreground">
          {endsAt
            ? `Cancels on ${formatDay(new Date(endsAt))}. You have full access until then.`
            : billingStarts
              ? `First charge on ${formatDay(billingStarts)}, when your free trial ends.`
              : sub.current_period_end
                ? `Renews on ${formatDay(new Date(sub.current_period_end))}.`
                : "Active."}
        </p>
      </>
    );
  }
  return (
    <>
      <p className="font-display text-2xl font-semibold">
        {access.hadSubscription ? "Subscription ended" : "Free trial ended"}
      </p>
      <p className="text-muted-foreground">
        {access.endedAt ? `Ended ${formatDay(access.endedAt)}. ` : ""}Your history is still here. Pick a plan to keep going.
      </p>
    </>
  );
}

/** The plan card on /account: status, the plans (if not subscribed), and the billing portal. */
export function AccountPlan({ access }: { access: Access }) {
  const { mode, currentPlan } = pickerModeFor(access);
  const hasBilling = access.kind === "subscribed" || (access.kind === "expired" && access.hadSubscription);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <PlanSummary access={access} />
        </div>
        {access.kind !== "subscribed" && (
          <div className="space-y-3">
            <PlanPicker mode={mode} currentPlan={currentPlan?.id} />
            <ChargeNote access={access} />
          </div>
        )}
        {hasBilling && (
          <form action={openBillingPortal}>
            <PendingButton variant="outline" size="lg" className="rounded-full" pendingLabel="Opening billing…">
              <CreditCard className="size-4" /> Manage billing
            </PendingButton>
            <p className="mt-2 text-xs text-muted-foreground">Change plan, update your card, see invoices, or cancel.</p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
