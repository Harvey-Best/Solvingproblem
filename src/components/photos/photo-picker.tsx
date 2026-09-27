"use client";

import { useRef } from "react";
import { Camera, ImagePlus, Loader2, RotateCcw, X } from "lucide-react";

import type { PhotoUploads } from "@/components/photos/use-photo-uploads";
import { Button } from "@/components/ui/button";

/** Thumbnail grid plus camera / library buttons for a usePhotoUploads() instance. */
export function PhotoPicker({ uploads, noun = "photo" }: { uploads: PhotoUploads; noun?: string }) {
  const { photos, max, addFiles, remove, retry, hasErrors } = uploads;
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
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
                    onClick={() => retry(photo)}
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
              onClick={() => remove(photo.id)}
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white"
              aria-label={`Remove ${noun}`}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {photos.length < max && (
          <button
            type="button"
            onClick={() => (photos.length === 0 ? cameraInput : libraryInput).current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-secondary/50 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
          >
            <ImagePlus className="size-7" />
            {photos.length === 0 ? `Add ${noun}` : "Add another"}
          </button>
        )}
      </div>

      {photos.length < max && (
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
        <p className="text-sm text-destructive">A photo didn&apos;t upload. Tap Retry, or remove it and add it again.</p>
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
    </div>
  );
}
