"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/request-origin";
import { isHoneypotTripped, isSubmittedTooFast } from "@/lib/spam-protection";

export type ForgotPasswordState = {
  status: "idle" | "success" | "error";
  error?: string;
};

const emailSchema = z.string().trim().min(1).email();

// Deliberately vague on success either way — confirming or denying that an
// email belongs to an admin account would let someone enumerate admin
// addresses. Supabase's own resetPasswordForEmail behaves the same way
// (it doesn't reveal whether the address exists).
const GENERIC_SUCCESS: ForgotPasswordState = { status: "success" };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  if (isHoneypotTripped(formData) || isSubmittedTooFast(formData)) {
    return GENERIC_SUCCESS;
  }

  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { status: "error", error: "Enter a valid email address" };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/admin/set-password`,
  });

  if (error) {
    // Log server-side for our own visibility, but never surface the real
    // reason to the client — same non-enumeration reasoning as above.
    console.error("Password reset request failed:", error.message);
  }

  return GENERIC_SUCCESS;
}
