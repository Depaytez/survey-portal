import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../login/actions";
import { SiteBackground } from "@/components/site-background";
import { BrandMark } from "@/components/brand-mark";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/surveys", label: "Surveys" },
];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="relative min-h-screen">
      <SiteBackground variant="admin" />
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-background dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <BrandMark href="/admin/dashboard" size="sm" />
          <div className="flex items-center gap-4">
            <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
              {session.email ?? session.profile.full_name}
            </p>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-1 px-4 pb-2 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm font-medium text-zinc-600 hover:bg-primary/10 hover:text-primary dark:text-zinc-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
