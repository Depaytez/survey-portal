"use client";

import { useState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";
import { OtpPasswordForm } from "@/components/otp-password-form";
import { inputClass, primaryButtonClass } from "@/lib/ui";

const idleState: ForgotPasswordState = { status: "idle" };

export function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  // Starting straight on "verify" when we already have an email (the
  // recovery email's own link carries it) skips a redundant re-request —
  // the person can go straight to entering the code they were just sent.
  const [step, setStep] = useState<"request" | "verify">(initialEmail ? "verify" : "request");
  const [email, setEmail] = useState(initialEmail);
  const [renderedAt] = useState(() => Date.now());
  const [isPending, setIsPending] = useState(false);

  async function handleRequest(formData: FormData) {
    setIsPending(true);
    const submittedEmail = String(formData.get("email") ?? "");
    setEmail(submittedEmail);
    // Always advance regardless of the result — whether or not that email
    // actually belongs to an account, the UI must look identical either
    // way (see actions.ts: same non-enumeration reasoning applies here).
    await requestPasswordReset(idleState, formData);
    setIsPending(false);
    setStep("verify");
  }

  if (step === "verify") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        >
          If that email belongs to an administrator account, we&apos;ve sent a code.
          Enter it below along with your new password.
        </p>
        <OtpPasswordForm
          type="recovery"
          defaultEmail={email}
          redirectTo="/admin/dashboard"
          codeLabel="Reset Code"
          submitLabel="Reset Password"
        />
        <button
          type="button"
          onClick={() => setStep("request")}
          className="self-start text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          Didn&apos;t get a code? Request a new one
        </button>
      </div>
    );
  }

  return (
    <form action={handleRequest} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={isPending} className={primaryButtonClass}>
        {isPending ? "Sending…" : "Send Reset Code"}
      </button>
    </form>
  );
}
