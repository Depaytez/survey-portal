import Link from "next/link";

const NAV_LINKS = [
  { href: "/#participate", label: "Take the Survey" },
  { href: "/stakeholder-interest", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
        >
          African Tourism Research Platform
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
