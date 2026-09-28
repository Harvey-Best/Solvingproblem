"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";

import { signInWithGoogleCredential } from "./actions";

type CredentialResponse = { credential?: string };
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        nonce: string;
        ux_mode: "popup";
        context: "signin";
        itp_support: boolean;
        auto_select: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "pill";
          logo_alignment: "center";
          width: number;
          locale: string;
        }
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

/** How long to wait for Google's script before offering the redirect button instead. */
const LOAD_TIMEOUT_MS = 6000;

function randomNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Google's own "Sign in with Google" button. Sign-in happens in a Google popup
 * on our page, so Google's screen names this site rather than Supabase's
 * address. The ID token it returns goes to a server action, which signs in
 * with Supabase. If Google's script can't load, `fallback` (the redirect
 * flow) is shown instead.
 */
export function GoogleSignInButton({
  clientId,
  next,
  fallback,
}: {
  clientId: string;
  next: string;
  fallback: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const nonce = useRef<{ raw: string; hashed: string } | null>(null);
  const scriptReady = useRef(false);
  const initialized = useRef(false);
  const [rendered, setRendered] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Runs once both Google's script and the nonce are ready, whichever is last.
  const init = useCallback(() => {
    const google = window.google;
    if (initialized.current || !scriptReady.current || !nonce.current || !google || !container.current) return;
    initialized.current = true;
    const { raw, hashed } = nonce.current;
    try {
      google.accounts.id.initialize({
        client_id: clientId,
        nonce: hashed,
        ux_mode: "popup",
        context: "signin",
        itp_support: true,
        auto_select: false,
        callback: ({ credential }) => {
          if (!credential) return;
          setError(null);
          startTransition(async () => {
            const result = await signInWithGoogleCredential(credential, raw, next);
            if ("error" in result) setError(result.error);
            else window.location.assign(result.redirectTo);
          });
        },
      });
      google.accounts.id.renderButton(container.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width: Math.max(200, Math.min(400, container.current.clientWidth)),
        locale: "en",
      });
      setRendered(true);
    } catch (err) {
      console.error("Google sign-in button failed", err);
      setFailed(true);
    }
  }, [clientId, next]);

  useEffect(() => {
    const raw = randomNonce();
    void sha256Hex(raw).then((hashed) => {
      nonce.current = { raw, hashed };
      init();
    });
  }, [init]);

  useEffect(() => {
    if (rendered || failed) return;
    const timer = setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [rendered, failed]);

  if (failed && !rendered) return <>{fallback}</>;

  return (
    <div className="space-y-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => {
          scriptReady.current = true;
          init();
        }}
        onError={() => setFailed(true)}
      />
      <div className="relative">
        {/* Google renders its button into this box. */}
        <div ref={container} className="flex min-h-11 w-full items-center justify-center" />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full border bg-card text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        {pending && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-card/90 text-sm font-medium">
            <Loader2 className="size-4 animate-spin" /> Signing you in…
          </div>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
