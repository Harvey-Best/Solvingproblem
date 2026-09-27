"use client";

import { useActionState, useState } from "react";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

import { sendMagicLink, verifyEmailCode, type LoginState } from "./actions";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function LoginForm({ next, linkError }: { next: string; linkError: boolean }) {
  const [emailState, sendAction, sending] = useActionState<LoginState, FormData>(sendMagicLink, {
    step: "email",
    error: linkError ? "That sign-in link expired or was already used. Send a new one." : undefined,
  });
  const [codeState, verifyAction, verifying] = useActionState<LoginState, FormData>(
    verifyEmailCode,
    { step: "email" }
  );
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Once the code form has been used, its state wins (it carries code errors).
  const state = codeState.step === "code" ? codeState : emailState;

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setGoogleError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setGoogleLoading(false);
      setGoogleError("Google sign-in isn't available right now. Use email instead.");
    }
  }

  if (state.step === "code") {
    return (
      <div className="space-y-5">
        <div className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
          <p className="flex items-center gap-2 font-medium">
            <Mail className="size-4" /> Check {state.email}
          </p>
          <p className="mt-1">Tap the link in the email, or type the code here.</p>
        </div>
        <form action={verifyAction} className="space-y-3">
          <input type="hidden" name="email" value={state.email} />
          <input type="hidden" name="next" value={next} />
          <Label htmlFor="code">Code from the email</Label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]*"
            maxLength={12}
            placeholder="123456"
            className="text-center text-2xl tracking-[0.4em]"
            autoFocus
            required
          />
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={verifying}>
            {verifying && <Loader2 className="animate-spin" />} Sign in
          </Button>
        </form>
        <form action={sendAction}>
          <input type="hidden" name="email" value={state.email} />
          <input type="hidden" name="next" value={next} />
          <Button type="submit" variant="link" className="w-full" disabled={sending}>
            Resend email
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={signInWithGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />} Continue with Google
      </Button>
      {googleError && <p className="text-sm text-destructive">{googleError}</p>}

      <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form action={sendAction} className="space-y-3">
        <input type="hidden" name="next" value={next} />
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.email}
          required
        />
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={sending}>
          {sending && <Loader2 className="animate-spin" />} Email me a sign-in link
        </Button>
      </form>
    </div>
  );
}
