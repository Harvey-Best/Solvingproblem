import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Save } from "lucide-react";

import { DiagnosisResult } from "@/components/result/diagnosis-result";
import { FollowUpThread } from "@/components/thread/follow-up-thread";
import { Button } from "@/components/ui/button";
import { FOLLOW_UPS_PER_DIAGNOSIS } from "@/lib/allowance";
import { getDiagnosisForViewer, getThread, signImageUrls } from "@/lib/diagnoses";
import { latestDiagnosis, successfulTurns, toExchanges } from "@/lib/thread";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = {
  title: "Your diagnosis",
  robots: { index: false },
};

export default async function DiagnosisPage(props: PageProps<"/d/[id]">) {
  const { id } = await props.params;
  const viewer = await getViewer();
  const record = await getDiagnosisForViewer(id, viewer);
  if (!record) notFound();

  if (record.status !== "complete" || !record.result_json) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">
          {record.status === "pending" ? "Still working on it" : "We couldn't finish this one"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {record.status === "pending"
            ? "Refresh in a few seconds."
            : "Something went wrong on our end. It didn't count against you. Try again with a clear, close-up photo."}
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/diagnose">Try again</Link>
        </Button>
      </main>
    );
  }

  const [imageUrls, thread] = await Promise.all([signImageUrls(record.image_paths), getThread(record.id)]);
  const exchanges = toExchanges(thread);
  const turns = successfulTurns(exchanges);
  const current = latestDiagnosis(record.result_json, exchanges);
  const cap = viewer.userId ? FOLLOW_UPS_PER_DIAGNOSIS.signedIn : FOLLOW_UPS_PER_DIAGNOSIS.anonymous;

  return (
    <main id="top" className="mx-auto w-full max-w-2xl flex-1 scroll-mt-20 px-4 py-6">
      <DiagnosisResult
        diagnosis={current}
        imageUrls={imageUrls}
        showFollowUpQuestions={false}
        updatedCount={turns.length}
      />

      <div className="mt-4">
        <FollowUpThread
          diagnosisId={record.id}
          exchanges={exchanges}
          suggestions={current.follow_up_questions}
          remaining={Math.max(0, cap - turns.length)}
          signedIn={Boolean(viewer.userId)}
        />
      </div>

      {!viewer.userId && (
        <div className="mt-6 rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5">
          <p className="font-display text-xl font-semibold">Save this diagnosis</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a free account to keep it, come back to it later, and run your next diagnosis.
          </p>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
            <Link href={`/login?reason=save&next=/d/${record.id}`}>
              <Save /> Save it to my account
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-6">
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/diagnose">
            <Camera /> Diagnose something else
          </Link>
        </Button>
      </div>
    </main>
  );
}
