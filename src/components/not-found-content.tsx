import Link from "next/link";

import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-semibold">We can&apos;t find that page</h1>
      <p className="mt-2 text-muted-foreground">
        If this was a diagnosis, it may belong to a different account or browser. Sign in to see your saved ones.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/diagnose">Diagnose a problem</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
