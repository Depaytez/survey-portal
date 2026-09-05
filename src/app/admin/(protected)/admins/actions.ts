"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestOrigin } from "@/lib/request-origin";
import { inviteAdminSchema } from "@/lib/validation/admin-invite";

export type InviteAdminState = {
  status: "idle" | "success" | "error";
  error?: string;
  // Distinguishes "a real invite email was sent" from "that email already
  // had a confirmed account — we just confirmed/updated their admin
  // profile, nothing was emailed" so the UI never claims an email went out
  // when it didn't.
  emailSent?: boolean;
};

function inviteRedirectTo(origin: string): string {
  return `${origin}/auth/callback?next=/admin/set-password`;
}

export async function inviteAdmin(
  _prevState: InviteAdminState,
  formData: FormData,
): Promise<InviteAdminState> {
  // Only an existing admin can invite another — this is the real
  // authorization boundary for what is otherwise a privileged,
  // service-role-only operation.
  await requireAdmin();

  const parsed = inviteAdminSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const admin = createAdminClient();
  const origin = await getRequestOrigin();

  // inviteUserByEmail is tried unconditionally first rather than
  // pre-checking listUsers(): Supabase itself distinguishes the two cases
  // that matter — a brand-new email or a still-pending (invited but never
  // confirmed) one both succeed and (re)send the email, while an already
  // *confirmed* admin's email comes back as the specific `email_exists`
  // error. That's the only case where we skip sending anything.
  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    parsed.data.email,
    { redirectTo: inviteRedirectTo(origin) },
  );

  let userId: string;
  let emailSent: boolean;

  if (inviteError) {
    if (inviteError.code !== "email_exists") {
      console.error("Failed to invite admin:", inviteError.message);
      return { status: "error", error: inviteError.message };
    }

    const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers();
    if (listError) {
      console.error("Failed to look up existing user:", listError.message);
      return { status: "error", error: "Something went wrong. Please try again." };
    }
    const existing = existingUsers.users.find((u) => u.email === parsed.data.email);
    if (!existing) {
      return { status: "error", error: "Something went wrong looking up that account." };
    }
    userId = existing.id;
    emailSent = false;
  } else {
    userId = invited.user.id;
    emailSent = true;
  }

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: userId, full_name: parsed.data.fullName, role: "admin" });

  if (profileError) {
    console.error("Failed to create admin profile:", profileError.message);
    return {
      status: "error",
      error: emailSent
        ? "Invite email sent, but setting up the admin profile failed."
        : "Something went wrong updating that admin's profile.",
    };
  }

  revalidatePath("/admin/admins");
  return { status: "success", emailSent };
}

export type ResendInviteState = { success: true } | { success: false; error: string };

/**
 * For a still-pending invitee only (see listAdmins' isPending). Calling
 * inviteUserByEmail again on the same not-yet-confirmed address simply
 * resends the invite — verified directly against Supabase, not assumed.
 */
export async function resendInvite(email: string): Promise<ResendInviteState> {
  await requireAdmin();

  const admin = createAdminClient();
  const origin = await getRequestOrigin();

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: inviteRedirectTo(origin),
  });

  if (error) {
    console.error(`Failed to resend invite to ${email}:`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
