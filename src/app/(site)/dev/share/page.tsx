import { notFound } from "next/navigation";

import { DiagnosisResult } from "@/components/result/diagnosis-result";
import { ShareButton } from "@/components/share/share-button";
import { SharedDiagnosis } from "@/components/share/shared-diagnosis";
import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";
import { normalizeDiagnosis } from "@/lib/ai/safety";
import { toPublicDiagnosis } from "@/lib/share";

/**
 * Dev-only preview of the public share page (/s/<shareId>) with canned data.
 * ?text=I+smell+gas shows the safety escalation, ?title=... tries a title, and
 * ?view=owner shows the share button on the result page, before and after
 * sharing (its buttons need a real diagnosis to work).
 * The share images are at /dev/share/card and /dev/share/card?format=square.
 */
export default async function DevSharePreview(props: PageProps<"/dev/share">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { text, title, view } = await props.searchParams;
  const { diagnosis } = normalizeDiagnosis(MOCK_DIAGNOSIS, typeof text === "string" ? text : "");
  if (typeof title === "string" && title) diagnosis.title = title;

  if (view === "owner") {
    const shared = { url: "/s/dev-preview", imageUrl: "/dev/share/card?format=square" };
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="mb-4 flex justify-end">
          <ShareButton diagnosisId="dev-preview" title={diagnosis.title} initialLink={null} />
        </div>
        <div className="mb-4 flex justify-end">
          <ShareButton diagnosisId="dev-preview" title={diagnosis.title} initialLink={shared} />
        </div>
        <DiagnosisResult diagnosis={diagnosis} imageUrls={[]} showFollowUpQuestions={false} />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6">
      <SharedDiagnosis diagnosis={toPublicDiagnosis(diagnosis)} />
    </main>
  );
}
