import { renderShareCardImage } from "@/lib/og/render";
import { getSharedDiagnosis, type ShareCardFormat } from "@/lib/share";

/**
 * Share images for a shared diagnosis, at stable URLs the share page's Open
 * Graph tags and the share button can point at: /og/share/<shareId> (wide,
 * 1200x630, for link previews) and ?format=square (1080x1080, for stories).
 * CDN-cacheable for 5 minutes, so "Stop sharing" takes effect within that.
 */
const CACHE_CONTROL = "public, max-age=300, s-maxage=300";

export async function GET(request: Request, ctx: RouteContext<"/og/share/[shareId]">) {
  const { shareId } = await ctx.params;
  const format: ShareCardFormat = new URL(request.url).searchParams.get("format") === "square" ? "square" : "wide";

  const shared = await getSharedDiagnosis(shareId);
  if (!shared) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  }
  return renderShareCardImage(shared.diagnosis, format, { headers: { "Cache-Control": CACHE_CONTROL } });
}
