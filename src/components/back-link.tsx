import Link from "next/link";

/** The "← Back to X" link repeated at the top of every admin detail page. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
    >
      ← {children}
    </Link>
  );
}
