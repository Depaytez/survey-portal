"use server";

import { createClient } from "@/lib/supabase/server";
import { stakeholderRequestSchema } from "@/lib/validation/public";
import {
  isHoneypotTripped,
  isSubmittedTooFast,
  isRecentlySubmitted,
} from "@/lib/spam-protection";

export type StakeholderActionState = {
  status: "idle" | "success" | "error";
  error?: string;
};

export async function submitStakeholderRequest(
  _prevState: StakeholderActionState,
  formData: FormData,
): Promise<StakeholderActionState> {
  if (isHoneypotTripped(formData) || isSubmittedTooFast(formData)) {
    return { status: "success" };
  }

  const parsed = stakeholderRequestSchema.safeParse({
    organizationName: formData.get("organizationName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    interestType: formData.get("interestType"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (await isRecentlySubmitted("stakeholder_requests", parsed.data.email)) {
    return {
      status: "error",
      error: "You've already submitted a request recently. We'll be in touch soon.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("stakeholder_requests").insert({
    organization_name: parsed.data.organizationName,
    contact_name: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    interest_type: parsed.data.interestType,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Failed to persist stakeholder request:", error.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}
