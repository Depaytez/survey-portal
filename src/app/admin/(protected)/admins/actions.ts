"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteAdminSchema } from "@/lib/validation/admin-invite";

export type InviteAdminState = {
  status: "idle" | "success" | "error";
  error?: string;
};

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
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
  const origin = await getOrigin();

  const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to look up existing users:", listError.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  const existing = existingUsers.users.find((u) => u.email === parsed.data.email);
  let userId: string;

  if (existing) {
    userId = existing.id;
  } else {
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
      parsed.data.email,
      { redirectTo: `${origin}/auth/callback?next=/admin/set-password` },
    );

    if (inviteError || !invited.user) {
      console.error("Failed to invite admin:", inviteError?.message);
      return { status: "error", error: inviteError?.message ?? "Failed to send the invite." };
    }

    userId = invited.user.id;
  }

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: userId, full_name: parsed.data.fullName, role: "admin" });

  if (profileError) {
    console.error("Failed to create admin profile:", profileError.message);
    return { status: "error", error: "Invite sent, but setting up the admin profile failed." };
  }

  revalidatePath("/admin/admins");
  return { status: "success" };
}
