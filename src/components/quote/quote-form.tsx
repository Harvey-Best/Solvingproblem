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

const QUOTE_MESSAGES = [
  "Reading the quote…",
  "Checking what it leaves out…",
  "Looking for red flags…",
  "Comparing to typical prices…",
  "Writing your questions…",
];

export function QuoteForm() {
  const router = useRouter();
  // Quotes are text: keep a little more JPEG quality so small print stays legible.
  const uploads = usePhotoUploads({ quality: 0.92 });
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { busy, readyPaths, hasErrors } = uploads;
  const canSubmit = readyPaths.length > 0 && !busy && !hasErrors && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quote-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imagePaths: readyPaths, description: description.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        track("quote_check_complete", {
          price_assessment: data.priceAssessment,
          red_flags: data.redFlags,
          readability: data.readability,
          page_count: readyPaths.length,
        });
        router.push(`/q/${data.id}`);
        return;
      }
      if (data.code === "subscription_required") {
        // The trial ended in another tab; reloading shows the plans.
        router.refresh();
        setError(data.message);
        setSubmitting(false);
        return;
      }
      if (data.code === "signup_required") {
        router.push("/login?reason=quote&next=/quote");
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
      {submitting && <DiagnosingOverlay messages={QUOTE_MESSAGES} />}

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">1. Photos of the quote</h2>
          <p className="text-sm text-muted-foreground">
            One photo per page, up to 3. Lay it flat, fill the frame, and avoid glare.
          </p>
        </div>
        <PhotoPicker uploads={uploads} noun="page" />
      </section>

      <section className="space-y-3">
        <Label htmlFor="job" className="text-base font-semibold">
          2. What&apos;s the job? <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="job"
          value={description}
          maxLength={1000}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Replace my 40-gallon gas water heater with a 50-gallon one."
          rows={2}
        />
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
              <Loader2 className="animate-spin" /> Uploading pages…
            </>
          ) : readyPaths.length === 0 ? (
            "Add a photo of the quote"
          ) : (
            "Check this quote"
          )}
        </Button>
      </SubmitBar>
    </div>
  );
}
