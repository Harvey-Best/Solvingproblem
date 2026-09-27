import type Anthropic from "@anthropic-ai/sdk";

import { MOCK_DIAGNOSIS, MOCK_FOLLOW_UP } from "@/lib/ai/mock";
import {
  buildDiagnosisUserText,
  buildFollowUpText,
  DIAGNOSIS_PROMPT_VERSION,
  DIAGNOSIS_SYSTEM_PROMPT,
} from "@/lib/ai/prompt";
import { normalizeDiagnosis } from "@/lib/ai/safety";
import { diagnosisSchema, type Diagnosis } from "@/lib/ai/schema";
import {
  callLog,
  callStructured,
  EMPTY_CALL_LOG,
  imageBlocks,
  parseStructured,
  supportsAdaptiveThinking,
  type CallLog,
  type ErrorKind,
  type ModelOptions,
} from "@/lib/ai/structured";
import type { AllowedImageType } from "@/lib/storage-paths";

export { MAX_ATTEMPTS, supportsAdaptiveThinking } from "@/lib/ai/structured";

export type ImageInput = { mediaType: AllowedImageType; base64: string };

/** One answered follow-up: what the homeowner said and the diagnosis it produced. */
export type FollowUpTurn = { answer: string; result: Diagnosis };

export type DiagnosisInput = {
  images: ImageInput[];
  description: string;
  category: string | null;
  /** For follow-ups: the first result and every answered turn since. */
  history?: { original: Diagnosis; turns: FollowUpTurn[] };
  /** For follow-ups: the homeowner's new message. */
  newAnswer?: string;
};

export type RunLog = CallLog & {
  model: string;
  promptVersion: string;
  latencyMs: number;
  /** What we sent, minus image bytes. */
  request: Record<string, unknown>;
};

export type DiagnosisRun =
  | ({ ok: true; diagnosis: Diagnosis; overrides: string[] } & RunLog)
  | ({ ok: false; error: string; errorKind: ErrorKind } & RunLog);

export type RunOptions = ModelOptions & { mock?: boolean };

export function parseDiagnosisText(text: string) {
  return parseStructured(diagnosisSchema, text);
}

const cached = { type: "ephemeral" as const };

/**
 * The conversation sent to the model. The first user turn (photos + text) is
 * byte-identical on every call for a diagnosis and carries a cache
 * breakpoint, so follow-ups re-read the photos from the prompt cache instead
 * of paying for them again. The newest user turn gets a second breakpoint so
 * the next follow-up can reuse the whole thread.
 */
export function buildDiagnosisMessages(input: DiagnosisInput): Anthropic.MessageParam[] {
  const userText = buildDiagnosisUserText({
    description: input.description,
    category: input.category,
    imageCount: input.images.length,
  });
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: [...imageBlocks(input.images), { type: "text", text: userText, cache_control: cached }],
    },
  ];
  if (input.history && input.newAnswer) {
    messages.push({ role: "assistant", content: JSON.stringify(input.history.original) });
    for (const turn of input.history.turns) {
      messages.push({ role: "user", content: buildFollowUpText(turn.answer) });
      messages.push({ role: "assistant", content: JSON.stringify(turn.result) });
    }
    messages.push({
      role: "user",
      content: [{ type: "text", text: buildFollowUpText(input.newAnswer), cache_control: cached }],
    });
  }
  return messages;
}

/** Everything the homeowner has said, for the text-based safety guard. */
function allHomeownerText(input: DiagnosisInput) {
  return [input.description, ...(input.history?.turns.map((t) => t.answer) ?? []), input.newAnswer ?? ""]
    .filter(Boolean)
    .join("\n");
}

export async function runDiagnosis(input: DiagnosisInput, opts: RunOptions): Promise<DiagnosisRun> {
  const started = Date.now();
  const isFollowUp = Boolean(input.history && input.newAnswer);
  const adaptive = supportsAdaptiveThinking(opts.model);
  const messages = buildDiagnosisMessages(input);
  const base = {
    model: opts.mock ? "mock" : opts.model,
    promptVersion: DIAGNOSIS_PROMPT_VERSION,
    request: {
      user_text: buildDiagnosisUserText({
        description: input.description,
        category: input.category,
        imageCount: input.images.length,
      }),
      image_count: input.images.length,
      image_media_types: input.images.map((i) => i.mediaType),
      follow_up: isFollowUp ? { prior_turns: input.history!.turns.length, answer: input.newAnswer } : null,
      effort: adaptive ? opts.effort : null,
      thinking: adaptive ? "adaptive" : null,
    },
  };
  const guardText = allHomeownerText(input);

  if (opts.mock) {
    await new Promise((r) => setTimeout(r, 1200));
    const { diagnosis, overrides } = normalizeDiagnosis(isFollowUp ? MOCK_FOLLOW_UP : MOCK_DIAGNOSIS, guardText);
    return { ok: true, diagnosis, overrides, ...EMPTY_CALL_LOG, ...base, latencyMs: Date.now() - started };
  }

  const result = await callStructured({
    ...opts,
    system: DIAGNOSIS_SYSTEM_PROMPT,
    messages,
    schema: diagnosisSchema,
  });
  const latencyMs = Date.now() - started;

  if (!result.ok) {
    return { ok: false, error: result.error, errorKind: result.errorKind, ...callLog(result), ...base, latencyMs };
  }
  const { diagnosis, overrides } = normalizeDiagnosis(result.value, guardText);
  if (!isFollowUp) diagnosis.what_changed = "";
  return { ok: true, diagnosis, overrides, ...callLog(result), ...base, latencyMs };
}
