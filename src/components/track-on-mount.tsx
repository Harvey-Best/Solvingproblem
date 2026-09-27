"use client";

import { useEffect, useRef } from "react";

import { track, type AnalyticsEvent } from "@/lib/analytics";

export function TrackOnMount({
  event,
  properties,
}: {
  event: AnalyticsEvent;
  properties?: Record<string, unknown>;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, properties);
  }, [event, properties]);
  return null;
}
