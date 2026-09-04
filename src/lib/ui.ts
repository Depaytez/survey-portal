// Shared class strings for the brand palette (green primary / brown accent /
// black-zinc neutrals, see src/app/globals.css). Centralized because these
// were previously duplicated verbatim across every form and CTA — a single
// definition here is what keeps new pages from drifting to ad hoc colors.

export const primaryButtonClass =
  "rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-md border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40";

export const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

// Content surface used on public pages that sit over the fixed background
// photo (see SiteBackground) — opaque enough that body text always clears
// WCAG 1.4.3 regardless of what's behind it, per W3C technique G18's own
// example of "fogging" an image behind text rather than placing text
// directly on unpredictable image content.
export const panelClass =
  "rounded-lg border border-zinc-200 bg-background/90 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800";
