"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { requestStatuses, type RequestStatus } from "@/lib/validation/requests";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateCustomerCareStatus(
  id: string,
  status: RequestStatus,
): Promise<ActionResult> {
  await requireAdmin();

  if (!requestStatuses.includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customer_care_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Failed to update customer care request status:", error.message);
    return { success: false, error: "Something went wrong updating the status." };
  }

  revalidatePath("/admin/customer-care");
  return { success: true };
}
