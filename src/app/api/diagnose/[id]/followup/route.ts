import { NextResponse } from "next/server";
import { z } from "zod";

import { modelOptions } from "@/lib/ai/client";
import { runDiagnosis } from "@/lib/ai/diagnose";
import { logColumns } from "@/lib/ai/log-columns";
import { FOLLOW_UPS_PER_DIAGNOSIS } from "@/lib/allowance";
import { getDiagnosisForViewer, getThread } from "@/lib/diagnoses";
import { loadImages } from "@/lib/images";
import { createAdminClient } from "@/lib/supabase/admin";
import { successfulTurns, toExchanges } from "@/lib/thread";
import { getViewerForWrite } from "@/lib/viewer";

export const maxDuration = 300;

const bodySchema = z.object({ message: z.string().trim().min(1).max(1000) });

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * The homeowner answers a follow-up question (or adds a detail). We re-run the
 * whole diagnosis with the full conversation and store both sides of the
 * exchange, including failures, for quality review.
 */
export async function POST(request: Request, ctx: RouteContext<"/api/diagnose/[id]/followup">) {
  const { id } = await ctx.params;
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return errorResponse(400, "bad_request", "Type an answer first (up to 1,000 characters).");
  const message = body.data.message;

  const viewer = await getViewerForWrite();
  const record = await getDiagnosisForViewer(id, viewer);
  if (!record) return errorResponse(404, "not_found", "We can't find that diagnosis.");
  if (record.status !== "complete" || !record.result_json) {
    return errorResponse(409, "not_ready", "This diagnosis didn't finish, so there's nothing to update.");
  }

  const turns = successfulTurns(toExchanges(await getThread(id)));
  const cap = viewer.userId ? FOLLOW_UPS_PER_DIAGNOSIS.signedIn : FOLLOW_UPS_PER_DIAGNOSIS.anonymous;
  if (turns.length >= cap) {
    return viewer.userId
      ? errorResponse(429, "followup_limit", "That's the most follow-ups for one diagnosis. Start a new one with fresh photos.")
      : errorResponse(401, "signup_required", "Create a free account to keep asking about this one.");
  }

  let images;
  try {
    images = await loadImages(record.image_paths);
  } catch (err) {
    console.error("follow-up image load failed", { id, error: (err as Error).message });
    return errorResponse(500, "server_error", "We couldn't load your photos. Please try again.");
  }

  const askedAt = new Date();
  const run = await runDiagnosis(
    {
      images,
      description: record.description ?? "",
      category: record.category,
      history: { original: record.result_json, turns },
      newAnswer: message,
    },
    modelOptions()
  );
  // Explicit, strictly increasing timestamps keep the thread in order.
  const repliedAt = new Date(Math.max(Date.now(), askedAt.getTime() + 1));

  const admin = createAdminClient();
  const { error: insertError } = await admin.from("diagnosis_messages").insert([
    { diagnosis_id: id, role: "user", content: message, created_at: askedAt.toISOString() },
    {
      diagnosis_id: id,
      role: "assistant",
      content: run.ok ? run.diagnosis.what_changed : null,
      result_json: run.ok ? run.diagnosis : null,
      error: run.ok ? null : run.error,
      ...logColumns(run),
      created_at: repliedAt.toISOString(),
    },
  ]);
  if (insertError) console.error("follow-up insert failed", insertError);

  if (!run.ok) {
    console.error("follow-up failed", { id, kind: run.errorKind, error: run.error });
    return run.errorKind === "refusal"
      ? errorResponse(422, "refused", "We can't help with that. If anyone is in danger, call 911.")
      : errorResponse(502, "followup_failed", "We couldn't update the diagnosis. Please try again.");
  }

  // Keep the history list showing the current title and severity.
  await admin
    .from("diagnoses")
    .update({ title: run.diagnosis.title, severity: run.diagnosis.severity })
    .eq("id", id);

  return NextResponse.json({
    whatChanged: run.diagnosis.what_changed,
    severity: run.diagnosis.severity,
    confidence: run.diagnosis.confidence,
    followUpsLeft: cap - turns.length - 1,
  });
}
