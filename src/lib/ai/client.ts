import "server-only";

import Anthropic from "@anthropic-ai/sdk";

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
