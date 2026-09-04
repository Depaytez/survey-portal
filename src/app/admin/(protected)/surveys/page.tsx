import Link from "next/link";
import { listSurveysForAdmin } from "@/lib/supabase/queries/survey-admin";
import { StatusBadge } from "./status-badge";
import { primaryButtonClass } from "@/lib/ui";

export default async function AdminSurveysPage() {
  const surveys = await listSurveysForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Surveys</h1>
        <Link href="/admin/surveys/new" className={primaryButtonClass}>
          New Survey
        </Link>
      </div>

      {surveys.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          No surveys yet. Create one to get started.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Responses</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {surveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/surveys/${survey.id}`}
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
