import Link from "next/link";
import { getDashboardStats, listSurveysForAdmin } from "@/lib/supabase/queries/survey-admin";
import { getRequestCounts } from "@/lib/supabase/queries/requests";
import { VisualizeIcon } from "@/components/visualize-icon";
import { primaryButtonClass, secondaryButtonClass, adminCardClass, emptyStateClass, dividedListClass } from "@/lib/ui";
import { StatusBadge } from "../surveys/status-badge";

const RECENT_SURVEYS_LIMIT = 5;

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={adminCardClass}>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, surveys, requestCounts] = await Promise.all([
    getDashboardStats(),
    listSurveysForAdmin(),
    getRequestCounts(),
  ]);
  const recentSurveys = surveys.slice(0, RECENT_SURVEYS_LIMIT);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Responses" value={stats.totalResponses} />
        <StatCard label="Active Surveys" value={stats.activeSurveys} />
        <StatCard label="Closed Surveys" value={stats.closedSurveys} />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Your Surveys</h2>
          <div className="flex gap-2">
            <Link href="/admin/surveys/new" className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}>
              + New Survey
            </Link>
            <Link href="/admin/surveys" className={`${secondaryButtonClass} px-3 py-1.5 text-xs`}>
              View All
            </Link>
          </div>
        </div>

        {recentSurveys.length === 0 ? (
          <div className={`mt-3 ${emptyStateClass}`}>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No surveys yet.{" "}
              <Link href="/admin/surveys/new" className="font-medium text-primary underline">
                Create your first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className={`mt-3 ${dividedListClass}`}>
            {recentSurveys.map((survey) => (
              <li key={survey.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <Link
                  href={`/admin/surveys/${survey.id}`}
                  className="min-w-0 flex-1 hover:underline"
                >
                  <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {survey.title}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {survey.responseCount} response{survey.responseCount === 1 ? "" : "s"}
                  </span>
                </Link>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={survey.status} />
                  <Link
                    href={`/admin/surveys/${survey.id}/analytics`}
                    title="Visualize responses"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <VisualizeIcon />
                    Visualize
                  </Link>
                  <Link
                    href={`/admin/surveys/${survey.id}`}
                    className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    Open →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Recent Responses
        </h2>
        {stats.recentResponses.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No responses have been submitted yet.
          </p>
        ) : (
          <ul className={`mt-3 ${dividedListClass}`}>
            {stats.recentResponses.map((response) => (
              <li key={response.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-zinc-900 dark:text-zinc-50">{response.surveyTitle}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {response.submittedAt
                    ? new Date(response.submittedAt).toLocaleString()
                    : "In progress"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Requests</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/customer-care"
            className={`flex items-center justify-between transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 ${adminCardClass}`}
          >
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer Care</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {requestCounts.customerCare} new
              </p>
            </div>
            <span className="text-sm font-medium text-primary">View →</span>
          </Link>
          <Link
            href="/admin/stakeholder-requests"
            className={`flex items-center justify-between transition-colors hover:bg-primary/5 dark:hover:bg-primary/10 ${adminCardClass}`}
          >
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Stakeholder Requests</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {requestCounts.stakeholder} new
              </p>
            </div>
            <span className="text-sm font-medium text-primary">View →</span>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/admin/surveys" className={primaryButtonClass}>
          Manage all surveys →
        </Link>
      </div>
    </div>
  );
}
