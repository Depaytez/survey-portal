import Link from "next/link";
import { secondaryButtonClass } from "@/lib/ui";

export default function SurveyNotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Survey Not Found
      </h1>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        This survey link is invalid, or the survey is not currently
        available.
      </p>
      <Link href="/" className={`mt-8 inline-block ${secondaryButtonClass}`}>
        Back to Home
      </Link>
    </div>
  );
}
