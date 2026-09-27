import "server-only";

import Anthropic from "@anthropic-ai/sdk";

import { env } from "@/lib/env";

let client: Anthropic | null = null;

export function getAnthropic() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Missing required env var ANTHROPIC_API_KEY. See .env.example.");
    }
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      // A diagnosis normally takes 15-40s. Keep a bounded worst case so the
      // route (maxDuration 300s) always gets to log the failure.
      timeout: 90_000,
      maxRetries: 1,
    });
  }
  return client;
}

/** Model settings from env; AI_MOCK=1 swaps the API for canned results. */
export function modelOptions() {
  return {
    client: env.aiMock ? ({ messages: null } as never) : getAnthropic(),
    model: env.anthropicModel,
    effort: env.anthropicEffort,
    mock: env.aiMock,
  };
}
