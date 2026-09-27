import { NextResponse } from "next/server";
import { z } from "zod";

import { buildUploadPath, isAllowedImageType } from "@/lib/storage-paths";
import { createAdminClient, UPLOADS_BUCKET } from "@/lib/supabase/admin";
import { getViewerForWrite } from "@/lib/viewer";

const bodySchema = z.object({ contentType: z.string() });

/**
 * Mints a one-time signed upload URL under the caller's own prefix. The
 * browser uploads the compressed photo straight to Storage, which keeps big
 * files off our serverless functions (Vercel caps request bodies at 4.5MB).
 */
export async function POST(request: Request) {
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success || !isAllowedImageType(body.data.contentType)) {
    return NextResponse.json(
      { code: "bad_request", message: "Photos must be JPEG, PNG or WebP." },
      { status: 400 }
    );
  }

  const viewer = await getViewerForWrite();
  const path = buildUploadPath(viewer, body.data.contentType);
  if (!path) {
    return NextResponse.json({ code: "bad_request", message: "Missing session." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(UPLOADS_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("createSignedUploadUrl failed", error);
    return NextResponse.json(
      { code: "upload_failed", message: "Couldn't start the upload. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: data.path, token: data.token });
}
