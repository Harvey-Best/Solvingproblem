import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { claimAnonymousWork } from "@/lib/claim";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

/**
 * Lands both sign-in flows:
 *  - ?code=...                     Google OAuth (and default PKCE magic links)
 *  - ?token_hash=...&type=email    our magic-link email template; works even
 *                                  when the link opens in a different browser
 *                                  (e.g. the Gmail app's in-app browser)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let userId: string | null = null;

  if (tokenHash && type) {
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

  await claimAnonymousWork(userId);
  return NextResponse.redirect(`${origin}${next}`);
}
