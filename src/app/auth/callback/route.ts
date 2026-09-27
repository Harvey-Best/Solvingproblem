import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { LOGIN_NONCE_COOKIE } from "@/lib/cookies";
import { onSignedIn } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

/**
 * Lands both sign-in flows:
 *  - ?code=...                         Google OAuth (and default PKCE magic links).
 *                                      PKCE only completes in the browser that
 *                                      started it.
 *  - ?token_hash=...&type=email&n=...  our magic-link email template. When `n`
 *                                      matches this browser's hd_login cookie,
 *                                      sign in right away. Otherwise the link
 *                                      was opened somewhere else (the Gmail
 *                                      app's browser, another device, or a link
 *                                      someone else sent), so /auth/confirm
 *                                      asks first and doesn't claim anonymous
 *                                      work. That also keeps email link
 *                                      scanners from using up the one-time
 *                                      token with a GET.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const cookieStore = await cookies();
  const supabase = await createClient();
  let userId: string | null = null;

  if (tokenHash && type) {
    const nonce = cookieStore.get(LOGIN_NONCE_COOKIE)?.value;
    if (!nonce || nonce !== searchParams.get("n")) {
      const confirm = new URLSearchParams({ token_hash: tokenHash, type, next });
      return NextResponse.redirect(`${origin}/auth/confirm?${confirm}`);
    }
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) userId = data.user?.id ?? null;
    else console.error("verifyOtp failed", error.message);
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) userId = data.user?.id ?? null;
    else console.error("exchangeCodeForSession failed", error.message);
  }

  if (!userId) {
    return NextResponse.redirect(
      `${origin}/login?error=link&next=${encodeURIComponent(next)}`
    );
  }

  cookieStore.delete(LOGIN_NONCE_COOKIE);
  await onSignedIn(userId, { claimWork: true });
  return NextResponse.redirect(`${origin}${next}`);
}
