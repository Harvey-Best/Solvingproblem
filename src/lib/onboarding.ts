import "server-only";

import { after } from "next/server";

import { trackServer } from "@/lib/analytics-server";
import { startTrialIfNew } from "@/lib/billing";
import { claimAnonymousWork } from "@/lib/claim";
import { sendWelcomeEmail } from "@/lib/email/transactional";

/**
 * Runs after every successful sign-in (magic link, email code, Google).
 * Claims anonymous work when the sign-in started in this browser (see
 * claimAnonymousWork), and on the first sign-in starts the free trial and
 * queues the welcome email after the response, so sign-in isn't slowed down.
 */
export async function onSignedIn(userId: string, { claimWork }: { claimWork: boolean }) {
  await claimAnonymousWork(userId, { claimWork });

  let trial;
  try {
    trial = await startTrialIfNew(userId);
  } catch (err) {
    // getAccess retries this lazily, so a hiccup here never blocks sign-in.
    console.error("startTrialIfNew failed", { userId, error: (err as Error).message });
    return;
  }
  if (!trial.started) return;

  trackServer("signup", userId);
  trackServer("trial_start", userId, { trial_ends_at: trial.endsAt.toISOString() });
  after(async () => {
    await sendWelcomeEmail({ userId, email: trial.email, name: trial.fullName, trialEndsAt: trial.endsAt });
  });
}
