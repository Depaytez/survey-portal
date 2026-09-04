"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setPasswordSchema } from "@/lib/validation/admin-invite";
import { inputClass, primaryButtonClass } from "@/lib/ui";

export function SetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const parsed = setPasswordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    setIsPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
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
        {isPending ? "Saving…" : "Set Password"}
      </button>
    </form>
  );
}
