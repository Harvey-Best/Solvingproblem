"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Submit button that shows a spinner while its form's server action runs (e.g. redirecting to Stripe). */
export function PendingButton({ children, pendingLabel, ...props }: React.ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> {pendingLabel ?? "One moment…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
