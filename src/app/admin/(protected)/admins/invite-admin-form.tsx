"use client";

import { useActionState } from "react";
import { inviteAdmin, type InviteAdminState } from "./actions";
import { inputClass, primaryButtonClass } from "@/lib/ui";

const initialState: InviteAdminState = { status: "idle" };

export function InviteAdminForm() {
  const [state, formAction, isPending] = useActionState(inviteAdmin, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Full Name
          </label>
          <input id="fullName" name="fullName" type="text" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      {state.status === "success" ? (
        <p role="status" className="text-sm text-primary">
          {state.emailSent
            ? "✓ Invite sent — they'll get an email with a link to set their password."
            : "✓ That email already has an account — confirmed as an admin. No email was sent " +
              "since they already have a password (nothing to set)."}
        </p>
      ) : null}
      {state.status === "error" ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={`self-start ${primaryButtonClass}`}>
        {isPending ? "Sending…" : "Send Invite"}
      </button>
    </form>
  );
}
