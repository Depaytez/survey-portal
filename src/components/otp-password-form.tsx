"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { otpPasswordSchema } from "@/lib/validation/admin-invite";
import { inputClass, primaryButtonClass } from "@/lib/ui";

/**
 * The "enter the code we emailed you, then choose a password" step shared
 * by invite acceptance and password reset. Both used to work via a
 * clickable email link exchanged at /auth/callback — but email security
 * scanners (Gmail, Microsoft Defender Safe Links, corporate mail gateways)
 * "click" links to scan them before a human ever does, which burns a
 * one-time link token and leaves the real person stuck. A numeric code
 * typed in by hand has nothing for a scanner to consume.
 *
 * verifyOtp() itself establishes the session (same job /auth/callback used
 * to do via exchangeCodeForSession) — updateUser() then sets the password
 * using that fresh session, same as the old set-password form did.
 */
export function OtpPasswordForm({
  type,
  defaultEmail = "",
  redirectTo,
  codeLabel = "Code",
  submitLabel = "Continue",
}: {
  type: "invite" | "recovery";
  defaultEmail?: string;
  redirectTo: string;
  codeLabel?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const parsed = otpPasswordSchema.safeParse({
      email: formData.get("email"),
      code: formData.get("code"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsPending(true);
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: parsed.data.email,
      token: parsed.data.code,
      type,
    });

    if (verifyError) {
      setIsPending(false);
      setError(
        verifyError.message.toLowerCase().includes("expired")
          ? "That code has expired. Request a new one and try again."
          : "That code is invalid. Double-check the email and try again.",
      );
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    setIsPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {codeLabel}
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={10}
          placeholder="Enter the code from your email"
          required
          className={`${inputClass} tracking-widest`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={primaryButtonClass}>
        {isPending ? "Please wait…" : submitLabel}
      </button>
    </form>
  );
}
