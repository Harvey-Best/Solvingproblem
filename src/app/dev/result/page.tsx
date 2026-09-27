import { notFound } from "next/navigation";

import { DiagnosisResult } from "@/components/result/diagnosis-result";
import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";
import { normalizeDiagnosis } from "@/lib/ai/safety";

/**
 * Dev-only preview of the result screen with canned data (no Supabase or API
 * key needed). /dev/result?text=I+smell+gas shows the safety escalation.
 */
export default async function DevResultPreview(props: PageProps<"/dev/result">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { text } = await props.searchParams;
  const { diagnosis } = normalizeDiagnosis(MOCK_DIAGNOSIS, typeof text === "string" ? text : "");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <DiagnosisResult diagnosis={diagnosis} imageUrls={[]} />
    </main>
  );
}
