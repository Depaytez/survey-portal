"use client";

import { useActionState, useState } from "react";
import { createSurvey, type CreateSurveyState } from "../actions";
import { slugify } from "@/lib/validation/survey-admin";
import { inputClass, primaryButtonClass } from "@/lib/ui";

const initialState: CreateSurveyState = {};

export function NewSurveyForm() {
  const [state, formAction, isPending] = useActionState(createSurvey, initialState);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={inputClass}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Public URL: /survey/{slug || "your-survey-slug"}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="shortDescription"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Short Description <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea id="shortDescription" name="shortDescription" rows={3} className={inputClass} />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={`mt-2 self-start ${primaryButtonClass}`}
      >
        {isPending ? "Creating…" : "Create Survey"}
      </button>
    </form>
  );
}
