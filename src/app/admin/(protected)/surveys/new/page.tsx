import { NewSurveyForm } from "./new-survey-form";

export default function NewSurveyPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">New Survey</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Creates a draft survey. You&apos;ll add sections and questions next.
      </p>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <NewSurveyForm />
      </div>
    </div>
  );
}
