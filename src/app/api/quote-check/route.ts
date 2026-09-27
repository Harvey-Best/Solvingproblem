import { NextResponse } from "next/server";
import { z } from "zod";

import { modelOptions } from "@/lib/ai/client";
import { logColumns } from "@/lib/ai/log-columns";
import { runQuoteCheck } from "@/lib/ai/quote-check";
import { QUOTE_PROMPT_VERSION } from "@/lib/ai/quote-prompt";
import { DENY_RESPONSES, reserveRun } from "@/lib/allowance";
import { env } from "@/lib/env";
import { loadImages } from "@/lib/images";
import { pathBelongsTo } from "@/lib/storage-paths";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAttribution, getIpHash, getViewerForWrite } from "@/lib/viewer";

export const maxDuration = 300;

const bodySchema = z.object({
  imagePaths: z.array(z.string()).min(1).max(3),
  description: z.string().max(1000).default(""),
});

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

const FRIENDLY_FAILURE =
  "We couldn't read that quote. Try again with flat, well-lit photos of each page. This one didn't count against you.";

export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return errorResponse(400, "bad_request", "Add 1 to 3 photos of the quote and try again.");
  const { imagePaths, description } = body.data;

  const viewer = await getViewerForWrite();
  if (!imagePaths.every((p) => pathBelongsTo(p, viewer))) {
    return errorResponse(403, "forbidden", "Those photos don't belong to this session. Please re-upload them.");
  }

  const ipHash = viewer.userId ? null : await getIpHash();
  // Counts and reserves the pending row atomically; we fill in the rest below.
  const allowance = await reserveRun("quote", viewer, ipHash);
  if (!allowance.allowed) {
    const deny = DENY_RESPONSES.quote[allowance.reason];
    return errorResponse(deny.status, allowance.reason, deny.message);
  }

  const admin = createAdminClient();
  const row = { id: allowance.id };
  const { error: fillError } = await admin
    .from("quote_checks")
    .update({
      description: description.trim() || null,
      image_paths: imagePaths,
      model: env.aiMock ? "mock" : env.anthropicModel,
      prompt_version: QUOTE_PROMPT_VERSION,
      utm: viewer.userId ? null : await getAttribution(),
    })
    .eq("id", row.id);
  const fail = async (error: string, extra: Record<string, unknown> = {}) => {
    await admin.from("quote_checks").update({ status: "failed", error, ...extra }).eq("id", row.id);
  };
  if (fillError) {
    console.error("quote check save failed", fillError);
    await fail(fillError.message);
    return errorResponse(500, "server_error", FRIENDLY_FAILURE);
  }

  let images;
  try {
    images = await loadImages(imagePaths);
  } catch (err) {
    await fail((err as Error).message);
    return errorResponse(400, "upload_missing", "One of your photos didn't finish uploading. Please add it again.");
  }

  const run = await runQuoteCheck({ images, description }, modelOptions());
  const log = { ...logColumns(run), request_json: run.request };

  if (!run.ok) {
    console.error("quote check failed", { id: row.id, kind: run.errorKind, error: run.error });
    await fail(run.error, log);
    return run.errorKind === "refusal"
      ? errorResponse(422, "refused", "We can't help with this one.")
      : errorResponse(502, "quote_check_failed", FRIENDLY_FAILURE);
  }

  const { error: updateError } = await admin
    .from("quote_checks")
    .update({
      ...log,
      status: "complete",
      title: run.quote.title,
      result_json: run.quote,
      guard_flags: run.flags,
      error: null,
    })
    .eq("id", row.id);
  if (updateError) {
    console.error("quote check update failed", updateError);
    return errorResponse(500, "server_error", FRIENDLY_FAILURE);
  }

  return NextResponse.json({
    id: row.id,
    priceAssessment: run.quote.price_assessment,
    redFlags: run.quote.red_flags.length,
    readability: run.quote.readability,
  });
}
