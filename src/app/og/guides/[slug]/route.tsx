import { categoryLabel } from "@/lib/diagnosis-meta";
import { GUIDES, getGuide } from "@/lib/guides";
import { renderGuideOgImage } from "@/lib/og/render";

/**
 * Share image for a guide, at a stable URL (/og/guides/<slug>) so the page's
 * Open Graph tags and its Article structured data can both point at it.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/og/guides/[slug]">) {
  const { slug } = await ctx.params;
  const guide = getGuide(slug);
  if (!guide) return new Response("Not found", { status: 404 });
  return renderGuideOgImage({
    eyebrow: guide.category ? `${categoryLabel(guide.category)} guide` : "Home repair guide",
    title: guide.title,
  });
}
