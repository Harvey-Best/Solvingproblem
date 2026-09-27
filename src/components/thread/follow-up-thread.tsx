"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, CornerDownRight, Loader2, MessageCircle, RefreshCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";
import type { ThreadExchange } from "@/lib/thread";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 1000;
/** Matches the follow-up route's limit for the suggested question being answered. */
const MAX_REPLY_TO = 500;

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-line break-words rounded-2xl rounded-br-md bg-(image:--grad) px-4 py-2.5 text-[15px] leading-relaxed text-white">
        {children}
      </p>
    </div>
  );
}

function ReplyBubble({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[85%] break-words rounded-2xl rounded-bl-md border px-4 py-2.5 text-[15px] leading-relaxed",
          muted ? "bg-muted text-muted-foreground" : "bg-card"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Follow-up conversation under a diagnosis. Each answer re-runs the full
 * diagnosis server-side; on success the page refreshes so the result above
 * shows the updated version.
 */
export function FollowUpThread({
  diagnosisId,
  exchanges,
  suggestions,
  remaining,
  signedIn,
  locked = false,
}: {
  diagnosisId: string;
  exchanges: ThreadExchange[];
  suggestions: string[];
  remaining: number;
  signedIn: boolean;
  /** The viewer's trial or subscription has ended. */
  locked?: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; signup?: boolean; plans?: boolean } | null>(null);
  const [isRefreshing, startTransition] = useTransition();
  const input = useRef<HTMLTextAreaElement>(null);

  const sending = pending !== null || isRefreshing;
  const outOfTurns = remaining <= 0;

  async function send() {
    const answer = text.trim();
    if (!answer || sending) return;
    const message = replyTo ? `Q: ${replyTo}\nA: ${answer}` : answer;
    setPending(message);
    setError(null);
    try {
      const res = await fetch(`/api/diagnose/${diagnosisId}/followup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        // The question goes separately, so the answer alone gets the full length limit.
        body: JSON.stringify({ message: answer, ...(replyTo ? { replyTo: replyTo.slice(0, MAX_REPLY_TO) } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        track("followup_sent", {
          answered_suggestion: Boolean(replyTo),
          severity: data.severity,
          confidence: data.confidence,
          turn: exchanges.length + 1,
        });
        // Clear the draft in the same transition as the refresh, so the
        // optimistic bubble is swapped for the saved one in a single paint.
        startTransition(() => {
          setPending(null);
          setText("");
          setReplyTo(null);
          router.refresh();
        });
        return;
      }
      setError({
        message: data.message ?? "Something went wrong. Please try again.",
        signup: data.code === "signup_required",
        plans: data.code === "subscription_required",
      });
    } catch {
      setError({ message: "We lost the connection. Check your signal and try again." });
    }
    setPending(null);
  }

  return (
    <Card id="follow-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="size-4 text-primary" /> Help me be more sure
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Answer a question or add a detail, and I&apos;ll update the diagnosis above.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {(exchanges.length > 0 || pending) && (
          <div className="space-y-3" aria-live="polite">
            {exchanges.map(({ question, reply }) => (
              <div key={question.id} className="space-y-3">
                <UserBubble>{question.content}</UserBubble>
                {reply?.result_json ? (
                  <ReplyBubble>
                    <p>{reply.content || "I've updated the diagnosis."}</p>
                    <a href="#top" className="tap-area mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <CornerDownRight className="size-3" /> Diagnosis updated above
                    </a>
                  </ReplyBubble>
                ) : reply ? (
                  <ReplyBubble muted>I couldn&apos;t update the diagnosis that time. Try sending it again.</ReplyBubble>
                ) : null}
              </div>
            ))}
            {pending && (
              <>
                <UserBubble>{pending}</UserBubble>
                <ReplyBubble muted>
                  <span className="flex items-center gap-2">
                    <RefreshCcw className="size-4 shrink-0 animate-spin" /> Re-checking with your answer… (20–40s)
                  </span>
                </ReplyBubble>
              </>
            )}
          </div>
        )}

        {locked ? (
          <div className="rounded-xl bg-muted p-3 text-sm">
            Your free trial has ended, so follow-ups are paused.{" "}
            <Link href="/pricing" className="font-medium text-primary underline">
              See plans
            </Link>
          </div>
        ) : outOfTurns ? (
          <div className="rounded-xl bg-muted p-3 text-sm">
            {signedIn ? (
              "That's the most follow-ups for one diagnosis. For something new, start a fresh diagnosis with new photos."
            ) : (
              <>
                Create a free account to keep asking about this one.{" "}
                <Link href={`/login?reason=save&next=/d/${diagnosisId}`} className="font-medium text-primary underline">
                  Sign up
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {suggestions.length > 0 && !replyTo && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tap one to answer</p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={sending}
                      onClick={() => {
                        setReplyTo(s);
                        // Straight to the answer box (opens the keyboard on phones).
                        input.current?.focus();
                      }}
                      className="min-h-11 break-words rounded-xl border bg-card px-3.5 py-2.5 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.99] disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {replyTo && (
                <div className="flex items-start justify-between gap-2 rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                  <span className="min-w-0 break-words">
                    <span className="font-semibold">Answering:</span> {replyTo}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    disabled={sending}
                    aria-label="Cancel answering this question"
                    className="tap-area -mr-1 shrink-0 rounded-full p-1 transition-colors hover:bg-primary/10 disabled:opacity-50"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <Textarea
                  ref={input}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={MAX_LENGTH}
                  rows={2}
                  disabled={sending}
                  placeholder={replyTo ? "Your answer…" : "e.g. It only drips when the hot water is on."}
                  aria-label="Your answer"
                  className="min-h-12"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={send}
                  disabled={!text.trim() || sending}
                  aria-label={sending ? "Sending" : "Send"}
                  className="size-12 shrink-0"
                >
                  {sending ? <Loader2 className="size-5 animate-spin" /> : <ArrowUp className="size-5" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {remaining} follow-up{remaining === 1 ? "" : "s"} left on this diagnosis.
              </p>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {error.message}{" "}
            {error.signup && (
              <Link href={`/login?reason=save&next=/d/${diagnosisId}`} className="font-medium underline">
                Create a free account
              </Link>
            )}
            {error.plans && (
              <Link href="/pricing" className="font-medium underline">
                See plans
              </Link>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
