import "server-only";

import type { ImageInput } from "@/lib/ai/diagnose";
import { mediaTypeForPath } from "@/lib/storage-paths";
import { createAdminClient, UPLOADS_BUCKET } from "@/lib/supabase/admin";

/** Downloads stored photos as base64 for the model. Throws if any are missing. */
export async function loadImages(paths: string[]): Promise<ImageInput[]> {
  const admin = createAdminClient();
  return Promise.all(
    paths.map(async (path) => {
      const { data, error } = await admin.storage.from(UPLOADS_BUCKET).download(path);
      if (error || !data) throw new Error(`download ${path}: ${error?.message ?? "no data"}`);
      const base64 = Buffer.from(await data.arrayBuffer()).toString("base64");
      return { mediaType: mediaTypeForPath(path), base64 };
    })
  );
}
