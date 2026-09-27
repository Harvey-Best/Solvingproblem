import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SharedDiagnosis } from "@/components/share/shared-diagnosis";
import { pageMetadata } from "@/lib/seo";
import { getSharedDiagnosis, shareCardPath, shareDescription, sharePath } from "@/lib/share";

/**
 * Kept out of search results, but not out of robots.txt: link unfurlers
 * (iMessage, Slack, WhatsApp, X) respect robots.txt, and they need to read
 * the Open Graph tags and the card image.
 */
const ROBOTS = { index: false, follow: true };

export async function generateMetadata(props: PageProps<"/s/[shareId]">): Promise<Metadata> {
  const { shareId } = await props.params;
  const shared = await getSharedDiagnosis(shareId);
  if (!shared) return { title: "Shared diagnosis", robots: ROBOTS };
  const d = shared.diagnosis;
  return {
    ...pageMetadata({
      title: d.title,
      description: shareDescription(d),
      path: sharePath(shareId),
      image: { url: shareCardPath(shareId, "wide"), alt: `${d.title}: a Home Doctor diagnosis` },
    }),
    robots: ROBOTS,
  };
}

export default async function SharedDiagnosisPage(props: PageProps<"/s/[shareId]">) {
  const { shareId } = await props.params;
  const shared = await getSharedDiagnosis(shareId);
  if (!shared) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6">
      <SharedDiagnosis diagnosis={shared.diagnosis} />
    </main>
  );
}
