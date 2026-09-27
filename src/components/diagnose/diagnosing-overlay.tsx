"use client";

import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

const MESSAGES = [
  "Looking closely at your photos…",
  "Checking for anything unsafe…",
  "Working out the most likely cause…",
  "Pricing parts and pro labor…",
  "Writing up your fix…",
];

export function DiagnosingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 px-6 text-center backdrop-blur-sm"
    >
      <div className="relative grid size-24 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
        <span className="absolute inset-2 rounded-full bg-primary/10" />
        <Stethoscope className="relative size-10 text-primary" />
      </div>
      <div className="space-y-2">
        <p key={index} className="animate-in fade-in slide-in-from-bottom-1 text-lg font-semibold duration-500">
          {MESSAGES[index]}
        </p>
        <p className="text-sm text-muted-foreground">This usually takes 20–40 seconds. Keep this screen open.</p>
      </div>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[5000ms] ease-linear"
          style={{ width: `${Math.min(95, ((index + 1) / MESSAGES.length) * 95)}%` }}
        />
      </div>
    </div>
  );
}
