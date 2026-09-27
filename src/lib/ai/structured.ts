import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

/**
 * One structured-output call with the retry policy every feature shares:
 * the API constrains the response to the JSON schema, we re-validate with
 * zod, retry once on a bad or truncated response, and never retry refusals
 * or API errors (the SDK already retried transient failures).
 */

export type Effort = "low" | "medium" | "high" | "max";
export type ErrorKind = "invalid_output" | "refusal" | "api_error";

export type ModelOptions = {
  client: Pick<Anthropic, "messages">;
  model: string;
  effort: Effort;
};

export type CallLog = {
  attempts: number;
  /** Total prompt tokens, including cached ones. */
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  rawResponse: string | null;
};

export type StructuredResult<T> = CallLog &
  ({ ok: true; value: T } | { ok: false; error: string; errorKind: ErrorKind });

export const MAX_ATTEMPTS = 2;

export function callLog(r: CallLog): CallLog {
  return {
    attempts: r.attempts,
    inputTokens: r.inputTokens,
    outputTokens: r.outputTokens,
    cacheReadTokens: r.cacheReadTokens,
    cacheWriteTokens: r.cacheWriteTokens,
    rawResponse: r.rawResponse,
  };
}

export const EMPTY_CALL_LOG: CallLog = {
  attempts: 1,
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  cacheWriteTokens: 0,
  rawResponse: null,
};

/** Adaptive thinking + effort exist on the 4.6+ and 5.x families; Haiku 4.5 and older lack them. */
export function supportsAdaptiveThinking(model: string) {
  return /claude-(?:opus|sonnet)-4-[6-9]|claude-(?:opus|sonnet|fable|mythos)-5/.test(model);
}

export function parseStructured<T>(
  schema: z.ZodType<T>,
  text: string
): { ok: true; value: T } | { ok: false; error: string } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (err) {
    return { ok: false, error: `Response was not valid JSON: ${(err as Error).message}` };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 5)
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error: `Response did not match schema: ${issues}` };
  }
  return { ok: true, value: result.data };
}

export async function callStructured<T>(
  opts: ModelOptions & {
    system: string;
    messages: Anthropic.MessageParam[];
    schema: z.ZodType<T>;
    maxTokens?: number;
  }
): Promise<StructuredResult<T>> {
  const format = zodOutputFormat(opts.schema);
  const adaptive = supportsAdaptiveThinking(opts.model);
  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model: opts.model,
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: opts.messages,
    ...(adaptive ? { thinking: { type: "adaptive" as const } } : {}),
    output_config: {
      ...(adaptive ? { effort: opts.effort } : {}),
      format: { type: format.type, schema: format.schema },
    },
  };

  const log: CallLog = {
    attempts: 0,
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    rawResponse: null,
  };
  let lastError = "Unknown error";
  let errorKind: ErrorKind = "invalid_output";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    log.attempts = attempt;
    let response: Anthropic.Message;
    try {
      response = await opts.client.messages.create(params);
    } catch (err) {
      errorKind = "api_error";
      lastError =
        err instanceof Anthropic.APIError
          ? `Anthropic API error ${err.status ?? ""}: ${err.message}`
          : `Request failed: ${(err as Error).message}`;
      break;
    }

    const usage = response.usage;
    const cacheRead = usage.cache_read_input_tokens ?? 0;
    const cacheWrite = usage.cache_creation_input_tokens ?? 0;
    log.inputTokens += usage.input_tokens + cacheRead + cacheWrite;
    log.outputTokens += usage.output_tokens;
    log.cacheReadTokens += cacheRead;
    log.cacheWriteTokens += cacheWrite;

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    log.rawResponse = text || null;

    if (response.stop_reason === "refusal") {
      errorKind = "refusal";
      lastError = "The model declined to answer.";
      break;
    }
    if (response.stop_reason === "max_tokens") {
      errorKind = "invalid_output";
      lastError = "Response was cut off (max_tokens).";
      continue;
    }

    const parsed = parseStructured(opts.schema, text);
    if (parsed.ok) return { ok: true, value: parsed.value, ...log };
    errorKind = "invalid_output";
    lastError = parsed.error;
  }

  return { ok: false, error: lastError, errorKind, ...log };
}

/** Image blocks in the shape the Messages API expects. */
export function imageBlocks(
  images: { mediaType: "image/jpeg" | "image/png" | "image/webp"; base64: string }[]
): Anthropic.ImageBlockParam[] {
  return images.map((img) => ({
    type: "image",
    source: { type: "base64", media_type: img.mediaType, data: img.base64 },
  }));
}
