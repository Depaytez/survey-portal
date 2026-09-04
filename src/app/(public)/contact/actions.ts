"use server";

import { createClient } from "@/lib/supabase/server";
import { customerCareSchema } from "@/lib/validation/public";
import {
  isHoneypotTripped,
  isSubmittedTooFast,
  isRecentlySubmitted,
} from "@/lib/spam-protection";

export type ContactActionState = {
  status: "idle" | "success" | "error";
  error?: string;
};

export async function submitCustomerCareRequest(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  if (isHoneypotTripped(formData) || isSubmittedTooFast(formData)) {
    // Report success without writing anything — don't tip off automated
    // submitters that they were caught.
    return { status: "success" };
  }

  const parsed = customerCareSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    category: formData.get("category"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (await isRecentlySubmitted("customer_care_requests", parsed.data.email)) {
    return {
      status: "error",
      error: "You've already sent a message recently. We'll be in touch soon.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("customer_care_requests").insert(parsed.data);

  if (error) {
    console.error("Failed to persist customer care request:", error.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
