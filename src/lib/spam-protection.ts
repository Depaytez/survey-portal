import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const MIN_SUBMIT_TIME_MS = 800;
const COOLDOWN_MINUTES = 5;

/** A hidden field real visitors never see or fill; bots that fill every field trip it. */
export function isHoneypotTripped(formData: FormData): boolean {
  return Boolean(formData.get("website"));
}

/** Rejects submissions faster than a human could plausibly fill the form. */
export function isSubmittedTooFast(formData: FormData): boolean {
  const renderedAt = Number(formData.get("renderedAt"));
  if (!Number.isFinite(renderedAt)) return true;
  return Date.now() - renderedAt < MIN_SUBMIT_TIME_MS;
}

/**
 * Uses the service-role client for a narrow, server-only existence check
 * (no row data returned to the caller) — public RLS intentionally grants no
 * SELECT on these tables, so a short cooldown per email can only be
 * enforced this way. Fails open on infrastructure errors so a Supabase
 * hiccup never blocks a legitimate submission.
 */
export async function isRecentlySubmitted(
  table: "customer_care_requests" | "stakeholder_requests",
  email: string,
): Promise<boolean> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  if (error) {
    console.error(`Rate-limit check failed for ${table}:`, error.message);
    return false;
  }

  return (count ?? 0) > 0;
}
