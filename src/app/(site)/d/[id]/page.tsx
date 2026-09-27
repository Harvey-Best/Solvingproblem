import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Save } from "lucide-react";

import { DiagnosisResult } from "@/components/result/diagnosis-result";
import { Button } from "@/components/ui/button";
import { getDiagnosisForViewer, signImageUrls } from "@/lib/diagnoses";
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

  const imageUrls = await signImageUrls(record.image_paths);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <DiagnosisResult diagnosis={record.result_json} imageUrls={imageUrls} />

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
