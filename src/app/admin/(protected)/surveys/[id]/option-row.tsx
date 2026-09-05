"use client";

import { useState } from "react";
import { createOption, updateOption, deleteOption, moveOption, type ActionResult } from "./actions";
import type { SurveyOption } from "@/lib/supabase/queries/survey-detail";
import { inputClass, iconButtonClass } from "@/lib/ui";

function OptionForm({
  surveyId,
  questionId,
  option,
  onDone,
  lockValue = false,
}: {
  surveyId: string;
  questionId: string;
  option?: SurveyOption;
  onDone: () => void;
  lockValue?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result: ActionResult = option
      ? await updateOption(surveyId, option.id, formData)
      : await createOption(surveyId, questionId, formData);
    setIsPending(false);
    if (result.success) onDone();
    else setError(result.error);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-700">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <input
            name="value"
            placeholder="value (e.g. option_a)"
            defaultValue={option?.value}
            required
            readOnly={lockValue}
            className={`${inputClass} ${lockValue ? "opacity-60" : ""}`}
          />
          {lockValue ? (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Can&apos;t change once answered — it&apos;s how past responses are matched.
            </p>
          ) : null}
        </div>
        <input
          name="label"
          placeholder="Label shown to respondents"
          defaultValue={option?.label}
          required
          className={inputClass}
        />
      </div>
      <input
        name="description"
        placeholder="Description (optional)"
        defaultValue={option?.description ?? ""}
        className={inputClass}
      />
      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={iconButtonClass}>
          {isPending ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onDone} className={iconButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function OptionRow({
  surveyId,
  questionId,
  option,
  isFirst,
  isLast,
  hasResponses,
}: {
  surveyId: string;
  questionId: string;
  option: SurveyOption;
  isFirst: boolean;
  isLast: boolean;
  hasResponses: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (isEditing) {
    return (
      <OptionForm
        surveyId={surveyId}
        questionId={questionId}
        option={option}
        onDone={() => setIsEditing(false)}
        lockValue={hasResponses}
      />
    );
  }

  async function handleMove(direction: "up" | "down") {
    setIsPending(true);
    await moveOption(surveyId, questionId, option.id, direction);
    setIsPending(false);
  }

  async function handleDelete() {
    const warning = hasResponses
      ? ` This survey already has responses — some may have used this option, and they'll no longer show up correctly in analytics. This can't be undone.`
      : "";
    if (!confirm(`Delete option "${option.label}"?${warning}`)) return;
    setIsPending(true);
    await deleteOption(surveyId, option.id);
    setIsPending(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
      <div className="min-w-0">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{option.label}</span>
        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{option.value}</span>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          disabled={isPending || isFirst}
          onClick={() => handleMove("up")}
          className={iconButtonClass}
          aria-label="Move option up"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={isPending || isLast}
          onClick={() => handleMove("down")}
          className={iconButtonClass}
          aria-label="Move option down"
        >
          ↓
        </button>
        <button type="button" onClick={() => setIsEditing(true)} className={iconButtonClass}>
          Edit
        </button>
        <button type="button" disabled={isPending} onClick={handleDelete} className={iconButtonClass}>
          Delete
        </button>
      </div>
    </div>
  );
}

export { OptionForm };
