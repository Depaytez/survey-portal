"use client";

import { useActionState, useState } from "react";
import {
  submitStakeholderRequest,
  type StakeholderActionState,
} from "./actions";
import { stakeholderInterestTypes } from "@/lib/validation/public";

const initialState: StakeholderActionState = { status: "idle" };

const INTEREST_LABELS: Record<(typeof stakeholderInterestTypes)[number], string> = {
  tourism_development_partnership: "Tourism development partnership",
  research_collaboration: "Research collaboration",
  data_research_support: "Data / research support",
  investment_programme_discussion: "Investment or programme discussion",
  general_inquiry: "General inquiry",
};

export function StakeholderForm() {
  const [state, formAction, isPending] = useActionState(
    submitStakeholderRequest,
    initialState,
  );
  const [renderedAt] = useState(() => Date.now());

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
      >
        Thank you for your interest — our team will review your request and
        follow up soon.
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
        <label
          htmlFor="organizationName"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Organization Name
        </label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          required
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contactName"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Contact Name
        </label>
        <input
          id="contactName"
          name="contactName"
          type="text"
          required
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Phone <span className="font-normal text-zinc-400">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="interestType"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Area of Interest
        </label>
        <select
          id="interestType"
          name="interestType"
          defaultValue="general_inquiry"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {stakeholderInterestTypes.map((type) => (
            <option key={type} value={type}>
              {INTEREST_LABELS[type]}
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
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
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
        className="mt-2 self-start rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? "Submitting…" : "Submit Interest"}
      </button>
    </form>
  );
}
