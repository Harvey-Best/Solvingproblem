import Link from "next/link";

import { IdentifyViewer } from "@/components/analytics/identify-viewer";
import { Button } from "@/components/ui/button";
import { getViewer } from "@/lib/viewer";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-(image:--grad) text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
        </svg>
      </span>
      {/* Below 360px only the mark shows, so the header stays one row. */}
      <span className="whitespace-nowrap font-display text-[21px] font-semibold tracking-tight max-[359px]:sr-only">
        Home Doctor
      </span>
    </span>
  );
}

/** 44px tall on phones, with tight padding so the logo and two links fit on one row at 360px. */
const NAV_LINK = "h-11 px-2 sm:h-9 sm:px-3";

export async function SiteHeader() {
  const { userId } = await getViewer();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-1 px-4">
        <Link href="/" aria-label="Home Doctor home" className="flex h-11 shrink-0 items-center rounded-xl">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          <IdentifyViewer userId={userId} />
          {/* Phones get guides from the footer, so the header stays one row at 360px. */}
          <Button asChild variant="ghost" size="sm" className={`${NAV_LINK} hidden sm:inline-flex`}>
            <Link href="/guides">Guides</Link>
          </Button>
          {userId ? (
            <>
              <Button asChild variant="ghost" size="sm" className={NAV_LINK}>
                <Link href="/history">History</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className={NAV_LINK}>
                <Link href="/account">Account</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className={NAV_LINK}>
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className={NAV_LINK}>
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
