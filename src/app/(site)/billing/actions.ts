"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { checkoutTrialEnd } from "@/lib/access";
import { getAccess, getOrCreateCustomer, getStripeCustomerId } from "@/lib/billing";
import { env, isBillingConfigured } from "@/lib/env";
import { PLAN_IDS, type PlanId } from "@/lib/plans";
import { getStripe, priceIdFor } from "@/lib/stripe";
import { getViewer } from "@/lib/viewer";

/** Where Stripe should send people back: the deployment they're on. */
async function requestOrigin(): Promise<string> {
  const h = await headers();
  return h.get("origin") || env.siteUrl;
}

async function portalUrl(customerId: string): Promise<string> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${await requestOrigin()}/account`,
  });
  return session.url;
}

export async function startCheckout(formData: FormData) {
  const plan: PlanId = PLAN_IDS.find((id) => id === formData.get("plan")) ?? "yearly";
  const { userId, email } = await getViewer();
  if (!userId) redirect(`/login?reason=subscribe&next=${encodeURIComponent(`/pricing?plan=${plan}`)}`);
  if (!isBillingConfigured()) redirect("/pricing?error=unavailable");

  let url: string | null = null;
  try {
    const access = await getAccess(userId);
    const customer = await getOrCreateCustomer(userId, email);
    if (access.kind === "subscribed") {
      // Already paying: plan changes happen in the portal.
      url = await portalUrl(customer);
    } else {
      const trialEnd = access.kind === "trial" ? checkoutTrialEnd(access.endsAt) : undefined;
      const origin = await requestOrigin();
      const session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        customer,
        client_reference_id: userId,
        line_items: [{ price: priceIdFor(plan), quantity: 1 }],
        allow_promotion_codes: true,
        metadata: { user_id: userId, plan },
        subscription_data: {
          metadata: { user_id: userId },
          ...(trialEnd ? { trial_end: trialEnd } : {}),
        },
        success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing?canceled=1`,
      });
      url = session.url;
    }
  } catch (err) {
    console.error("startCheckout failed", { userId, plan, error: (err as Error).message });
  }
  redirect(url ?? "/pricing?error=checkout");
}

export async function openBillingPortal() {
  const { userId } = await getViewer();
  if (!userId) redirect("/login?next=/account");

  let url: string | null = null;
  try {
    const customer = await getStripeCustomerId(userId);
    if (customer && isBillingConfigured()) url = await portalUrl(customer);
  } catch (err) {
    console.error("openBillingPortal failed", { userId, error: (err as Error).message });
  }
  redirect(url ?? "/account?error=portal");
}
