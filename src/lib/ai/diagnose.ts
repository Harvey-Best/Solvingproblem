import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";
import { buildDiagnosisUserText, DIAGNOSIS_PROMPT_VERSION, DIAGNOSIS_SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { normalizeDiagnosis } from "@/lib/ai/safety";
import { diagnosisSchema, type Diagnosis } from "@/lib/ai/schema";
import type { AllowedImageType } from "@/lib/storage-paths";

export type ImageInput = { mediaType: AllowedImageType; base64: string };

export type DiagnosisInput = {
  images: ImageInput[];
  description: string;
  category: string | null;
};

export type RunLog = {
  model: string;
  promptVersion: string;
  attempts: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  rawResponse: string | null;
  /** What we sent, minus image bytes. */
  request: Record<string, unknown>;
};

export type DiagnosisRun =
  | ({ ok: true; diagnosis: Diagnosis; overrides: string[] } & RunLog)
  | ({ ok: false; error: string; errorKind: "invalid_output" | "refusal" | "api_error" } & RunLog);

export type RunOptions = {
  client: Pick<Anthropic, "messages">;
  model: string;
  effort: "low" | "medium" | "high" | "max";
  mock?: boolean;
};

/** Structured-output parse failures get one retry; after that we give up. */
export const MAX_ATTEMPTS = 2;

const outputFormat = zodOutputFormat(diagnosisSchema);

/** Adaptive thinking + effort exist on the 4.6+ and 5.x families; Haiku 4.5 and older lack them. */
export function supportsAdaptiveThinking(model: string) {
  return /claude-(?:opus|sonnet)-4-[6-9]|claude-(?:opus|sonnet|fable|mythos)-5/.test(model);
}

export function parseDiagnosisText(
  text: string
): { ok: true; value: Diagnosis } | { ok: false; error: string } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (err) {
    return { ok: false, error: `Response was not valid JSON: ${(err as Error).message}` };
  }
  const result = diagnosisSchema.safeParse(json);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 5)
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error: `Response did not match schema: ${issues}` };
  }
  return { ok: true, value: result.data };
}

export async function runDiagnosis(input: DiagnosisInput, opts: RunOptions): Promise<DiagnosisRun> {
  const started = Date.now();
  const userText = buildDiagnosisUserText({
    description: input.description,
    category: input.category,
    imageCount: input.images.length,
  });
  const adaptive = supportsAdaptiveThinking(opts.model);
  const log: RunLog = {
    model: opts.mock ? "mock" : opts.model,
    promptVersion: DIAGNOSIS_PROMPT_VERSION,
    attempts: 0,
    inputTokens: 0,
    outputTokens: 0,
    latencyMs: 0,
    rawResponse: null,
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
    const { diagnosis, overrides } = normalizeDiagnosis(MOCK_DIAGNOSIS, input.description);
    return { ok: true, diagnosis, overrides, ...log, attempts: 1, latencyMs: Date.now() - started };
  }

  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model: opts.model,
    max_tokens: 16000,
    system: DIAGNOSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          ...input.images.map(
            (img): Anthropic.ImageBlockParam => ({
              type: "image",
              source: { type: "base64", media_type: img.mediaType, data: img.base64 },
            })
          ),
          { type: "text", text: userText },
        ],
      },
    ],
    ...(adaptive ? { thinking: { type: "adaptive" as const } } : {}),
    output_config: {
      ...(adaptive ? { effort: opts.effort } : {}),
      format: { type: outputFormat.type, schema: outputFormat.schema },
    },
  };

  let lastError = "Unknown error";
  let errorKind: "invalid_output" | "refusal" | "api_error" = "invalid_output";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    log.attempts = attempt;
    let response: Anthropic.Message;
    try {
      response = await opts.client.messages.create(params);
    } catch (err) {
      // The SDK already retries 429/5xx/timeouts, so an error here is final.
      errorKind = "api_error";
      lastError =
        err instanceof Anthropic.APIError
          ? `Anthropic API error ${err.status ?? ""}: ${err.message}`
          : `Request failed: ${(err as Error).message}`;
      break;
    }

    log.inputTokens += response.usage.input_tokens;
    log.outputTokens += response.usage.output_tokens;
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

    const parsed = parseDiagnosisText(text);
    if (parsed.ok) {
      const { diagnosis, overrides } = normalizeDiagnosis(parsed.value, input.description);
      return { ok: true, diagnosis, overrides, ...log, latencyMs: Date.now() - started };
    }
    errorKind = "invalid_output";
    lastError = parsed.error;
  }

  return { ok: false, error: lastError, errorKind, ...log, latencyMs: Date.now() - started };
}
