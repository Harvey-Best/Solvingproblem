import Link from "next/link";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ViewerLinks } from "@/components/viewer-links";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-[10px] bg-(image:--grad) text-white">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
        </svg>
      </span>
      {/* Below 380px only the mark shows, so the header stays one row with the Diagnose button. */}
      <span className="whitespace-nowrap font-display text-[18px] font-semibold tracking-tight max-[379px]:sr-only sm:text-[21px]">
        Home Doctor
      </span>
    </span>
  );
}

/** 44px tall on phones, with tight padding so the logo, a link and the Diagnose button fit on one row at 360px. */
const NAV_LINK = "h-11 px-2 sm:h-9 sm:px-3";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-1 px-4">
        <Link href="/" aria-label="Home Doctor home" className="flex h-11 shrink-0 items-center rounded-xl">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {/* Phones get guides from the footer, so the header stays one row at 360px. */}
          <Button asChild variant="ghost" size="sm" className={`${NAV_LINK} hidden sm:inline-flex`}>
            <Link href="/guides">Guides</Link>
          </Button>
          {/* On phones, Pricing is in the footer and History is on the Account page. */}
          <ViewerLinks button linkClassName={NAV_LINK} pricingClassName="max-sm:hidden" historyClassName="max-sm:hidden" />
          <Button asChild size="sm" className="ml-1 h-11 px-4 sm:h-9 sm:px-3.5">
            <Link href="/diagnose">
              <Camera className="max-sm:hidden" /> Diagnose
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
