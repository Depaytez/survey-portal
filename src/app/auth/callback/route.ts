import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Exchanges an invite/recovery `code` for a real session, then redirects
 * on to wherever the flow that generated the link wants next (e.g. the
 * admin invite flow sends people here on their way to
 * /admin/set-password). Route Handlers can write cookies directly, unlike
 * Server Components, so the shared server client's cookie writer actually
 * takes effect here.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Failed to exchange auth code for session:", error.message);
  }

  return NextResponse.redirect(`${origin}/admin/login?error=invite_link_invalid`);
}
