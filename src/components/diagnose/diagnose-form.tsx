"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, ImagePlus, Loader2, RotateCcw, X } from "lucide-react";

import { DiagnosingOverlay } from "@/components/diagnose/diagnosing-overlay";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import { compressImage } from "@/lib/compress-image";
import { CATEGORIES, type CategoryId } from "@/lib/diagnosis-meta";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 3;
const MAX_DESCRIPTION = 2000;

type Photo = {
  id: string;
  file: File;
  previewUrl: string;
  status: "processing" | "uploading" | "ready" | "error";
  path?: string;
};

export function DiagnoseForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  // Release preview blobs when leaving the page.
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  const update = (id: string, patch: Partial<Photo>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  async function uploadPhoto(id: string, original: File) {
    update(id, { status: "processing" });
    try {
      const compressed = await compressImage(original);
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
    setError(null);
    const slots = MAX_PHOTOS - photos.length;
    const files = Array.from(list).slice(0, Math.max(0, slots));
    const added: Photo[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "processing",
    }));
    setPhotos((prev) => [...prev, ...added]);
    added.forEach((p) => void uploadPhoto(p.id, p.file));
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  const busy = photos.some((p) => p.status === "processing" || p.status === "uploading");
  const readyPaths = photos.filter((p) => p.status === "ready" && p.path).map((p) => p.path!);
  const hasErrors = photos.some((p) => p.status === "error");
  const canSubmit = readyPaths.length > 0 && !busy && !hasErrors && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imagePaths: readyPaths, description: description.trim(), category }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        track("diagnosis_complete", {
          severity: data.severity,
          diy_verdict: data.diy_verdict,
          category: data.category,
          confidence: data.confidence,
          photo_count: readyPaths.length,
          has_description: description.trim().length > 0,
          picked_category: category,
        });
        router.push(`/d/${data.id}`);
        return; // keep the overlay up while the result page loads
      }
      if (data.code === "signup_required") {
        router.push("/login?reason=more&next=/diagnose");
        return;
      }
      setError(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("We lost the connection. Check your signal and try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-8 pb-28">
      {submitting && <DiagnosingOverlay />}

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">1. Photos of the problem</h2>
          <p className="text-sm text-muted-foreground">
            1–3 photos. Get close, turn on a light, and add one wider shot for context.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={photo.previewUrl} alt="" className="size-full object-cover" />
              {photo.status !== "ready" && (
                <div className="absolute inset-0 grid place-items-center bg-black/45 text-white">
                  {photo.status === "error" ? (
                    <button
                      type="button"
                      onClick={() => uploadPhoto(photo.id, photo.file)}
                      className="flex flex-col items-center gap-1 text-xs font-medium"
                    >
                      <RotateCcw className="size-5" /> Retry
                    </button>
                  ) : (
                    <Loader2 className="size-6 animate-spin" aria-label="Uploading" />
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white"
                aria-label="Remove photo"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => (photos.length === 0 ? cameraInput : libraryInput).current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-secondary/50 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
            >
              <ImagePlus className="size-7" />
              {photos.length === 0 ? "Add photo" : "Add another"}
            </button>
          )}
        </div>

        {photos.length < MAX_PHOTOS && (
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => cameraInput.current?.click()}>
              <Camera /> Take photo
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => libraryInput.current?.click()}>
              <ImagePlus /> From library
            </Button>
          </div>
        )}
        {hasErrors && (
          <p className="text-sm text-destructive">
            A photo didn&apos;t upload. Tap Retry, or remove it and add it again.
          </p>
        )}

        <input
          ref={cameraInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={libraryInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </section>

      <section className="space-y-3">
        <Label htmlFor="description" className="text-base font-semibold">
          2. What&apos;s going on? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          maxLength={MAX_DESCRIPTION}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Drips from the spout even when the handle is off. Started last week and it's getting worse."
          rows={3}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">
          3. What kind of problem? <span className="font-normal text-muted-foreground">(optional)</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const selected = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setCategory(selected ? null : c.id)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent"
                )}
              >
                <span className="mr-1" aria-hidden>
                  {c.emoji}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {error && (
        <div className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <Button size="xl" className="w-full" onClick={submit} disabled={!canSubmit}>
            {busy ? (
              <>
                <Loader2 className="animate-spin" /> Uploading photos…
              </>
            ) : readyPaths.length === 0 ? (
              "Add a photo to start"
            ) : (
              "Diagnose it"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
