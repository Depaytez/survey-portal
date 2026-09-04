"use client";

import { useState } from "react";
import { updateSurveyDetails } from "./actions";
import { inputClass, primaryButtonClass } from "@/lib/ui";
import type { AdminSurveyDetail } from "@/lib/supabase/queries/survey-admin";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}

export function SurveyDetailsForm({ survey }: { survey: AdminSurveyDetail }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("saving");
    setError(null);
    const result = await updateSurveyDetails(survey.id, formData);
    if (result.success) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="title" label="Title">
          <input
            id="title"
            name="title"
            defaultValue={survey.title}
            required
            className={inputClass}
          />
        </Field>
        <Field
          id="slug"
          label="Slug"
          hint="Changing this breaks any campaign/ad already using the old link."
        >
          <input id="slug" name="slug" defaultValue={survey.slug} required className={inputClass} />
        </Field>
      </div>

      <Field id="shortTitle" label="Short Title" hint="Used in compact listings.">
        <input id="shortTitle" name="shortTitle" defaultValue={survey.shortTitle ?? ""} className={inputClass} />
      </Field>

      <Field id="description" label="Description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={survey.description ?? ""}
          className={inputClass}
        />
      </Field>

      <Field id="shortDescription" label="Short Description" hint="Shown on the public listing card.">
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={2}
          defaultValue={survey.shortDescription ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="estimatedDuration" label="Estimated Duration">
          <input
            id="estimatedDuration"
            name="estimatedDuration"
            placeholder="e.g. 10-15 minutes"
            defaultValue={survey.estimatedDuration ?? ""}
            className={inputClass}
          />
        </Field>
        <label className="mt-6 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="checkbox"
            name="isListedPublicly"
            defaultChecked={survey.isListedPublicly}
          />
          List on the public homepage when published
        </label>
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800" />
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Respondent Experience
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="welcomeTitle" label="Welcome Title">
          <input id="welcomeTitle" name="welcomeTitle" defaultValue={survey.welcomeTitle ?? ""} className={inputClass} />
        </Field>
        <Field id="completionTitle" label="Completion Title">
          <input
            id="completionTitle"
            name="completionTitle"
            defaultValue={survey.completionTitle ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="welcomeDescription" label="Welcome Description">
          <textarea
            id="welcomeDescription"
            name="welcomeDescription"
            rows={3}
            defaultValue={survey.welcomeDescription ?? ""}
            className={inputClass}
          />
        </Field>
        <Field id="completionDescription" label="Completion Description">
          <textarea
            id="completionDescription"
            name="completionDescription"
            rows={3}
            defaultValue={survey.completionDescription ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="consentText" label="Consent Text">
        <textarea
          id="consentText"
          name="consentText"
          rows={2}
          defaultValue={survey.consentText ?? ""}
          className={inputClass}
        />
      </Field>

      <Field id="contactPrivacyNotice" label="Contact Privacy Notice">
        <textarea
          id="contactPrivacyNotice"
          name="contactPrivacyNotice"
          rows={2}
          defaultValue={survey.contactPrivacyNotice ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className={primaryButtonClass}>
          {status === "saving" ? "Saving…" : "Save Details"}
        </button>
        {status === "saved" ? (
          <span role="status" className="text-sm text-primary">
            ✓ Saved
          </span>
        ) : null}
        {status === "error" && error ? (
          <span role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
