import { requireAdmin } from "@/lib/auth";
import { SetPasswordForm } from "./set-password-form";
import { SiteBackground } from "@/components/site-background";
import { BrandMark } from "@/components/brand-mark";

// Not under src/app/admin/(protected), so it doesn't inherit that layout's
// requireAdmin() call — needs its own. Per Next's own proxy docs: "Always
// verify authentication and authorization inside each Server Function
// rather than relying on Proxy alone." Calling requireAdmin() here also
// makes this page correctly dynamic (it reads cookies internally), so it
// can no longer be served from a stale build-time snapshot either.
export default async function SetPasswordPage() {
  await requireAdmin();

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <SiteBackground variant="admin" />
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <BrandMark href="/" />
        <h1 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Set Your Password
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Choose a password for your administrator account.
        </p>
        <SetPasswordForm />
      </div>
    </div>
  );
}
