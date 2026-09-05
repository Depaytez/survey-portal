"use client";

import type { SurveyQuestion } from "@/lib/supabase/queries/survey-detail";
import type { AnswerValue } from "@/lib/validation/survey-response";
import { inputClass } from "@/lib/ui";

const optionCardClass =
  "flex cursor-pointer items-start gap-2 rounded-md border border-zinc-200 p-3 text-sm has-checked:border-primary has-checked:bg-primary/10 dark:border-zinc-800";

export function QuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: SurveyQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue | undefined) => void;
  error?: string;
}) {
  const fieldId = `q-${question.id}`;
  const maxSelections =
    typeof question.configuration.maxSelections === "number"
      ? question.configuration.maxSelections
      : undefined;
  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {question.title}
        {question.isRequired ? (
          <span className="ml-1 text-red-600 dark:text-red-400" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>
      {question.description ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{question.description}</p>
      ) : null}

      {question.questionType === "short_text" || question.questionType === "email" ? (
        <input
          id={fieldId}
          type={question.questionType === "email" ? "email" : "text"}
          placeholder={question.placeholder ?? undefined}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          required={question.isRequired}
          className={inputClass}
        />
      ) : null}

      {question.questionType === "long_text" ? (
        <textarea
          id={fieldId}
          rows={4}
          placeholder={question.placeholder ?? undefined}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          required={question.isRequired}
          className={inputClass}
        />
      ) : null}

      {question.questionType === "single_choice" ? (
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={optionCardClass}
            >
              <input
                type="radio"
                name={fieldId}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-zinc-900 dark:text-zinc-50">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="block text-zinc-600 dark:text-zinc-400">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      ) : null}

      {question.questionType === "rating" ? (
        <div className="flex flex-wrap gap-2">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-md border border-zinc-200 px-4 py-2 text-sm has-checked:border-primary has-checked:bg-primary/10 dark:border-zinc-800"
            >
              <input
                type="radio"
                name={fieldId}
                value={option.value}
                checked={String(value ?? "") === option.value}
                onChange={() => onChange(Number(option.value))}
                className="sr-only"
              />
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {option.value}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{option.label}</span>
            </label>
          ))}
        </div>
      ) : null}

      {question.questionType === "multiple_choice" ? (
        <div className="flex flex-col gap-2">
          {maxSelections ? (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Selected {selectedValues.length} of {maxSelections}
            </p>
          ) : null}
          {question.options.map((option) => {
            const checked = selectedValues.includes(option.value);
            const atLimit =
              maxSelections !== undefined && selectedValues.length >= maxSelections;
            return (
              <label
                key={option.id}
                className={`${optionCardClass} has-disabled:cursor-not-allowed has-disabled:opacity-50`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checked}
                  disabled={!checked && atLimit}
                  onChange={() => {
                    const next = checked
                      ? selectedValues.filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(next.length > 0 ? next : undefined);
                  }}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium text-zinc-900 dark:text-zinc-50">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="block text-zinc-600 dark:text-zinc-400">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
      ) : null}

      {question.questionType === "boolean" ? (
        question.configuration.mustBeTrue === true ? (
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-zinc-700 dark:text-zinc-300">I agree</span>
          </label>
        ) : (
          <div className="flex gap-2">
            {[
              { label: "Yes", answer: true },
              { label: "No", answer: false },
            ].map((choice) => (
              <label
                key={choice.label}
                className={`${optionCardClass} flex-1 justify-center text-center`}
              >
                <input
                  type="radio"
                  name={fieldId}
                  checked={value === choice.answer}
                  onChange={() => onChange(choice.answer)}
                  className="sr-only"
                />
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {choice.label}
                </span>
              </label>
            ))}
          </div>
        )
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
