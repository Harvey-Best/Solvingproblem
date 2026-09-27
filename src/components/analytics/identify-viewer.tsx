"use client";

import { useEffect } from "react";

import { syncIdentity } from "@/lib/analytics";

/**
 * Rendered next to the nav, which already knows who is signed in, so no page
 * does extra work for analytics. Identifies on sign-in, resets after sign-out.
 */
export function IdentifyViewer({ userId }: { userId: string | null }) {
  useEffect(() => {
    syncIdentity(userId);
  }, [userId]);
  return null;
}
