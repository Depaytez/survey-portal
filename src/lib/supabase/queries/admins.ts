import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminProfile = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  /** True if they've never actually signed in — e.g. still sitting on an unopened invite. */
  isPending: boolean;
};

/**
 * RLS (profiles_admin_select_all) authorizes the profile read. Email isn't
 * stored in `profiles` on purpose (single source of truth stays
 * auth.users) — this cross-references the two via the service-role Admin
 * API, which is the only way to read auth.users at all. Read-only, and
 * only ever reachable through /admin/admins which is itself
 * requireAdmin()-gated.
 */
export async function listAdmins(): Promise<AdminProfile[]> {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to list admins:", error.message);
    return [];
  }

  const admin = createAdminClient();
  const { data: usersPage, error: usersError } = await admin.auth.admin.listUsers();

  if (usersError) {
    console.error("Failed to look up admin emails:", usersError.message);
    // Degrade gracefully rather than showing nothing — names/dates still work.
    return profiles.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: "(unknown)",
      createdAt: row.created_at,
      isPending: false,
    }));
  }

  const usersById = new Map(usersPage.users.map((u) => [u.id, u]));

  return profiles.map((row) => {
    const user = usersById.get(row.id);
    return {
      id: row.id,
      fullName: row.full_name,
      email: user?.email ?? "(unknown)",
      createdAt: row.created_at,
      isPending: !user?.last_sign_in_at,
    };
  });
}
