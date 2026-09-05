import { notFound } from "next/navigation";
import { getResponseDetail } from "@/lib/supabase/queries/survey-analytics";
import { BackLink } from "@/components/back-link";
import { adminCardClass } from "@/lib/ui";

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—";
  return String(value);
}

export default async function ResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const { id, responseId } = await params;
  const response = await getResponseDetail(responseId);

  if (!response || response.surveyId !== id) {
    notFound();
  }

  // Group answers by the section they belong to, preserving first-seen order.
  const sections = new Map<string, typeof response.answers>();
  for (const answer of response.answers) {
    const key = answer.sectionTitle || "Other";
    if (!sections.has(key)) sections.set(key, []);
    sections.get(key)!.push(answer);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/admin/surveys/${id}/responses`}>Back to Responses</BackLink>

      <div className={`mt-3 ${adminCardClass}`}>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Response — {response.surveyTitle}
        </h1>
        <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{response.status}</dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Started</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {new Date(response.startedAt).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Submitted</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {response.submittedAt ? new Date(response.submittedAt).toLocaleString() : "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {Array.from(sections.entries()).map(([sectionTitle, answers]) => (
          <div
            key={sectionTitle}
            className={adminCardClass}
          >
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {sectionTitle}
            </h2>
            <dl className="mt-3 flex flex-col gap-3">
              {answers.map((answer) => (
                <div key={answer.questionId}>
                  <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                    {answer.questionTitle}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatAnswerValue(answer.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
