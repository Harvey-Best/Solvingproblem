import { notFound } from "next/navigation";

import { AccountPlan } from "@/components/billing/account-plan";
import { Paywall, TrialStatus } from "@/components/billing/access-ui";
import type { Access, SubscriptionRow } from "@/lib/access";

const DAY = 24 * 60 * 60 * 1000;

function sampleSub(overrides: Partial<SubscriptionRow>): SubscriptionRow {
  return {
    id: "sub_dev",
    status: "active",
    plan_interval: "year",
    trial_end: null,
    current_period_end: new Date(Date.now() + 200 * DAY).toISOString(),
    cancel_at_period_end: false,
    cancel_at: null,
    canceled_at: null,
    created_at: new Date(Date.now() - 20 * DAY).toISOString(),
    ...overrides,
  };
}

function sampleAccess(state: string): Access {
  switch (state) {
    case "expired":
      return { kind: "expired", endedAt: new Date(Date.now() - 2 * DAY), hadSubscription: false };
    case "canceled":
      return { kind: "expired", endedAt: new Date(Date.now() - 5 * DAY), hadSubscription: true };
    case "subscribed":
      return { kind: "subscribed", subscription: sampleSub({}), pastDue: false };
    case "canceling":
      return {
        kind: "subscribed",
        subscription: sampleSub({ plan_interval: "month", cancel_at_period_end: true, current_period_end: new Date(Date.now() + 12 * DAY).toISOString() }),
        pastDue: false,
      };
    case "pastdue":
      return { kind: "subscribed", subscription: sampleSub({ status: "past_due", plan_interval: "month" }), pastDue: true };
    default:
      return { kind: "trial", endsAt: new Date(Date.now() + 4.5 * DAY), daysLeft: 5 };
  }
}

/** Dev-only preview of billing states: /dev/billing?state=trial|expired|canceled|subscribed|canceling|pastdue */
export default async function DevBillingPreview(props: PageProps<"/dev/billing">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { state = "trial" } = await props.searchParams;
  const access = sampleAccess(String(state));
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-4 py-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">What&apos;s the problem?</h1>
        <TrialStatus access={access} />
      </div>
      {access.kind === "expired" && <Paywall access={access} kind="diagnosis" />}
      <AccountPlan access={access} />
    </main>
  );
}
