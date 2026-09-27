import type { CallLog } from "@/lib/ai/structured";

/** Maps a model run's log onto the quality-review columns shared by every AI table. */
export function logColumns(run: CallLog & { model: string; promptVersion: string; latencyMs: number; request?: unknown }) {
  return {
    model: run.model,
    prompt_version: run.promptVersion,
    raw_response: run.rawResponse,
    attempts: run.attempts,
    input_tokens: run.inputTokens,
    output_tokens: run.outputTokens,
    cache_read_tokens: run.cacheReadTokens,
    cache_write_tokens: run.cacheWriteTokens,
    latency_ms: run.latencyMs,
  };
}
