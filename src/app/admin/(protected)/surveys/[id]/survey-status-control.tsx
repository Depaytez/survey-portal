"use client";

import { useState, useTransition } from "react";
import { updateSurveyStatus } from "./actions";
import { ALLOWED_STATUS_TRANSITIONS, type SurveyStatus } from "@/lib/validation/survey-admin";
import { StatusBadge } from "../status-badge";
import { primaryButtonClass, secondaryButtonClass, adminCardClass } from "@/lib/ui";

const TRANSITION_LABELS: Record<SurveyStatus, string> = {
  DRAFT: "Move to Draft",
  PUBLISHED: "Publish",
  HIDDEN: "Hide",
  CLOSED: "Close",
  ARCHIVED: "Archive",
};

// Only the consequential, hard-to-casually-undo transitions get a
// confirmation — HIDDEN <-> PUBLISHED is a routine visibility toggle and
// doesn't need one, so this is keyed by the exact (from, to) pair rather
// than just the destination status.
function confirmMessageFor(from: SurveyStatus, to: SurveyStatus): string | null {
  if (from === "DRAFT" && to === "PUBLISHED") {
    return "Publish this survey? It becomes publicly accessible immediately.";
  }
  if (to === "CLOSED") {
    return "Close this survey? It will stop accepting new responses.";
  }
  if (to === "ARCHIVED") {
    return "Archive this survey? This is the final state — there's no transition back out.";
  }
  return null;
}

export function SurveyStatusControl({
  surveyId,
  status,
}: {
  surveyId: string;
  status: SurveyStatus;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const nextOptions = ALLOWED_STATUS_TRANSITIONS[status];

  function handleTransition(nextStatus: SurveyStatus) {
    const confirmMessage = confirmMessageFor(status, nextStatus);
    if (confirmMessage && !confirm(confirmMessage)) return;

    setError(null);
    startTransition(async () => {
      const result = await updateSurveyStatus(surveyId, status, nextStatus);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <div className={adminCardClass}>
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</p>
        <StatusBadge status={status} />
      </div>
      {nextOptions.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {nextOptions.map((next, index) => (
            <button
              key={next}
              type="button"
              disabled={isPending}
              onClick={() => handleTransition(next)}
              className={index === 0 ? primaryButtonClass : secondaryButtonClass}
            >
              {TRANSITION_LABELS[next]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          This survey is archived and has no further status changes.
        </p>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
