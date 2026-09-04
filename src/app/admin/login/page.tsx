import { LoginForm } from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const params = await searchParams;
  const redirectToParam = params.redirectTo;
  const redirectTo = Array.isArray(redirectToParam)
    ? redirectToParam[0]
    : redirectToParam;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Administrator Sign In
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          African Tourism Research Platform
        </p>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
