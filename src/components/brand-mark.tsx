import Link from "next/link";

/**
 * The platform's mark: a small abstract sun-over-hills motif (radiating
 * arcs + a rounded horizon) built from the same green/amber/terracotta
 * palette as the rest of the brand — not a stand-in for a real supplied
 * logo, but a deliberate, consistent identity for this product until one
 * is provided.
 */
function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="var(--primary)" />
      <path
        d="M4 22c3-5 7-8 12-8s9 3 12 8"
        fill="none"
        stroke="var(--accent-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="13" r="5" fill="var(--accent)" />
    </svg>
  );
}

export function BrandMark({
  href = "/",
  size = "md",
}: {
  href?: string;
  size?: "sm" | "md";
}) {
  const iconClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <Link href={href} className="flex items-center gap-2.5">
      <Mark className={iconClass} />
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          African Tourism
        </span>
        <span className="block text-[11px] font-medium uppercase tracking-wider text-accent">
          Research Platform
        </span>
      </span>
    </Link>
  );
}
