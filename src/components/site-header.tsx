import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(site)/login/actions";
import { getViewer } from "@/lib/viewer";

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M12 12.5v5M9.5 15h5" />
        </svg>
      </span>
      Home Doctor
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
