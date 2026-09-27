"use client";

import { useRef } from "react";
import { Camera, ImagePlus, Loader2, RotateCcw, X } from "lucide-react";

import type { Photo, PhotoUploads } from "@/components/photos/use-photo-uploads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROGRESS_LABEL: Record<Photo["status"], string> = {
  processing: "Preparing…",
  uploading: "Uploading…",
  ready: "Ready",
  error: "Didn't upload",
};

/** Thumbnail grid plus camera / library buttons for a usePhotoUploads() instance. */
export function PhotoPicker({ uploads, noun = "photo" }: { uploads: PhotoUploads; noun?: string }) {
  const { photos, max, addFiles, remove, retry, hasErrors, busy } = uploads;
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);
  const empty = photos.length === 0;
  const pending = photos.filter((p) => p.status === "processing" || p.status === "uploading").length;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={cn(
              "relative aspect-square overflow-hidden rounded-xl border bg-muted",
              photo.status === "error" && "border-2 border-destructive"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img src={photo.previewUrl} alt={`${noun} ${i + 1}`} className="size-full object-cover" />
            {photo.status === "error" ? (
              // The whole tile retries; its label sits low so it never crowds the remove button.
              <button
                type="button"
                onClick={() => retry(photo)}
                aria-label={`${noun} ${i + 1} didn't upload. Retry`}
                className="absolute inset-0 flex flex-col items-center justify-end gap-1 bg-black/60 pb-2.5 text-white outline-offset-[-3px] focus-visible:outline-white"
              >
                <span className="text-[11px] font-medium leading-none">{PROGRESS_LABEL.error}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-foreground">
                  <RotateCcw className="size-3.5" /> Retry
                </span>
              </button>
            ) : photo.status !== "ready" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/45 text-xs font-medium text-white">
                <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                {PROGRESS_LABEL[photo.status]}
              </div>
            ) : null}
            {/* 44px tap target around a small visible circle. */}
            <button
              type="button"
              onClick={() => remove(photo.id)}
              className="group absolute right-0 top-0 grid size-11 place-items-center outline-none"
              aria-label={`Remove ${noun} ${i + 1}`}
            >
              <span className="grid size-7 place-items-center rounded-full bg-black/60 text-white transition-colors group-hover:bg-black/80 group-focus-visible:ring-[3px] group-focus-visible:ring-white">
                <X className="size-4" />
              </span>
            </button>
          </div>
        ))}
        {photos.length < max && (
          <button
            type="button"
            onClick={() => (empty ? cameraInput : libraryInput).current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-secondary/50 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary",
              empty ? "col-span-3 h-32" : "aspect-square"
            )}
          >
            <ImagePlus className="size-7" />
            {empty ? (
              <>
                <span className="text-base font-semibold">Add {noun}</span>
                <span className="text-xs font-normal text-muted-foreground">Up to {max}</span>
              </>
            ) : (
              "Add another"
            )}
          </button>
        )}
      </div>

      {photos.length < max && (
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" size="lg" onClick={() => cameraInput.current?.click()}>
            <Camera className="size-5" /> Take photo
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => libraryInput.current?.click()}>
            <ImagePlus className="size-5" /> From library
          </Button>
        </div>
      )}
      {hasErrors && (
        <p role="alert" className="text-sm text-destructive">
          A {noun} didn&apos;t upload. Tap Retry, or remove it and add it again.
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {busy ? `Uploading ${pending} ${noun}${pending === 1 ? "" : "s"}…` : ""}
      </p>

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
