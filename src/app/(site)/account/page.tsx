import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, History, LogOut } from "lucide-react";

import { signOut } from "@/app/(site)/login/actions";
import { AccountPlan } from "@/components/billing/account-plan";
import { Button } from "@/components/ui/button";
import { getAccess } from "@/lib/billing";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function AccountPage(props: PageProps<"/account">) {
  const searchParams = await props.searchParams;
  const viewer = await getViewer();
  if (!viewer.userId) redirect("/login?next=/account");
  const access = await getAccess(viewer.userId);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-1 text-muted-foreground">{viewer.email}</p>
      </div>

      {searchParams.error === "portal" && (
        <p className="rounded-xl border bg-card p-3 text-sm">We couldn&apos;t open billing. Please try again.</p>
      )}
      {access.kind === "subscribed" && access.pastDue && (
        <p className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Your last payment didn&apos;t go through. Update your card in Manage billing to keep access.
        </p>
      )}

      <AccountPlan access={access} />

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/history">
            <History className="size-4" /> Your history
          </Link>
        </Button>
        <form action={signOut}>
          <Button type="submit" variant="ghost">
            <LogOut className="size-4" /> Sign out
          </Button>
        </form>
      </div>
    </main>
  );
}
