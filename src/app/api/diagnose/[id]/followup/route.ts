import { NextResponse } from "next/server";
import { z } from "zod";

import { modelOptions } from "@/lib/ai/client";
import { runDiagnosis } from "@/lib/ai/diagnose";
import { logColumns } from "@/lib/ai/log-columns";
import { FOLLOW_UPS_PER_DIAGNOSIS } from "@/lib/allowance";
import { accessAllowsPaidFeatures, getAccess } from "@/lib/billing";
import { getDiagnosisForViewer, getThread } from "@/lib/diagnoses";
import { loadImages } from "@/lib/images";
import { createAdminClient } from "@/lib/supabase/admin";
import { successfulTurns, toExchanges } from "@/lib/thread";
import { getViewerForWrite } from "@/lib/viewer";

export const maxDuration = 300;

const bodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  // The suggested question being answered, if any. Sent separately so a long
  // answer to a long question isn't rejected for the combined length.
  replyTo: z.string().trim().max(300).optional(),
});

// Longer than the slowest run (maxDuration), so a crashed run frees the thread eventually.
const FOLLOW_UP_LOCK_MS = 6 * 60 * 1000;

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
  const { replyTo } = body.data;
  const message = replyTo ? `Q: ${replyTo}\nA: ${body.data.message}` : body.data.message;

  const viewer = await getViewerForWrite();
  const record = await getDiagnosisForViewer(id, viewer);
  if (!record) return errorResponse(404, "not_found", "We can't find that diagnosis.");
  if (record.status !== "complete" || !record.result_json) {
    return errorResponse(409, "not_ready", "This diagnosis didn't finish, so there's nothing to update.");
  }

  if (viewer.userId && !accessAllowsPaidFeatures(await getAccess(viewer.userId))) {
    return errorResponse(402, "subscription_required", "Your free trial has ended. Choose a plan to keep asking.");
  }

  // One follow-up at a time per diagnosis. Without this, parallel requests
  // all see the same turn count before any of them saves, and all run.
  const admin = createAdminClient();
  const now = new Date();
  const { data: locked, error: lockError } = await admin
    .from("diagnoses")
    .update({ followup_lock_until: new Date(now.getTime() + FOLLOW_UP_LOCK_MS).toISOString() })
    .eq("id", id)
    .or(`followup_lock_until.is.null,followup_lock_until.lt.${now.toISOString()}`)
    .select("id");
  if (lockError) {
    console.error("follow-up lock failed", { id, error: lockError.message });
    return errorResponse(500, "server_error", "Something went wrong. Please try again.");
  }
  if (!locked?.length) {
    return errorResponse(409, "busy", "We're still working on your last answer. Give it a moment.");
  }
  const unlock = () => admin.from("diagnoses").update({ followup_lock_until: null }).eq("id", id);

  try {
    return await runFollowUp({ id, record, message, isSignedIn: Boolean(viewer.userId), admin });
  } finally {
    await unlock();
  }
}

async function runFollowUp({
  id,
  record,
  message,
  isSignedIn,
  admin,
}: {
  id: string;
  record: NonNullable<Awaited<ReturnType<typeof getDiagnosisForViewer>>>;
  message: string;
  isSignedIn: boolean;
  admin: ReturnType<typeof createAdminClient>;
}) {
  if (!record.result_json) return errorResponse(409, "not_ready", "This diagnosis didn't finish, so there's nothing to update.");
  const turns = successfulTurns(toExchanges(await getThread(id)));
  const cap = isSignedIn ? FOLLOW_UPS_PER_DIAGNOSIS.signedIn : FOLLOW_UPS_PER_DIAGNOSIS.anonymous;
  if (turns.length >= cap) {
    return isSignedIn
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
