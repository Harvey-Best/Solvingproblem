/**
 * Server-side env access with clear errors. NEXT_PUBLIC_* values used in client
 * components must be referenced literally (process.env.NEXT_PUBLIC_X) so Next can
 * inline them, so those are read directly where needed instead of through here.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}. See .env.example.`);
  }
  return value;
}

export const env = {
  get siteUrl() {
    const url =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    return url.replace(/\/$/, "");
  },
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get anthropicModel() {
    return process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  },
  get anthropicEffort(): "low" | "medium" | "high" | "max" {
    const effort = process.env.ANTHROPIC_EFFORT;
    return effort === "medium" || effort === "high" || effort === "max" ? effort : "low";
  },
  /** AI_MOCK=1 returns a canned diagnosis without calling the API (local UI work). */
  get aiMock() {
    return process.env.AI_MOCK === "1";
  },
  get anonIdSalt() {
    return process.env.ANON_ID_SALT || "home-doctor-dev-salt";
  },
  get stripeSecretKey() {
    return required("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return required("STRIPE_WEBHOOK_SECRET");
  },
  get stripePriceMonthly() {
    return required("STRIPE_PRICE_MONTHLY");
  },
  get stripePriceYearly() {
    return required("STRIPE_PRICE_YEARLY");
  },
  /** Unset in local dev: emails are logged instead of sent. */
  get resendApiKey() {
    return process.env.RESEND_API_KEY || null;
  },
  get emailFrom() {
    return process.env.EMAIL_FROM || "Home Doctor <onboarding@resend.dev>";
  },
  get cronSecret() {
    return process.env.CRON_SECRET || null;
  },
};

/**
 * The paywall only turns on once Stripe is set up, so people are never
 * blocked without a way to pay.
 */
export function isBillingConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONTHLY && process.env.STRIPE_PRICE_YEARLY
  );
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
