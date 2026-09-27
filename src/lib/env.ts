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
    return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
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
};

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
