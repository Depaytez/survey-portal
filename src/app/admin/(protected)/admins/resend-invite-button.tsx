"use client";

import { useState, useTransition } from "react";
import { resendInvite } from "./actions";

export function ResendInviteButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<"idle" | "sent" | "error">("idle");

  function handleClick() {
    setResult("idle");
    startTransition(async () => {
      const outcome = await resendInvite(email);
      setResult(outcome.success ? "sent" : "error");
    });
  }

  return (
    <span className="flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="font-medium text-primary hover:underline disabled:opacity-50"
      >
        {isPending ? "Resending…" : "Resend invite"}
      </button>
      {result === "sent" ? <span className="text-primary">✓ Sent</span> : null}
      {result === "error" ? (
        <span className="text-red-600 dark:text-red-400">Failed</span>
      ) : null}
    </span>
  );
}
