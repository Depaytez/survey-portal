"use client";

import { useState } from "react";
import { createSection, updateSection, deleteSection, moveSection, type ActionResult } from "./actions";
import type { SurveySection } from "@/lib/supabase/queries/survey-detail";
import { inputClass, iconButtonClass } from "@/lib/ui";
import { QuestionCard, QuestionForm } from "./question-card";

function SectionForm({
  surveyId,
  section,
  onDone,
}: {
  surveyId: string;
  section?: SurveySection;
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result: ActionResult = section
      ? await updateSection(surveyId, section.id, formData)
      : await createSection(surveyId, formData);
    setIsPending(false);
    if (result.success) onDone();
    else setError(result.error);
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Section title</label>
        <input name="title" defaultValue={section?.title} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Description (optional)
        </label>
        <input name="description" defaultValue={section?.description ?? ""} className={inputClass} />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className={iconButtonClass}>
          {isPending ? "Saving…" : "Save Section"}
        </button>
        <button type="button" onClick={onDone} className={iconButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function SectionCard({
  surveyId,
  section,
  isFirst,
  isLast,
  isExpanded,
  onToggleExpanded,
}: {
  surveyId: string;
  section: SurveySection;
  isFirst: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (isEditing) {
    return <SectionForm surveyId={surveyId} section={section} onDone={() => setIsEditing(false)} />;
  }

  async function handleMove(direction: "up" | "down") {
    setIsPending(true);
    await moveSection(surveyId, section.id, direction);
    setIsPending(false);
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete section "${section.title}"? This also deletes its ${section.questions.length} question(s) and their options.`,
      )
    )
      return;
    setIsPending(true);
    await deleteSection(surveyId, section.id);
    setIsPending(false);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex min-w-0 flex-1 items-start gap-2 text-left"
          aria-expanded={isExpanded}
        >
          <span
            className={`mt-0.5 shrink-0 text-zinc-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            aria-hidden="true"
          >
            ▶
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{section.title}</h3>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {section.questions.length} question{section.questions.length === 1 ? "" : "s"}
              </span>
            </span>
            {section.description ? (
              <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                {section.description}
              </span>
            ) : null}
          </span>
        </button>
        <div className="flex shrink-0 flex-wrap gap-1">
          <button
            type="button"
            disabled={isPending || isFirst}
            onClick={() => handleMove("up")}
            className={iconButtonClass}
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isPending || isLast}
            onClick={() => handleMove("down")}
            className={iconButtonClass}
            aria-label="Move section down"
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

      {isExpanded ? (
        <>
          <div className="mt-4 flex flex-col gap-3">
            {section.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                surveyId={surveyId}
                sectionId={section.id}
                question={question}
                isFirst={index === 0}
                isLast={index === section.questions.length - 1}
              />
            ))}
          </div>

          <div className="mt-3">
            {isAddingQuestion ? (
              <QuestionForm
                surveyId={surveyId}
                sectionId={section.id}
                onDone={() => setIsAddingQuestion(false)}
              />
            ) : (
              <button type="button" onClick={() => setIsAddingQuestion(true)} className={iconButtonClass}>
                + Add Question
              </button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

export { SectionForm };
