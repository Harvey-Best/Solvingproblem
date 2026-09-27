import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";
import { normalizeDiagnosis } from "@/lib/ai/safety";
import { renderShareCardImage } from "@/lib/og/render";
import { toPublicDiagnosis } from "@/lib/share";

/**
 * Dev-only preview of the share images with canned data:
 * /dev/share/card (wide) and /dev/share/card?format=square. Add
 * ?text=I+smell+gas for the safety escalation, or ?title=... to try a title.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const params = new URL(request.url).searchParams;
  const { diagnosis } = normalizeDiagnosis(MOCK_DIAGNOSIS, params.get("text") ?? "");
  const title = params.get("title");
  return renderShareCardImage(
    toPublicDiagnosis(title ? { ...diagnosis, title } : diagnosis),
    params.get("format") === "square" ? "square" : "wide",
    { headers: { "Cache-Control": "no-store" } }
  );
}
