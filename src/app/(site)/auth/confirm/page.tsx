import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";

import { PendingButton } from "@/components/billing/pending-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { safeNextPath } from "@/lib/utils";

import { confirmSignIn } from "./actions";

export const metadata: Metadata = {
  title: "Finish signing in",
  robots: { index: false, follow: false },
  // The URL carries a one-time sign-in token.
  referrer: "no-referrer",
};

export default async function ConfirmSignInPage(props: PageProps<"/auth/confirm">) {
  const searchParams = await props.searchParams;
  const tokenHash = typeof searchParams.token_hash === "string" ? searchParams.token_hash : null;
  const type = typeof searchParams.type === "string" ? searchParams.type : "email";
  const next = safeNextPath(typeof searchParams.next === "string" ? searchParams.next : null);
  if (!tokenHash) redirect(`/login?error=link&next=${encodeURIComponent(next)}`);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[1.75rem] font-semibold">Finish signing in</CardTitle>
          <CardDescription>
            This sign-in link opened in a different browser or app than the one you started in. Tap below to sign
            in here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={confirmSignIn}>
            <input type="hidden" name="token_hash" value={tokenHash} />
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="next" value={next} />
            <PendingButton size="lg" className="w-full" pendingLabel="Signing in…">
              <LogIn className="size-4" /> Continue to Home Doctor
            </PendingButton>
          </form>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t ask to sign in? Close this page. Nothing happens unless you tap the button.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
