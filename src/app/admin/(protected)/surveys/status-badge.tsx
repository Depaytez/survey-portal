import type { SurveyStatus } from "@/lib/validation/survey-admin";

const STYLES: Record<SurveyStatus, string> = {
  DRAFT: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  PUBLISHED: "bg-primary/10 text-primary",
  HIDDEN: "bg-accent/10 text-accent",
  CLOSED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  ARCHIVED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

export function StatusBadge({ status }: { status: SurveyStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
