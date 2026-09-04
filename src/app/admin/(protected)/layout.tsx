import { requireAdmin } from "@/lib/auth";
import { signOut } from "../login/actions";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            African Tourism Research Platform
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Signed in as {session.email ?? session.profile.full_name}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
