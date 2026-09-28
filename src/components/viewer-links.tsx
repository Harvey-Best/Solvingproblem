"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { syncIdentity } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ViewerState = { known: false } | { known: true; userId: string | null };

/**
 * Who's signed in, read in the browser from the Supabase session cookie (no
 * network call unless the token needs refreshing). Headers use this instead
 * of reading cookies on the server, so pages that don't depend on the viewer
 * (guides, legal pages, the landing page) can be prerendered and cached.
 * Only for display: anything that matters is checked on the server.
 */
function useViewer(): ViewerState {
  const [state, setState] = useState<ViewerState>({ known: false });
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      queueMicrotask(() => setState({ known: true, userId: null }));
      return;
    }
    const supabase = createClient();
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setState({ known: true, userId: data.session?.user.id ?? null });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ known: true, userId: session?.user.id ?? null });
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.known) syncIdentity(state.userId);
  }, [state]);

  return state;
}

/**
 * The viewer-dependent header links: History and Account when signed in,
 * Pricing and Sign in otherwise. Until the session is read (a moment after
 * load) it holds the space, so nothing jumps.
 */
export function ViewerLinks({
  linkClassName,
  pricingClassName,
  historyClassName,
  button = false,
}: {
  linkClassName: string;
  /** Extra classes for the Pricing link (e.g. hidden on phones). */
  pricingClassName?: string;
  /** Extra classes for the History link (e.g. hidden on phones, where Account links to it). */
  historyClassName?: string;
  /** Render as ghost Buttons (site header) instead of plain links (landing). */
  button?: boolean;
}) {
  const viewer = useViewer();

  if (!viewer.known) return <span aria-hidden className="inline-block h-11 w-32 sm:h-9" />;

  const links: { href: string; label: string; className?: string }[] = viewer.userId
    ? [
        { href: "/history", label: "History", className: historyClassName },
        { href: "/account", label: "Account" },
      ]
    : [
        { href: "/pricing", label: "Pricing", className: pricingClassName },
        { href: "/login", label: "Sign in" },
      ];

  return (
    <>
      {links.map((l) =>
        button ? (
          <Button key={l.href} asChild variant="ghost" size="sm" className={cn(linkClassName, l.className)}>
            <Link href={l.href}>{l.label}</Link>
          </Button>
        ) : (
          <Link key={l.href} href={l.href} className={cn(linkClassName, l.className)}>
            {l.label}
          </Link>
        )
      )}
    </>
  );
}
