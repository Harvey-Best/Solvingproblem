import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static assets, image optimization, generated metadata
    // files (share images, manifest) and machine callers (Stripe webhook, cron),
    // none of which need the session or anonymous-id cookies.
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|og/|manifest.webmanifest|api/stripe/|api/cron/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
