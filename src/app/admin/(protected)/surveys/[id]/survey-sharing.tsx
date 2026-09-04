"use client";

import { useState } from "react";
import { secondaryButtonClass } from "@/lib/ui";

export function SurveySharing({ slug }: { slug: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const path = `/survey/${slug}`;

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 3000);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Public Survey Link</p>
      <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">{path}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleCopy} className={secondaryButtonClass}>
          Copy Link
        </button>
        <a href={path} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
          Open Survey
        </a>
        {copyState === "copied" ? (
          <span role="status" className="text-sm text-primary">
            ✓ Survey link copied
          </span>
        ) : null}
        {copyState === "failed" ? (
          <span role="alert" className="text-sm text-red-600 dark:text-red-400">
            Couldn&apos;t copy automatically — copy the link above manually.
          </span>
        ) : null}
      </div>
    </div>
  );
}
