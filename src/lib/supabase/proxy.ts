import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ANON_COOKIE, UTM_COOKIE, anonCookieOptions, supabaseCookieOptions, utmCookieOptions } from "@/lib/cookies";
import { extractAttribution } from "@/lib/utm";
import { isUuid } from "@/lib/utils";

/**
 * Runs on every page request:
 *  1. gives each visitor a stable anonymous id (so their first free diagnosis
 *     can be claimed when they sign up),
 *  2. captures first-touch UTM params,
 *  3. refreshes the Supabase auth session cookie.
 */
export async function updateSession(request: NextRequest) {
  const existingAnon = request.cookies.get(ANON_COOKIE)?.value;
  const anonId = isUuid(existingAnon) ? existingAnon : crypto.randomUUID();
  const isNewAnon = anonId !== existingAnon;
  if (isNewAnon) request.cookies.set(ANON_COOKIE, anonId);

  let attribution: string | null = null;
  if (!request.cookies.has(UTM_COOKIE)) {
    const found = extractAttribution(request.nextUrl, request.headers.get("referer"));
    if (found) {
      attribution = JSON.stringify(found);
      request.cookies.set(UTM_COOKIE, attribution);
    }
  }

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
        },
      },
    });
    // Do not put logic between client creation and this call: it refreshes the
    // session token if needed and writes it back through setAll.
    await supabase.auth.getClaims();
  }

  if (isNewAnon) response.cookies.set(ANON_COOKIE, anonId, anonCookieOptions);
  if (attribution) response.cookies.set(UTM_COOKIE, attribution, utmCookieOptions);

  return response;
}
