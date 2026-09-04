import Link from "next/link";
import { getDashboardStats } from "@/lib/supabase/queries/survey-admin";
import { secondaryButtonClass } from "@/lib/ui";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Responses" value={stats.totalResponses} />
        <StatCard label="Active Surveys" value={stats.activeSurveys} />
        <StatCard label="Closed Surveys" value={stats.closedSurveys} />
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
          <ul className="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
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
        <Link href="/admin/surveys" className={secondaryButtonClass}>
          Manage surveys →
        </Link>
      </div>
    </div>
  );
}
