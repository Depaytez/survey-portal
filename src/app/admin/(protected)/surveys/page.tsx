import Link from "next/link";
import { listSurveysForAdmin } from "@/lib/supabase/queries/survey-admin";
import { StatusBadge } from "./status-badge";
import { primaryButtonClass, iconButtonClass } from "@/lib/ui";

function VisualizeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 15.5V8M10 15.5V4.5M16 15.5v-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function AdminSurveysPage() {
  const surveys = await listSurveysForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Surveys</h1>
        <Link href="/admin/surveys/new" className={primaryButtonClass}>
          New Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No surveys yet. Create one to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Card list on small screens */}
          <ul className="mt-6 flex flex-col gap-3 sm:hidden">
            {surveys.map((survey) => (
              <li
                key={survey.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <Link href={`/admin/surveys/${survey.id}`} className="block">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {survey.title}
                    </span>
                    <StatusBadge status={survey.status} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">/{survey.slug}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>
                      {survey.responseCount} response{survey.responseCount === 1 ? "" : "s"}
                    </span>
                    <span>{new Date(survey.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Link>
                <div className="mt-3 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <Link
                    href={`/admin/surveys/${survey.id}/analytics`}
                    className={`${iconButtonClass} gap-1.5 px-3 text-primary`}
                  >
                    <VisualizeIcon />
                    Visualize
                  </Link>
                  <Link
                    href={`/admin/surveys/${survey.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Open →
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Table on sm+ screens */}
          <div className="mt-6 hidden overflow-x-auto rounded-lg border border-zinc-200 bg-white sm:block dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Responses</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {surveys.map((survey) => (
                  <tr
                    key={survey.id}
                    className="transition-colors hover:bg-primary/5 dark:hover:bg-primary/10"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/surveys/${survey.id}`}
                        className="font-medium text-zinc-900 hover:text-primary dark:text-zinc-50"
                      >
                        {survey.title}
                      </Link>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">/{survey.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={survey.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {survey.responseCount}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {new Date(survey.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
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
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Open →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
