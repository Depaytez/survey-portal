import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AdminSession = {
  userId: string;
  email: string | undefined;
  profile: Profile;
};

/**
 * The real authorization boundary for /admin/**. The proxy only checks that
 * a session exists; this re-verifies the session against Supabase (via
 * getClaims, which validates the JWT) and confirms the user has an admin
 * profile row, on every call — so a session that is valid but no longer
 * admin (e.g. a revoked profile) is rejected immediately rather than on
 * next sign-in.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  const userId = data.claims.sub;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/admin/login");
  }

  return {
    userId,
    email: typeof data.claims.email === "string" ? data.claims.email : undefined,
    profile,
  };
}
