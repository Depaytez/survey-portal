import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSurveyResponsesPaginated,
  type ResponseSortColumn,
} from "@/lib/supabase/queries/survey-analytics";
import { getSurveyForAdmin } from "@/lib/supabase/queries/survey-admin";
import { BackLink } from "@/components/back-link";
import { emptyStateClass } from "@/lib/ui";

const PAGE_SIZE = 25;
const STATUS_FILTERS = ["SUBMITTED", "IN_PROGRESS", "ABANDONED"] as const;
const SORT_COLUMNS: { key: ResponseSortColumn; label: string }[] = [
  { key: "submitted_at", label: "Submitted" },
  { key: "started_at", label: "Started" },
  { key: "status", label: "Status" },
];

function buildHref(
  surveyId: string,
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return `/admin/surveys/${surveyId}/responses${query ? `?${query}` : ""}`;
}

export default async function SurveyResponsesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const survey = await getSurveyForAdmin(id);
  if (!survey) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  const sortBy = (typeof sp.sortBy === "string" ? sp.sortBy : "submitted_at") as ResponseSortColumn;
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";
  const status = typeof sp.status === "string" ? sp.status : undefined;

  const { responses, totalCount } = await getSurveyResponsesPaginated(id, {
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortDir,
    status,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href={`/admin/surveys/${id}`}>Back to {survey.title}</BackLink>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Responses</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {totalCount} total response{totalCount === 1 ? "" : "s"}
        </p>
      </div>

      {/* Status filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={buildHref(id, { sortBy, sortDir })}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status
              ? "bg-primary/10 text-primary"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          All
        </Link>
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={buildHref(id, { sortBy, sortDir, status: s })}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === s
                ? "bg-primary/10 text-primary"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {responses.length === 0 ? (
        <div className={`mt-6 ${emptyStateClass}`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {status ? `No ${status.toLowerCase()} responses.` : "No responses yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <ul className="mt-6 flex flex-col gap-3 sm:hidden">
            {responses.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/surveys/${id}/responses/${r.id}`}
                  className="block rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {r.status}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Table on sm+ */}
          <div className="mt-6 hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white sm:block dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  {SORT_COLUMNS.map((col) => {
                    const isActive = sortBy === col.key;
                    const nextDir = isActive && sortDir === "desc" ? "asc" : "desc";
                    return (
                      <th key={col.key} className="px-4 py-3 font-medium">
                        <Link
                          href={buildHref(id, { sortBy: col.key, sortDir: nextDir, status })}
                          className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                          {col.label}
                          {isActive ? <span aria-hidden="true">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
                        </Link>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {responses.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-primary/5 dark:hover:bg-primary/10">
                    <td>
                      <Link
                        href={`/admin/surveys/${id}/responses/${r.id}`}
                        className="block px-4 py-3 text-zinc-900 dark:text-zinc-50"
                      >
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/admin/surveys/${id}/responses/${r.id}`}
                        className="block px-4 py-3 text-zinc-600 dark:text-zinc-400"
                      >
                        {new Date(r.startedAt).toLocaleString()}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/admin/surveys/${id}/responses/${r.id}`}
                        className="block px-4 py-3 text-zinc-600 dark:text-zinc-400"
                      >
                        {r.status}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-between text-sm">
              <Link
                href={buildHref(id, { page: page - 1, sortBy, sortDir, status })}
                aria-disabled={page <= 1}
                className={`rounded-md border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                ← Previous
              </Link>
              <span className="text-zinc-600 dark:text-zinc-400">
                Page {page} of {totalPages}
              </span>
              <Link
                href={buildHref(id, { page: page + 1, sortBy, sortDir, status })}
                aria-disabled={page >= totalPages}
                className={`rounded-md border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                Next →
              </Link>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
