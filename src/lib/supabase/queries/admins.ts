import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  fullName: string;
  createdAt: string;
};

/** RLS (profiles_admin_select_all) is what actually authorizes this — any admin can see every admin profile. */
export async function listAdmins(): Promise<AdminProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to list admins:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    createdAt: row.created_at,
  }));
}
