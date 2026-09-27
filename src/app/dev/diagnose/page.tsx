import { notFound } from "next/navigation";

import { DiagnoseForm } from "@/components/diagnose/diagnose-form";

/** Dev-only preview of the diagnose form without the allowance check. */
export default function DevDiagnosePreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight">What&apos;s the problem?</h1>
      <p className="mt-1 text-muted-foreground">Your first diagnosis is free. No account needed.</p>
      <div className="mt-6">
        <DiagnoseForm />
      </div>
    </main>
  );
}
