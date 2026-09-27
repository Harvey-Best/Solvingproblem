import { SEVERITY_META, SEVERITIES } from "@/lib/diagnosis-meta";
import { GUIDES } from "@/lib/guides";
import { LANDING_FAQS } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

/**
 * llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI
 * assistants and answer engines, built from the same facts as the pages.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.tagline} Upload one to three photos of a household problem, optionally add a sentence and a category, and ${SITE.name} returns a structured diagnosis:`,
    "",
    "- Likely cause, with a confidence level and other possible causes (and how to tell them apart)",
    `- Severity: ${SEVERITIES.map((s) => SEVERITY_META[s].label).join(", ")}`,
    "- Safety warnings, and a DIY verdict (DIY, DIY if handy, or call a pro) with the reasoning",
    "- Step-by-step DIY instructions, tools, and parts with price ranges and Home Depot / Amazon search links",
    "- A typical price range for hiring a professional, and a script of what to tell the pro",
    "- Follow-up questions; answering them re-runs and refines the diagnosis",
    "",
    "Gas smells, sparking or burning, water near electrical, sagging structure and carbon monoxide alarms are always escalated to \"Stop and call a pro now\". The first diagnosis is free and needs no account.",
    "",
    "## App",
    "",
    `- [Diagnose a problem](${absoluteUrl("/diagnose")}): photo-based diagnosis of plumbing, electrical, HVAC, walls and paint, roofs and gutters, appliances, doors and windows, and outdoor problems.`,
    `- [Check a contractor's quote](${absoluteUrl("/quote")}): photograph a quote to see what it covers, what's missing, red flags (deposit over 30%, no license number) and whether the price is in a typical range.`,
    "",
    "## Guides",
    "",
    ...GUIDES.map((g) => `- [${g.title}](${absoluteUrl(`/guides/${g.slug}`)}): ${g.metaDescription}`),
    "",
    "## FAQ",
    "",
    ...LANDING_FAQS.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
    "## Optional",
    "",
    `- [All guides](${absoluteUrl("/guides")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
