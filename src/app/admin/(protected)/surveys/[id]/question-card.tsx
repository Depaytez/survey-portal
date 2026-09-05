"use client";

import { useState } from "react";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  moveQuestion,
  type ActionResult,
} from "./actions";
import { questionTypes, questionTypeNeedsOptions, type QuestionType } from "@/lib/validation/survey-admin";
import type { SurveyQuestion } from "@/lib/supabase/queries/survey-detail";
import { inputClass, iconButtonClass } from "@/lib/ui";
import { OptionRow, OptionForm } from "./option-row";

const TYPE_LABELS: Record<QuestionType, string> = {
  short_text: "Short text",
  long_text: "Long text",
  email: "Email",
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  rating: "Rating",
  boolean: "Yes/No consent",
};

function QuestionForm({
  surveyId,
  sectionId,
  question,
  onDone,
  hasResponses,
}: {
  surveyId: string;
  sectionId: string;
  question?: SurveyQuestion;
  onDone: () => void;
  hasResponses: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [type, setType] = useState<QuestionType>(
    (question?.questionType as QuestionType | undefined) ?? "short_text",
  );
  // Changing an already-answered question's type would make its stored
  // answers (shaped for the old type) nonsensical in analytics — only lock
  // this for an existing question once the survey has responses; a
  // brand-new question is unaffected.
  const lockType = hasResponses && Boolean(question);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result: ActionResult = question
      ? await updateQuestion(surveyId, question.id, formData)
      : await createQuestion(surveyId, sectionId, formData);
    setIsPending(false);
    if (result.success) onDone();
    else setError(result.error);
  }

  const config = question?.configuration ?? {};

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Question key</label>
          <input
            name="questionKey"
            placeholder="e.g. age_group"
            defaultValue={question?.questionKey}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Type</label>
          <select
            name="questionType"
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            disabled={lockType}
            className={`${inputClass} disabled:opacity-60`}
          >
            {questionTypes.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {/* A disabled <select> submits nothing — this carries the locked
              value through instead. */}
          {lockType ? <input type="hidden" name="questionType" value={type} /> : null}
          {lockType ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Type can&apos;t change once the survey has responses.
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Question text
        </label>
        <input name="title" defaultValue={question?.title} required className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Description (optional)
        </label>
        <input name="description" defaultValue={question?.description ?? ""} className={inputClass} />
      </div>

      {type === "short_text" || type === "long_text" || type === "email" ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Placeholder (optional)
          </label>
          <input name="placeholder" defaultValue={question?.placeholder ?? ""} className={inputClass} />
        </div>
      ) : null}

      {type === "short_text" || type === "long_text" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Min length</label>
            <input
              type="number"
              name="minLength"
              min={0}
              defaultValue={typeof config.minLength === "number" ? config.minLength : ""}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Max length</label>
            <input
              type="number"
              name="maxLength"
              min={1}
              defaultValue={typeof config.maxLength === "number" ? config.maxLength : ""}
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {type === "multiple_choice" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Min selections
            </label>
            <input
              type="number"
              name="minSelections"
              min={1}
              defaultValue={typeof config.minSelections === "number" ? config.minSelections : ""}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Max selections
            </label>
            <input
              type="number"
              name="maxSelections"
              min={1}
              defaultValue={typeof config.maxSelections === "number" ? config.maxSelections : ""}
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {type === "rating" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Rating minimum
            </label>
            <input
              type="number"
              name="ratingMinimum"
              defaultValue={typeof config.minimum === "number" ? config.minimum : ""}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Rating maximum
            </label>
            <input
              type="number"
              name="ratingMaximum"
              defaultValue={typeof config.maximum === "number" ? config.maximum : ""}
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {type === "boolean" ? (
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" name="mustBeTrue" defaultChecked={config.mustBeTrue === true} />
          Must be checked to continue (e.g. consent)
        </label>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input type="checkbox" name="isRequired" defaultChecked={question?.isRequired ?? true} />
        Required
      </label>

      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={iconButtonClass}>
          {isPending ? "Saving…" : "Save Question"}
        </button>
        <button type="button" onClick={onDone} className={iconButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function QuestionCard({
  surveyId,
  sectionId,
  question,
  isFirst,
  isLast,
  hasResponses,
}: {
  surveyId: string;
  sectionId: string;
  question: SurveyQuestion;
  isFirst: boolean;
  isLast: boolean;
  hasResponses: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (isEditing) {
    return (
      <QuestionForm
        surveyId={surveyId}
        sectionId={sectionId}
        question={question}
        onDone={() => setIsEditing(false)}
        hasResponses={hasResponses}
      />
    );
  }

  async function handleMove(direction: "up" | "down") {
    setIsPending(true);
    await moveQuestion(surveyId, sectionId, question.id, direction);
    setIsPending(false);
  }

  async function handleDelete() {
    const warning = hasResponses
      ? ` This survey already has responses — deleting this question permanently removes any answers submitted for it. This can't be undone.`
      : "";
    if (!confirm(`Delete question "${question.title}"? This also deletes its options.${warning}`)) return;
    setIsPending(true);
    await deleteQuestion(surveyId, question.id);
    setIsPending(false);
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{question.title}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {TYPE_LABELS[question.questionType as QuestionType]}
            </span>
            {question.isRequired ? (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                Required
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{question.questionKey}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            disabled={isPending || isFirst}
            onClick={() => handleMove("up")}
            className={iconButtonClass}
            aria-label="Move question up"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isPending || isLast}
            onClick={() => handleMove("down")}
            className={iconButtonClass}
            aria-label="Move question down"
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

      {questionTypeNeedsOptions(question.questionType as QuestionType) ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
          {question.options.map((option, index) => (
            <OptionRow
              key={option.id}
              surveyId={surveyId}
              questionId={question.id}
              option={option}
              isFirst={index === 0}
              isLast={index === question.options.length - 1}
              hasResponses={hasResponses}
            />
          ))}
          {isAddingOption ? (
            <OptionForm
              surveyId={surveyId}
              questionId={question.id}
              onDone={() => setIsAddingOption(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingOption(true)}
              className={`self-start ${iconButtonClass}`}
            >
              + Add Option
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export { QuestionForm };
