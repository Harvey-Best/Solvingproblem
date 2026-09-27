import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(site)/login/actions";
import { getViewer } from "@/lib/viewer";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-(image:--grad) text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
        </svg>
      </span>
      <span className="font-display text-[21px] font-semibold tracking-tight">Home Doctor</span>
    </span>
  );
}

export async function SiteHeader() {
  const { userId } = await getViewer();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4">
        <Link href="/" aria-label="Home Doctor home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {userId ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/diagnose">New diagnosis</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
