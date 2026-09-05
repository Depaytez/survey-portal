"use client";

import { useState, useTransition } from "react";
import { requestStatuses, type RequestStatus } from "@/lib/validation/requests";
import type { ActionResult } from "./customer-care/actions";

const STATUS_STYLES: Record<RequestStatus, string> = {
  NEW: "bg-primary/10 text-primary",
  IN_PROGRESS: "bg-accent/10 text-accent",
  RESOLVED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  CLOSED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

export function RequestStatusSelect({
  id,
  status,
  onUpdate,
}: {
  id: string;
  status: RequestStatus;
  onUpdate: (id: string, status: RequestStatus) => Promise<ActionResult>;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: RequestStatus) {
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const result = await onUpdate(id, next);
      if (!result.success) setCurrent(previous);
    });
  }

  return (
    <select
      value={current}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as RequestStatus)}
      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${STATUS_STYLES[current]}`}
    >
      {requestStatuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
