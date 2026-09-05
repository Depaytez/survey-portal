import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/accept-invite"];

/**
 * Refreshes the Supabase session on every request and performs a first-pass
 * gate on /admin/**. This is not the authorization boundary by itself —
 * every protected admin layout/page re-verifies the session and admin role
 * server-side (see src/lib/auth.ts) so a stale or forged cookie can never
 * grant access on its own.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Must run immediately after client creation — this both validates the
  // token and refreshes it, keeping the cookie session alive.
  const { data } = await supabase.auth.getClaims();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isAdminRoute && !isPublicAdminPath && !data?.claims) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
