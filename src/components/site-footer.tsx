import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-background/85 backdrop-blur-md dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-zinc-600 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} African Tourism Research Platform.
        </p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Contact
          </Link>
          <Link
            href="/stakeholder-interest"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Partner With Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
