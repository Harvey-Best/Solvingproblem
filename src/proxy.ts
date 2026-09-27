import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static assets, image optimization and generated
    // metadata files (share images, manifest), which shouldn't set cookies.
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|og/|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
