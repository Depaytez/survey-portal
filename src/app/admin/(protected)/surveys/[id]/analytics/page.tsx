import Link from "next/link";
import { notFound } from "next/navigation";
import { getSurveyForAdmin } from "@/lib/supabase/queries/survey-admin";
import {
  getSurveyResponseTrend,
  getSurveyQuestionDistributions,
} from "@/lib/supabase/queries/survey-analytics";
import { TrendChart } from "./trend-chart";
import { DistributionChart } from "./distribution-chart";

export default async function SurveyAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const survey = await getSurveyForAdmin(id);
  if (!survey) notFound();

  const [trend, distributions] = await Promise.all([
    getSurveyResponseTrend(id, 30),
    getSurveyQuestionDistributions(id),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/admin/surveys/${id}`}
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to {survey.title}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {survey.responseCount} total response{survey.responseCount === 1 ? "" : "s"}
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Responses — Last 30 Days
        </h2>
        <div className="mt-2">
          <TrendChart data={trend} />
        </div>
      </div>

      {distributions.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No choice or rating questions to break down yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {distributions.map((q) => (
            <div
              key={q.questionId}
              className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {q.questionTitle}
              </h2>
              <div className="mt-2">
                <DistributionChart {...q} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
