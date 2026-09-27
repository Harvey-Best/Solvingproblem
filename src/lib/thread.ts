import type { Diagnosis } from "@/lib/ai/schema";

/** Follow-up thread types and pure helpers (safe for client components and tests). */

export type ThreadMessage = {
  id: string;
  role: "user" | "assistant";
  content: string | null;
  result_json: Diagnosis | null;
  error: string | null;
  created_at: string;
};

/** A homeowner message and the reply it got (reply is null while none exists). */
export type ThreadExchange = { question: ThreadMessage; reply: ThreadMessage | null };

export function toExchanges(messages: ThreadMessage[]): ThreadExchange[] {
  const exchanges: ThreadExchange[] = [];
  for (const m of messages) {
    if (m.role === "user") exchanges.push({ question: m, reply: null });
    else if (exchanges.length && !exchanges[exchanges.length - 1].reply) exchanges[exchanges.length - 1].reply = m;
  }
  return exchanges;
}

/** Answered turns that produced a diagnosis, in order: what the model sees on the next follow-up. */
export function successfulTurns(exchanges: ThreadExchange[]) {
  return exchanges.flatMap((e) =>
    e.reply?.result_json && e.question.content ? [{ answer: e.question.content, result: e.reply.result_json }] : []
  );
}

/** The most recent diagnosis: the last successful follow-up, else the original. */
export function latestDiagnosis(original: Diagnosis, exchanges: ThreadExchange[]): Diagnosis {
  const turns = successfulTurns(exchanges);
  return turns.length ? turns[turns.length - 1].result : original;
}
