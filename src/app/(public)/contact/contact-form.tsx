"use client";

import { useActionState, useState } from "react";
import { submitCustomerCareRequest, type ContactActionState } from "./actions";
import { customerCareCategories } from "@/lib/validation/public";
import { inputClass, primaryButtonClass } from "@/lib/ui";

const initialState: ContactActionState = { status: "idle" };

const CATEGORY_LABELS: Record<(typeof customerCareCategories)[number], string> = {
  general: "General",
  technical_issue: "Technical issue",
  question: "Question",
  feedback: "Feedback",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitCustomerCareRequest,
    initialState,
  );
  const [renderedAt] = useState(() => Date.now());

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
      >
        Thank you — your message has been received. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue="general"
          className={inputClass}
        >
          {customerCareCategories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
        />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={`mt-2 self-start ${primaryButtonClass}`}
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
