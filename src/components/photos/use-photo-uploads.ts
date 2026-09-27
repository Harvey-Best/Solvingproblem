"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { compressImage } from "@/lib/compress-image";
import { createClient } from "@/lib/supabase/client";

export type Photo = {
  id: string;
  file: File;
  previewUrl: string;
  status: "processing" | "uploading" | "ready" | "error";
  path?: string;
};

/**
 * Compresses each picked photo in the browser and uploads it straight to
 * Storage through a signed URL, so photos are ready by the time the user
 * finishes typing. `quality` goes up for documents like quotes.
 */
export function usePhotoUploads({ max = 3, quality }: { max?: number; quality?: number } = {}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photosRef = useRef(photos);

  // Release preview blobs when leaving the page.
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  const update = (id: string, patch: Partial<Photo>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  async function upload(id: string, original: File) {
    update(id, { status: "processing" });
    try {
      const compressed = await compressImage(original, { quality });
      const previewUrl = URL.createObjectURL(compressed);
      setPhotos((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          URL.revokeObjectURL(p.previewUrl);
          return { ...p, previewUrl, status: "uploading" };
        })
      );

      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType: compressed.type }),
      });
      if (!res.ok) throw new Error(`upload url ${res.status}`);
      const { path, token } = (await res.json()) as { path: string; token: string };

      const { error: uploadError } = await createClient()
        .storage.from("uploads")
        .uploadToSignedUrl(path, token, compressed, { contentType: compressed.type });
      if (uploadError) throw uploadError;

      update(id, { status: "ready", path });
      track("image_uploaded", {
        original_kb: Math.round(original.size / 1024),
        compressed_kb: Math.round(compressed.size / 1024),
      });
    } catch (err) {
      console.error("photo upload failed", err);
      update(id, { status: "error" });
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const slots = max - photos.length;
    const added: Photo[] = Array.from(list)
      .slice(0, Math.max(0, slots))
      .map((file) => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file), status: "processing" }));
    setPhotos((prev) => [...prev, ...added]);
    added.forEach((p) => void upload(p.id, p.file));
  }

  function remove(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  const busy = photos.some((p) => p.status === "processing" || p.status === "uploading");
  const readyPaths = photos.filter((p) => p.status === "ready" && p.path).map((p) => p.path!);
  const hasErrors = photos.some((p) => p.status === "error");

  return {
    photos,
    max,
    addFiles,
    remove,
    retry: (p: Photo) => upload(p.id, p.file),
    busy,
    readyPaths,
    hasErrors,
  };
}

export type PhotoUploads = ReturnType<typeof usePhotoUploads>;
