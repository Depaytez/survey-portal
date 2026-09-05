import Link from "next/link";
import { notFound } from "next/navigation";
import { getSurveyForAdmin } from "@/lib/supabase/queries/survey-admin";
import {
  getSurveyResponseTrend,
  getSurveyQuestionDistributions,
  getSurveyKpis,
  getQuestionTextAnswers,
} from "@/lib/supabase/queries/survey-analytics";
import { TrendChart } from "./trend-chart";
import { DistributionChart } from "./distribution-chart";
import { SurveySharing } from "../survey-sharing";
import { BackLink } from "@/components/back-link";
import { secondaryButtonClass, adminCardClass, emptyStateClass } from "@/lib/ui";

const TEXT_PAGE_SIZE = 5;
const TEXT_QUESTION_TYPES = new Set(["short_text", "long_text", "email"]);
const RANGES = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "all", label: "All time" },
] as const;

type SearchParams = Record<string, string | string[] | undefined>;

function buildHref(id: string, sp: SearchParams, overrides: Record<string, string>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") search.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    search.set(key, value);
  }
  return `/admin/surveys/${id}/analytics?${search.toString()}`;
}

function daysSince(iso: string): number {
  const start = new Date(iso);
  const days = Math.ceil((Date.now() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, days);
}

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={`${adminCardClass} p-4`}>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

export default async function SurveyAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const survey = await getSurveyForAdmin(id);
  if (!survey) notFound();

  const range = typeof sp.range === "string" && sp.range ? sp.range : "30";
  const days =
    range === "all"
      ? daysSince(survey.publishedAt ?? survey.createdAt)
      : Math.max(1, Number(range) || 30);

  if (survey.responseCount === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <BackLink href={`/admin/surveys/${id}`}>Back to {survey.title}</BackLink>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <div className={`mt-6 ${emptyStateClass}`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No responses yet — share the survey to start collecting data.
          </p>
        </div>
        <div className="mt-6">
          <SurveySharing slug={survey.slug} />
        </div>
      </div>
    );
  }

  const questions = survey.sections.flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionTitle: section.title })),
  );
  const textQuestions = questions.filter((q) => TEXT_QUESTION_TYPES.has(q.questionType));

  const [kpis, trend, distributions, textAnswersByQuestion] = await Promise.all([
    getSurveyKpis(id),
    getSurveyResponseTrend(id, days),
    getSurveyQuestionDistributions(id),
    Promise.all(
      textQuestions.map(async (q) => {
        const page = Math.max(1, Number(sp[`tp_${q.id}`]) || 1);
        const result = await getQuestionTextAnswers(q.id, page, TEXT_PAGE_SIZE);
        return [q.id, { ...result, page }] as const;
      }),
    ),
  ]);

  const distributionByQuestion = new Map(distributions.map((d) => [d.questionId, d]));
  const textAnswersById = new Map(textAnswersByQuestion);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink href={`/admin/surveys/${id}`}>Back to {survey.title}</BackLink>
        <a href={`/admin/surveys/${id}/analytics/export`} className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}>
          Download CSV
        </a>
      </div>

      <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h1>

      {/* Overview */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Responses" value={kpis.totalResponses} />
        <KpiCard label="Today" value={kpis.today} />
        <KpiCard label="This Week" value={kpis.thisWeek} />
        <KpiCard label="Last Response" value={relativeTime(kpis.lastResponseAt)} />
      </div>

      {/* Trend */}
      <div className={`mt-6 ${adminCardClass}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Responses Over Time</h2>
          <div className="flex flex-wrap gap-1">
            {RANGES.map((r) => (
              <Link
                key={r.key}
                href={buildHref(id, sp, { range: r.key })}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  range === r.key
                    ? "bg-primary/10 text-primary"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <TrendChart data={trend} />
        </div>
      </div>

      {/* Per-question breakdown, grouped by section to mirror the builder */}
      <div className="mt-8 flex flex-col gap-8">
        {survey.sections.map((section) => {
          if (section.questions.length === 0) return null;
          return (
            <div key={section.id}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {section.title}
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {section.questions.map((q) => {
                  const distribution = distributionByQuestion.get(q.id);
                  const textAnswers = textAnswersById.get(q.id);

                  return (
                    <div key={q.id} className={adminCardClass}>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {q.title}
                      </h3>

                      {distribution ? (
                        <div className="mt-2">
                          <DistributionChart {...distribution} />
                        </div>
                      ) : null}

                      {textAnswers ? (
                        textAnswers.totalCount === 0 ? (
                          <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                            No answers yet.
                          </p>
                        ) : (
                          <div className="mt-3">
                            <ul className="flex flex-col gap-2">
                              {textAnswers.answers.map((a, i) => (
                                <li
                                  key={i}
                                  className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                                >
                                  <p className="whitespace-pre-wrap">{a.value}</p>
                                  {a.submittedAt ? (
                                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                                      {new Date(a.submittedAt).toLocaleDateString()}
                                    </p>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                            {textAnswers.totalCount > TEXT_PAGE_SIZE ? (
                              <div className="mt-3 flex items-center justify-between text-xs">
                                <Link
                                  href={buildHref(id, sp, {
                                    [`tp_${q.id}`]: String(Math.max(1, textAnswers.page - 1)),
                                  })}
                                  aria-disabled={textAnswers.page <= 1}
                                  className={
                                    textAnswers.page <= 1
                                      ? "pointer-events-none text-zinc-300 dark:text-zinc-700"
                                      : "font-medium text-primary hover:underline"
                                  }
                                >
                                  ← Previous
                                </Link>
                                <span className="text-zinc-500 dark:text-zinc-400">
                                  {textAnswers.page} of{" "}
                                  {Math.ceil(textAnswers.totalCount / TEXT_PAGE_SIZE)}
                                </span>
                                <Link
                                  href={buildHref(id, sp, {
                                    [`tp_${q.id}`]: String(textAnswers.page + 1),
                                  })}
                                  aria-disabled={
                                    textAnswers.page >=
                                    Math.ceil(textAnswers.totalCount / TEXT_PAGE_SIZE)
                                  }
                                  className={
                                    textAnswers.page >=
                                    Math.ceil(textAnswers.totalCount / TEXT_PAGE_SIZE)
                                      ? "pointer-events-none text-zinc-300 dark:text-zinc-700"
                                      : "font-medium text-primary hover:underline"
                                  }
                                >
                                  Next →
                                </Link>
                              </div>
                            ) : null}
                          </div>
                        )
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
