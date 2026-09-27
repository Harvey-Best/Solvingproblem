import { normalizeQuoteCheck, type QuoteGuardFlag } from "@/lib/ai/quote-guard";
import { MOCK_QUOTE } from "@/lib/ai/quote-mock";
import { buildQuoteUserText, QUOTE_PROMPT_VERSION, QUOTE_SYSTEM_PROMPT } from "@/lib/ai/quote-prompt";
import { quoteCheckSchema, type QuoteCheck } from "@/lib/ai/quote-schema";
import {
  callLog,
  callStructured,
  EMPTY_CALL_LOG,
  imageBlocks,
  supportsAdaptiveThinking,
  type CallLog,
  type ErrorKind,
  type ModelOptions,
} from "@/lib/ai/structured";
import type { ImageInput } from "@/lib/ai/diagnose";

export type QuoteCheckInput = { images: ImageInput[]; description: string };

type QuoteLog = CallLog & {
  model: string;
  promptVersion: string;
  latencyMs: number;
  request: Record<string, unknown>;
};

export type QuoteCheckRun =
  | ({ ok: true; quote: QuoteCheck; flags: QuoteGuardFlag[] } & QuoteLog)
  | ({ ok: false; error: string; errorKind: ErrorKind } & QuoteLog);

export async function runQuoteCheck(
  input: QuoteCheckInput,
  opts: ModelOptions & { mock?: boolean }
): Promise<QuoteCheckRun> {
  const started = Date.now();
  const userText = buildQuoteUserText({ description: input.description, imageCount: input.images.length });
  const adaptive = supportsAdaptiveThinking(opts.model);
  const base = {
    model: opts.mock ? "mock" : opts.model,
    promptVersion: QUOTE_PROMPT_VERSION,
    request: {
      user_text: userText,
      image_count: input.images.length,
      image_media_types: input.images.map((i) => i.mediaType),
      effort: adaptive ? opts.effort : null,
      thinking: adaptive ? "adaptive" : null,
    },
  };

  if (opts.mock) {
    await new Promise((r) => setTimeout(r, 1200));
    const { quote, flags } = normalizeQuoteCheck(MOCK_QUOTE);
    return { ok: true, quote, flags, ...EMPTY_CALL_LOG, ...base, latencyMs: Date.now() - started };
  }

  const result = await callStructured({
    ...opts,
    system: QUOTE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: [...imageBlocks(input.images), { type: "text", text: userText }] }],
    schema: quoteCheckSchema,
  });
  const latencyMs = Date.now() - started;
  if (!result.ok) {
    return { ok: false, error: result.error, errorKind: result.errorKind, ...callLog(result), ...base, latencyMs };
  }
  const { quote, flags } = normalizeQuoteCheck(result.value);
  return { ok: true, quote, flags, ...callLog(result), ...base, latencyMs };
}
