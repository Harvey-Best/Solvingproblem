import { notFound } from "next/navigation";

import { DiagnosisResult } from "@/components/result/diagnosis-result";
import { FollowUpThread } from "@/components/thread/follow-up-thread";
import { MOCK_DIAGNOSIS, MOCK_FOLLOW_UP } from "@/lib/ai/mock";
import { normalizeDiagnosis } from "@/lib/ai/safety";
import { toExchanges, type ThreadMessage } from "@/lib/thread";

/**
 * Dev-only preview of the result screen with canned data (no Supabase or API
 * key needed). /dev/result?text=I+smell+gas shows the safety escalation;
 * /dev/result?thread=1 adds a sample follow-up exchange.
 */
export default async function DevResultPreview(props: PageProps<"/dev/result">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { text, thread } = await props.searchParams;
  const withThread = thread === "1";
  const { diagnosis } = normalizeDiagnosis(withThread ? MOCK_FOLLOW_UP : MOCK_DIAGNOSIS, typeof text === "string" ? text : "");
  const sample: ThreadMessage[] = withThread
    ? [
        { id: "q1", role: "user", content: `Q: ${MOCK_DIAGNOSIS.follow_up_questions[0]}\nA: From the tip of the spout.`, result_json: null, error: null, created_at: "" },
        { id: "a1", role: "assistant", content: MOCK_FOLLOW_UP.what_changed, result_json: MOCK_FOLLOW_UP, error: null, created_at: "" },
      ]
    : [];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <DiagnosisResult diagnosis={diagnosis} imageUrls={[]} showFollowUpQuestions={false} updatedCount={withThread ? 1 : 0} />
      <div className="mt-4">
        <FollowUpThread
          diagnosisId="dev-preview"
          exchanges={toExchanges(sample)}
          suggestions={diagnosis.follow_up_questions.length ? diagnosis.follow_up_questions : MOCK_DIAGNOSIS.follow_up_questions.slice(1)}
          remaining={withThread ? 5 : 6}
          signedIn
        />
      </div>
    </main>
  );
}
