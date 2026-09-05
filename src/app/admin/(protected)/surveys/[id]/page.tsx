import Link from "next/link";
import { notFound } from "next/navigation";
import { getSurveyForAdmin } from "@/lib/supabase/queries/survey-admin";
import { StatusBadge } from "../status-badge";
import { SurveySharing } from "./survey-sharing";
import { SurveyStatusControl } from "./survey-status-control";
import { SurveyDetailsForm } from "./survey-details-form";
import { SurveyBuilder } from "./survey-builder";
import { secondaryButtonClass } from "@/lib/ui";

export default async function AdminSurveyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const survey = await getSurveyForAdmin(id);

  if (!survey) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/surveys"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Back to Surveys
      </Link>

      {/* Solid card, not the ambient background — StatusBadge's tinted fill
          only guarantees WCAG contrast against an opaque surface. */}
      <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{survey.title}</h1>
          <StatusBadge status={survey.status} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {survey.responseCount} response{survey.responseCount === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/surveys/${survey.id}/responses`}
              className={`${secondaryButtonClass} px-3 py-1 text-xs`}
            >
              View Responses
            </Link>
            <Link
              href={`/admin/surveys/${survey.id}/analytics`}
              className={`${secondaryButtonClass} px-3 py-1 text-xs`}
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SurveyStatusControl surveyId={survey.id} status={survey.status} />
        <SurveySharing slug={survey.slug} />
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Survey Details</h2>
        <div className="mt-4">
          <SurveyDetailsForm survey={survey} />
        </div>
      </div>

      <div className="mt-8">
        <SurveyBuilder survey={survey} />
      </div>
    </div>
  );
}
