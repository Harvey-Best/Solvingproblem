import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DiagnoseForm } from "@/components/diagnose/diagnose-form";
import { ModeTabs } from "@/components/mode-tabs";
import { TrackOnMount } from "@/components/track-on-mount";
import { checkAllowance } from "@/lib/allowance";
import { isSupabaseConfigured } from "@/lib/env";
import { getIpHash, getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "Diagnose a problem" };

export default async function DiagnosePage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">Almost there</h1>
        <p className="mt-2 text-muted-foreground">
          Supabase isn&apos;t configured yet. Copy <code>.env.example</code> to <code>.env.local</code> and fill
          in the Supabase keys (see README).
        </p>
      </main>
    );
  }

  const viewer = await getViewer();
  const ipHash = viewer.userId ? null : await getIpHash();
  const allowance = await checkAllowance("diagnosis", viewer, ipHash);
  if (!allowance.allowed && allowance.reason === "signup_required") {
    redirect("/login?reason=more&next=/diagnose");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <TrackOnMount event="diagnose_start" properties={{ signed_in: Boolean(viewer.userId) }} />
      <ModeTabs active="diagnose" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">What&apos;s the problem?</h1>
      <p className="mt-1 text-muted-foreground">
        {viewer.userId
          ? "Snap it, tell us what's going on, and get a straight answer."
          : "Your first diagnosis is free. No account needed."}
      </p>
      {!allowance.allowed ? (
        <p className="mt-6 rounded-xl border bg-card p-4 text-sm">
          You&apos;ve hit today&apos;s diagnosis limit. Please come back tomorrow.
        </p>
      ) : (
        <div className="mt-6">
          <DiagnoseForm />
        </div>
      )}
    </main>
  );
}
