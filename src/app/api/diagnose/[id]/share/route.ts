import { NextResponse } from "next/server";

import { getDiagnosisForViewer } from "@/lib/diagnoses";
import { env } from "@/lib/env";
import { ensureShareId, revokeShareId, shareLink } from "@/lib/share";
import { getViewerForWrite } from "@/lib/viewer";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

/** Link back to the site the owner is on (production, a preview, or local). */
function linkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin && /^https?:\/\/[^/]+$/.test(origin) ? origin : env.siteUrl;
}

/**
 * Share links for the caller's own diagnosis. POST creates one (or returns the
 * existing one) and DELETE revokes it. Anyone else gets a 404, same as the
 * result page.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/diagnose/[id]/share">) {
  const { id } = await ctx.params;
  const viewer = await getViewerForWrite();
  const record = await getDiagnosisForViewer(id, viewer);
  if (!record) return errorResponse(404, "not_found", "We can't find that diagnosis.");
  if (record.status !== "complete" || !record.result_json) {
    return errorResponse(409, "not_ready", "This diagnosis didn't finish, so there's nothing to share.");
  }

  try {
    const shareId = await ensureShareId(record.id);
    return NextResponse.json(shareLink(shareId, linkOrigin(request)));
  } catch (err) {
    console.error("share link create failed", { id, error: (err as Error).message });
    return errorResponse(500, "server_error", "We couldn't make a link. Please try again.");
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/diagnose/[id]/share">) {
  const { id } = await ctx.params;
  const viewer = await getViewerForWrite();
  const record = await getDiagnosisForViewer(id, viewer);
  if (!record) return errorResponse(404, "not_found", "We can't find that diagnosis.");

  try {
    await revokeShareId(record.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("share link revoke failed", { id, error: (err as Error).message });
    return errorResponse(500, "server_error", "We couldn't stop sharing. Please try again.");
  }
}
