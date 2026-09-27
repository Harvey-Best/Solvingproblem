import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, CircleCheck, FileText } from "lucide-react";

import { formatDay } from "@/components/billing/access-ui";
import { Button } from "@/components/ui/button";
import { syncSubscription } from "@/lib/billing";
import { isBillingConfigured } from "@/lib/env";
import { planForInterval, type Plan } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "You're subscribed", robots: { index: false } };

/**
 * Stripe Checkout lands here. The webhook may not have arrived yet, so the
 * subscription is synced from the session right away (idempotent either way).
 */
async function confirmCheckout(sessionId: string, userId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== userId || !session.subscription) return null;
  const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
  const sub = await stripe.subscriptions.retrieve(subId);
  await syncSubscription(sub);
  return {
    plan: planForInterval(sub.items.data[0]?.price.recurring?.interval),
    firstChargeAt: sub.status === "trialing" && sub.trial_end ? new Date(sub.trial_end * 1000) : null,
  };
}

export default async function BillingSuccessPage(props: PageProps<"/billing/success">) {
  const { session_id } = await props.searchParams;
  const { userId } = await getViewer();
  if (!userId) redirect("/login?next=/account");

  let details: { plan: Plan | null; firstChargeAt: Date | null } | null = null;
  if (typeof session_id === "string" && session_id.startsWith("cs_") && isBillingConfigured()) {
    try {
      details = await confirmCheckout(session_id, userId);
    } catch (err) {
      console.error("checkout confirmation failed", { userId, error: (err as Error).message });
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-(image:--grad) text-white">
        <CircleCheck className="size-8" />
      </span>
      <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight">You&apos;re subscribed</h1>
      <p className="mt-2 text-muted-foreground">
        {details?.plan ? `Home Doctor ${details.plan.label}, ${details.plan.priceLabel}. ` : ""}
        {details?.firstChargeAt
          ? `Your first charge is on ${formatDay(details.firstChargeAt)}, when your free trial ends.`
          : "Thanks for subscribing. A receipt is on its way to your inbox."}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/diagnose">
            <Camera className="size-5" /> Diagnose a problem
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link href="/quote">
            <FileText className="size-5" /> Check a quote
          </Link>
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Manage your plan anytime from{" "}
        <Link href="/account" className="font-medium text-primary underline">
          your account
        </Link>
        .
      </p>
    </main>
  );
}
