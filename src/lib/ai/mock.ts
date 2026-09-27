import type { Diagnosis } from "@/lib/ai/schema";

/** Canned result for AI_MOCK=1 (local UI work without spending tokens). */
export const MOCK_DIAGNOSIS: Diagnosis = {
  title: "Worn faucet cartridge",
  category: "plumbing",
  likely_cause:
    "This looks like a worn cartridge inside the faucet handle. The rubber seals on it harden over time and let water seep past when the handle is off.",
  confidence: "medium",
  alternative_causes: [
    {
      cause: "Worn O-rings around the spout",
      how_to_tell: "If water leaks from the base of the spout rather than the tip, it's the O-rings.",
    },
    {
      cause: "Mineral buildup on the valve seat",
      how_to_tell: "White crusty deposits around the aerator or handle point to hard water scale.",
    },
  ],
  severity: "fix_soon",
  severity_reason:
    "A steady drip wastes a few hundred gallons a month and can stain the sink, but it isn't damaging anything yet.",
  safety_warnings: [],
  diy_verdict: "diy",
  diy_verdict_reason: "It's a swap of one part with basic tools, and the water is easy to shut off.",
  time_estimate: "30-45 minutes",
  diy_steps: [
    "Shut off both valves under the sink, then open the faucet to drain the line.",
    "Put a rag in the drain so small parts can't fall in.",
    "Pry off the decorative cap on the handle and remove the screw underneath.",
    "Pull off the handle and unscrew the retaining nut or clip holding the cartridge.",
    "Pull the old cartridge straight up and take it to the store to match it exactly.",
    "Push the new cartridge in with the same orientation, reassemble, and turn the water back on slowly.",
  ],
  tools_needed: ["Adjustable wrench", "Phillips screwdriver", "Flathead screwdriver", "Rag"],
  parts: [
    {
      name: "Replacement faucet cartridge (bring the old one to match)",
      price_low: 12,
      price_high: 35,
      search_query: "single handle kitchen faucet replacement cartridge",
    },
    {
      name: "Silicone faucet grease",
      price_low: 4,
      price_high: 8,
      search_query: "plumber's silicone faucet grease",
    },
  ],
  pro_cost_range: {
    low: 150,
    high: 300,
    note: "Typical range; varies by region and access. Higher for an after-hours call or if the faucet is corroded and needs replacing.",
  },
  what_to_tell_the_pro:
    "My single-handle kitchen faucet drips from the spout when it's off. I think the cartridge is worn. Can you give me an itemized quote for replacing the cartridge before you start?",
  follow_up_questions: [
    "Does the drip come from the tip of the spout or from around the handle?",
    "Do you know the faucet brand? It's usually printed on the base or handle.",
  ],
};
