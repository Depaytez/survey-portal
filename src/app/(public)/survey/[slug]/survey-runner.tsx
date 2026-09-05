"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import type { SurveyDetail } from "@/lib/supabase/queries/survey-detail";
import { buildAnswersSchema, type AnswersByQuestionId } from "@/lib/validation/survey-response";
import { QuestionField } from "./question-field";
import { submitSurveyResponse } from "./actions";
import { primaryButtonClass, secondaryButtonClass, panelClass } from "@/lib/ui";

type Phase = "intro" | "questions" | "success";

export function SurveyRunner({ survey }: { survey: SurveyDetail }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersByQuestionId>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Bot-resistance, same pattern as the contact/stakeholder-interest forms:
  // a honeypot field real visitors never see, plus a minimum time between
  // when the form rendered and when it's submitted.
  const [renderedAt] = useState(() => Date.now());
  const [website, setWebsite] = useState("");

  const sections = survey.sections;
  const currentSection = sections[stepIndex];
  const isLastStep = stepIndex === sections.length - 1;

  // Keeps a long question list from leaving the respondent scrolled deep
  // into the previous step after Next/Previous — matches instant/no motion
  // for users who've asked for reduced motion.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [phase, stepIndex]);

  function setAnswer(questionId: string, value: AnswersByQuestionId[string]) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setFieldErrors((prev) => {
      if (!(questionId in prev)) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function validateStep(index: number): boolean {
    const questions = sections[index].questions;
    const schema = buildAnswersSchema(questions);
    const result = schema.safeParse(answers);

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      errors[String(issue.path[0])] = issue.message;
    }
    setFieldErrors(errors);
    return false;
  }

  function handleNext() {
    setFormError(null);
    if (!validateStep(stepIndex)) return;
    setStepIndex((i) => Math.min(i + 1, sections.length - 1));
  }

  function handlePrevious() {
    setFormError(null);
    setFieldErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    setFormError(null);
    if (!validateStep(stepIndex)) return;

    startTransition(async () => {
      const result = await submitSurveyResponse(survey.slug, answers, { website, renderedAt });
      if (result.success) {
        setPhase("success");
        return;
      }
      setFormError(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    });
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className={`${panelClass} text-center`}>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {survey.welcomeTitle ?? survey.title}
          </h1>
          {survey.welcomeDescription ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {survey.welcomeDescription}
            </p>
          ) : null}
          {survey.estimatedDuration ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              Estimated time: {survey.estimatedDuration}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setPhase("questions")}
            className={`mt-8 ${primaryButtonClass}`}
          >
            Start Survey
          </button>
        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className={`${panelClass} text-center`}>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {survey.completionTitle ?? "Thank You!"}
          </h1>
          {survey.completionDescription ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {survey.completionDescription}
            </p>
          ) : null}
          <Link href="/" className={`mt-8 inline-block ${secondaryButtonClass}`}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((stepIndex + 1) / sections.length) * 100);

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className={panelClass}>
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <span>
              Step {stepIndex + 1} of {sections.length}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {currentSection.title}
        </h2>
        {currentSection.description ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {currentSection.description}
          </p>
        ) : null}

        {/* Honeypot: hidden from real visitors, invisible to assistive tech, never reached by keyboard. Bots that fill every field trip it. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-8">
          {currentSection.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => setAnswer(question.id, value)}
              error={fieldErrors[question.id]}
            />
          ))}
        </div>

        {formError ? (
          <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={stepIndex === 0 || isPending}
            className={secondaryButtonClass}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={isPending}
            className={primaryButtonClass}
          >
            {isPending ? "Submitting…" : isLastStep ? "Submit Survey" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
