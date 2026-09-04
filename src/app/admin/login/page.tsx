import { LoginForm } from "./login-form";
import { SiteBackground } from "@/components/site-background";
import { BrandMark } from "@/components/brand-mark";

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const params = await searchParams;
  const redirectToParam = params.redirectTo;
  const redirectTo = Array.isArray(redirectToParam)
    ? redirectToParam[0]
    : redirectToParam;

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center px-4">
      <SiteBackground variant="admin" />
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <BrandMark href="/" />
        <h1 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Administrator Sign In
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to manage surveys and research data.
        </p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
