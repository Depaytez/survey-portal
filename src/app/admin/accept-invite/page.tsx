import { SiteBackground } from "@/components/site-background";
import { BrandMark } from "@/components/brand-mark";
import { OtpPasswordForm } from "@/components/otp-password-form";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email : "";

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <SiteBackground variant="admin" />
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <BrandMark href="/" />
        <h1 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Activate Your Admin Account
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Enter the code from your invite email and choose a password.
        </p>
        <div className="mt-6">
          <OtpPasswordForm
            type="invite"
            defaultEmail={email}
            redirectTo="/admin/dashboard"
            codeLabel="Invite Code"
            submitLabel="Activate Account"
          />
        </div>
      </div>
    </div>
  );
}
