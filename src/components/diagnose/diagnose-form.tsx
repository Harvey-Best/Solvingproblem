"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { DiagnosingOverlay } from "@/components/diagnose/diagnosing-overlay";
import { PhotoPicker } from "@/components/photos/photo-picker";
import { usePhotoUploads } from "@/components/photos/use-photo-uploads";
import { SubmitBar } from "@/components/submit-bar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import { CATEGORIES, type CategoryId } from "@/lib/diagnosis-meta";
import { cn } from "@/lib/utils";

const MAX_DESCRIPTION = 2000;

export function DiagnoseForm() {
  const router = useRouter();
  const uploads = usePhotoUploads();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { busy, readyPaths, hasErrors } = uploads;
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
        <PhotoPicker uploads={uploads} />
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
                  "rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 active:scale-95",
                  selected
                    ? "border-transparent bg-(image:--grad) text-primary-foreground shadow-[0_8px_18px_-12px_var(--primary)]"
                    : "bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
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

      <SubmitBar>
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
      </SubmitBar>
    </div>
  );
}
