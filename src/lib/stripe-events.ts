import "server-only";

import type Stripe from "stripe";

import { trackServer } from "@/lib/analytics-server";
import { syncSubscription } from "@/lib/billing";
import { sendReceiptEmail } from "@/lib/email/transactional";
import { getStripe, invoiceSubscriptionId } from "@/lib/stripe";

/** Events the webhook endpoint should be subscribed to in the Stripe dashboard. */
export const HANDLED_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "invoice.paid",
] as const;

function subscriptionId(value: string | Stripe.Subscription | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/** True when this update is the moment someone scheduled a cancellation. */
export function isCancellationScheduled(
  sub: Pick<Stripe.Subscription, "cancel_at_period_end" | "cancel_at">,
  previous: Partial<Stripe.Subscription> | undefined
): boolean {
  if (!previous) return false;
  const endingNow = previous.cancel_at_period_end === false && sub.cancel_at_period_end;
  const scheduledNow = "cancel_at" in previous && previous.cancel_at == null && sub.cancel_at != null;
  return Boolean(endingNow || scheduledNow);
}

/**
 * Applies one verified Stripe event. Subscriptions are always re-fetched, so
 * out-of-order deliveries still leave the latest state. Throws to make the
 * webhook return 500, which makes Stripe retry.
 */
export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const id = session.mode === "subscription" ? subscriptionId(session.subscription) : null;
      if (!id) return;
      const sub = await stripe.subscriptions.retrieve(id);
      const synced = await syncSubscription(sub);
      if (synced) {
        trackServer("subscribe", synced.userId, {
          plan: sub.items.data[0]?.price.recurring?.interval ?? null,
          status: sub.status,
          deferred_billing: sub.status === "trialing",
        });
      }
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      const sub = await stripe.subscriptions.retrieve(event.data.object.id);
      const synced = await syncSubscription(sub);
      if (!synced) return;
      const previous = event.type === "customer.subscription.updated" ? event.data.previous_attributes : undefined;
      if (event.type === "customer.subscription.deleted" || isCancellationScheduled(event.data.object, previous)) {
        trackServer("cancel", synced.userId, {
          plan: sub.items.data[0]?.price.recurring?.interval ?? null,
          ended: event.type === "customer.subscription.deleted",
        });
      }
      return;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const id = invoiceSubscriptionId(invoice);
      if (!id) return;
      const synced = await syncSubscription(await stripe.subscriptions.retrieve(id));
      if (!synced) return;
      const result = await sendReceiptEmail(invoice, synced.userId);
      if (result?.status === "failed") throw new Error(`receipt email failed: ${result.error}`);
      return;
    }

    default:
      return;
  }
}
