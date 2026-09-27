import { NextResponse } from "next/server";
import { z } from "zod";

import { modelOptions } from "@/lib/ai/client";
import { runDiagnosis, type ImageInput } from "@/lib/ai/diagnose";
import { logColumns } from "@/lib/ai/log-columns";
import { DIAGNOSIS_PROMPT_VERSION } from "@/lib/ai/prompt";
import { DENY_RESPONSES, reserveRun } from "@/lib/allowance";
import { CATEGORY_IDS } from "@/lib/diagnosis-meta";
import { env } from "@/lib/env";
import { loadImages } from "@/lib/images";
import { pathBelongsTo } from "@/lib/storage-paths";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAttribution, getIpHash, getViewerForWrite } from "@/lib/viewer";

// Model calls usually take 15-40s; leave room for one retry.
export const maxDuration = 300;

const bodySchema = z.object({
  imagePaths: z.array(z.string()).min(1).max(3),
  description: z.string().max(2000).default(""),
  category: z.enum(CATEGORY_IDS).nullable().default(null),
});

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ code, message }, { status });
}

const FRIENDLY_FAILURE =
  "We couldn't finish that diagnosis. Try again, ideally with a closer, well-lit photo. This one didn't count against you.";

export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return errorResponse(400, "bad_request", "Add 1 to 3 photos and try again.");
  }
  const { imagePaths, description, category } = body.data;

  const viewer = await getViewerForWrite();
  if (!imagePaths.every((p) => pathBelongsTo(p, viewer))) {
    return errorResponse(403, "forbidden", "Those photos don't belong to this session. Please re-upload them.");
  }

  const ipHash = viewer.userId ? null : await getIpHash();
  // Counts and reserves the pending row atomically; we fill in the rest below.
  const allowance = await reserveRun("diagnosis", viewer, ipHash);
  if (!allowance.allowed) {
    const deny = DENY_RESPONSES.diagnosis[allowance.reason];
    return errorResponse(deny.status, allowance.reason, deny.message);
  }

  const admin = createAdminClient();
  const row = { id: allowance.id };
  const { error: fillError } = await admin
    .from("diagnoses")
    .update({
      category,
      description: description.trim() || null,
      image_paths: imagePaths,
      model: env.aiMock ? "mock" : env.anthropicModel,
      prompt_version: DIAGNOSIS_PROMPT_VERSION,
      utm: viewer.userId ? null : await getAttribution(),
    })
    .eq("id", row.id);
  const fail = async (error: string, extra: Record<string, unknown> = {}) => {
    await admin.from("diagnoses").update({ status: "failed", error, ...extra }).eq("id", row.id);
  };
  if (fillError) {
    console.error("diagnosis save failed", fillError);
    await fail(fillError.message);
    return errorResponse(500, "server_error", FRIENDLY_FAILURE);
  }

  let images: ImageInput[];
  try {
    images = await loadImages(imagePaths);
  } catch (err) {
    await fail((err as Error).message);
    return errorResponse(400, "upload_missing", "One of your photos didn't finish uploading. Please add it again.");
  }

  const run = await runDiagnosis({ images, description, category }, modelOptions());
  const log = { ...logColumns(run), request_json: run.request };

  if (!run.ok) {
    console.error("diagnosis failed", { id: row.id, kind: run.errorKind, error: run.error });
    await fail(run.error, log);
    return run.errorKind === "refusal"
      ? errorResponse(422, "refused", "We can't help with this one. If anyone is in danger, call 911.")
      : errorResponse(502, "diagnosis_failed", FRIENDLY_FAILURE);
  }

  const { error: updateError } = await admin
    .from("diagnoses")
    .update({
      ...log,
      status: "complete",
      title: run.diagnosis.title,
      severity: run.diagnosis.severity,
      result_json: run.diagnosis,
      safety_overrides: run.overrides,
      error: null,
    })
    .eq("id", row.id);
  if (updateError) {
    console.error("diagnosis update failed", updateError);
    return errorResponse(500, "server_error", FRIENDLY_FAILURE);
  }

  return NextResponse.json({
    id: row.id,
    severity: run.diagnosis.severity,
    diy_verdict: run.diagnosis.diy_verdict,
    category: run.diagnosis.category,
    confidence: run.diagnosis.confidence,
  });
}
